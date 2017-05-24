require 'net/sftp'
require 'net/ssh'
require 'yaml'

class SftpGetter

  def initialize(config) 
    config_file = File.join(File.dirname(__FILE__), '../config', config)
    @config = YAML.load(File.open(config_file))
  end

  def download
    begin
      session()
    rescue Exception => e
      puts e.message
    end
  end

private

  # slurp the file without local blocking
  def do_download(sftp, remote_fn) 
    result = Hash.new
    result[:file_name] = remote_fn
    result[:local_buffer] = StringIO.new
    result[:remote_file] = File.join(@config[:remote_dir], remote_fn)
    result[:download_handle] = sftp.download(result[:remote_file], result[:local_buffer])
    result
  end

  # burp the file without remote blocking
  def process_downloads(downloads) 
    downloads.each do |dwnld| 
      dwnld[:download_handle].wait
      dwnld[:download_handle] = nil
      File.open(File.join(@config[:local_dir], dwnld[:file_name]), 'w') { |file| file.write dwnld[:local_buffer].string }
      dwnld[:local_buffer] = nil
    end
  end

  def session() 
    Net::SFTP.start(@config[:remote_host], @config[:user], :password => @config[:password], :auth_methods => [ "password" ] ) do |sftp| 
      remote_names = sftp.dir.entries(@config[:remote_dir])
      remote_names.delete_if { |remote_fn| remote_fn.name =~ /^\.\.?$/ }
      # map will slurp all files asyncronously -- might be too much contention over connection
      downloads = remote_names.map { |remote_fn| do_download(sftp, remote_fn.name) } 
      process_downloads(downloads) 
      downloads.each { |dwnl| sftp.remove!(dwnl[:remote_file]) }
    end
  end

end

ARGV.each do |arg| 
  SftpGetter.new(arg).download
end
