require 'rubygems'
require 'net/ftp'

module Converse
    module FTP

        class FTPClient

            attr_reader :options, :logger

            def initialize(options, logger = nil)
                @options = options
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def connect
                host = options['ftp_host']
                username = options['ftp_username']
                password = options['ftp_password']

                ftp = Net::FTP.new
                ftp.passive = options['ftp_passive']

                logger.debug("Connecting to FTP host #{host}...")
                ftp.connect(host)

                logger.debug("Authenticating as #{username}...")
                ftp.login(username, password)

                ftp
            end

            def upload(source_file, destination_dir = nil)
                ftp = connect

                unless destination_dir.blank?
                    logger.debug("Changing to remote directory: #{destination_dir}...")
                    ftp.chdir(destination_dir)
                end

                logger.debug("Putting binary file: #{source_file}...")
                ftp.putbinaryfile(source_file, File.basename(source_file))
            end
        end

    end
end
