module Demandware

    require 'rubygems'
    require 'net/dav'
    require 'find'
    require 'pathname'
    require 'uri'

    class Uploader
        def initialize(opts)
            @user = opts.user
            @pass = opts.password
            @local_dir = opts.local_dir

            @two_factor_auth_required = opts.two_factor_auth_required
            @certificate_file = opts.certificate_file
            @key_file = opts.key_file
            @passphrase = opts.passphrase

            @base_dir = File.dirname(__FILE__)
        end

        def self.log_action(logMessage)
            puts "[#{Time.now.strftime('%FT%T.%L')}] #{logMessage}"
        end

        def setup(remote_dir_url)
            dav = Net::DAV.new(remote_dir_url)
            dav.verify_server = false
            dav.credentials(@user, @pass)

            if @two_factor_auth_required
                dav.ssl_certificate(File.join(@base_dir, @certificate_file), File.join(@base_dir, @key_file), @passphrase)
            end

            return dav
        end

        def upload_file(local_file_name, remote_dir_url)
            dav = setup(remote_dir_url)

            short_file_name = Pathname.new(local_file_name).basename.to_s

            if remote_dir_url.end_with? "/" then
                dav_path = remote_dir_url + short_file_name
            else
                dav_path = remote_dir_url + "/" + short_file_name
            end            

            dav_path = URI.escape(dav_path)

            Uploader::log_action("Uploading #{short_file_name} to #{dav_path} ...")
            File.open(local_file_name, "r") do |infile|
                dav.put(dav_path, infile, File.size(local_file_name))
            end

            Uploader::log_action("Finished uploading #{short_file_name} to #{dav_path}.")
       end

        def upload(remote_dir_url, cleanup = true)
            Uploader::log_action("Uploading cartriges to DW's WebDAV ...")

            clean_local_dir = @local_dir.chomp("/")
            clean_remote_url = remote_dir_url.chomp("/")

            dav = setup(clean_remote_url)

            prepare_destination_dir(dav, clean_remote_url, cleanup)

            Find.find(clean_local_dir) do |path|
                dest_path = path[clean_local_dir.length..-1]
                next if dest_path.nil? || dest_path.length == 0
                next if dest_path.index("/jsdoc/")

                dav_path = "#{clean_remote_url}#{dest_path}"
                dav_path = URI.escape(dav_path)

                if FileTest.directory?(path) then
                    Uploader::log_action("Creating dir '#{dav_path}'")
                    begin
                        dav.mkdir(dav_path)
                    rescue Exception => e
                        Uploader::log_action("Verifying if dir already exists '#{dav_path}'")
                        if( !dav.exists?(dav_path))
                            raise e
                        end
                    end
                else
                    Uploader::log_action("Uploading file '#{dav_path}'")
                    File.open(path, "r") do |infile|
                        dav.put(dav_path, infile, File.size(path))
                    end
                end
            end

            Uploader::log_action("Finished uploading cartriges to DW's WebDAV.")
        end

        def prepare_destination_dir(dav, remote_dir_url, cleanup)
            if dav.exists? remote_dir_url then
                if cleanup then
                    Uploader::log_action("Remove all files from destination directory #{remote_dir_url}...")
                    dav.find(remote_dir_url, :recursive => false) do | it |
                        dav.delete(it.uri)
                    end
                    Uploader::log_action("Finished remove all files from destination directory #{remote_dir_url}.")
                end
            else
                puts "Remote destination directory doesn't exist. Trying to create it...#{remote_dir_url}"
                dav.mkdir(remote_dir_url)
            end
        end
    end
end
