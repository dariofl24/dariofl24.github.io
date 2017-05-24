#!/usr/bin/ruby

require 'trollop'
require 'rubygems'
require 'open-uri'
require "net/http"
require "net/https"
require "uri"
require 'nokogiri'

opts = Trollop::options do
    banner <<-EOS
    Tail for remote Demandware log files.
    Based on a filepattern, this script looks for the most recent log filename that matches it
    and starts retrieving portions of the log file based on if the file contains new data.

    Usage:

      ./dwtail.rb [options]

    Examples:

    Tail for customerror files in my sandbox
    ./dwtail.rb --host dev10.store.converse.demandware.net --username hherrera --password xxxxxx --filepattern customerror

    Tail for custominfo files in my sandbox
    ./dwtail.rb --host dev10.store.converse.demandware.net --username hherrera --password xxxxxx --filepattern custominfo

    Tail for error-blade files in my sandbox
    ./dwtail.rb --host dev10.store.converse.demandware.net --username hherrera --password xxxxxx --filepattern error-blade

    Where [options] are:
EOS
    opt :host, "Host to look for the logs", :type=>String, :required=>true
    opt :username, "Username to log into the given host", :type=>String, :required=>true
    opt :password, "Password to log into the given host", :type=>String, :required=>true
    opt :filepattern, "Pattern of the file to look for", :type=>String, :required=>true
end

$host = opts[:host]
$username = opts[:username]
$password = opts[:password]
$filepattern = opts[:filepattern]

$logs_path = "/on/demandware.servlet/webdav/Sites/Logs/"

$previous_file_size = 1000

def get_http_session
  url = "https://#{$host}#{$logs_path}"
  uri = URI.parse(url)

  http = Net::HTTPSession.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  return http
end

def get_file_size(http, file_path)
    request = Net::HTTP::Head.new(file_path)
    request.basic_auth $username, $password
    http.request(request).content_length
end

def get_partial_content(http, file_path, initial_bytes, end_bytes)
    request = Net::HTTP::Get.new(file_path)
    request.basic_auth $username, $password
    request.add_field('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36')
    request.add_field 'Content-Range', '#{initial_bytes}-#{end_bytes}'
    http.request(request).body
end

def get_content(http, file_path)
    request = Net::HTTP::Get.new(file_path)
    request.basic_auth $username, $password
    request.add_field('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36')
    http.request(request).body
end

get_http_session.start{ |http|

    previous_file = ""
    most_recent_file = ""

    while(true)
        log_files_list_page = get_content(http, $logs_path)

        log_files_list_nokogiri = Nokogiri::HTML(log_files_list_page)

        log_files_list_nokogiri.css("title").each do |title|
            if title.content.include? "401"
                puts "Unauthorized access. Please verify your credentials for #{$host}"
                exit
            end
        end

        log_files_list_nokogiri.css("tt").each do |tt|
          if tt.content.include?  $filepattern
              # Assuming they are ordered in the log_files_list_page
              most_recent_file = tt.content
          end

        end

        if most_recent_file
            most_recent_file_path = $logs_path + most_recent_file

            most_recent_file_size = get_file_size(http, most_recent_file_path)
            if( previous_file != most_recent_file )
                $previous_file_size = 1000
                previous_file = most_recent_file
            end

            if $previous_file_size != most_recent_file_size
                puts "[tail] --- "
                puts "[tail] ---  #{most_recent_file_path} [New file size: #{most_recent_file_size}]"
                puts "[tail] --- "
                puts get_partial_content(http, most_recent_file_path, $previous_file_size, most_recent_file_size)
                $previous_file_size = most_recent_file_size
            end
        end

        sleep 2
    end
}


