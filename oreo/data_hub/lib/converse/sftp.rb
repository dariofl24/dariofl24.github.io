require 'rubygems'
require 'net/sftp'

require 'converse/logging'

module Converse
    module SFTP

        class SFTPClient
            include Converse::Logging

            attr_reader :options, :logger

            def initialize(options, logger = nil)
                @options = options
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def upload_files(source_files, destination_dir = nil)
                connect_and_upload source_files, destination_dir do | sftp |
                    source_files.each do |source_file|
                        sftp.upload!(source_file, File.join(destination_dir, File.basename(source_file)))
                    end
                end
            end

            def upload(source_file, destination_dir = nil)
                connect_and_upload source_file, destination_dir do | sftp |
                    sftp.upload!(source_file, File.join(destination_dir, File.basename(source_file)))
                end
            end

            private

            def connect_and_upload(source_file, destination_dir = nil, &upload_block)
                host = options['sftp_host']
                username = options['sftp_username']
                password = options['sftp_password']
                port = options['sftp_port']

                @logger.debug("Connecting to SFTP host '#{host}' through port '#{port}'and authenticating with user '#{username}' ...")

                # At the moment of implementing this solution there is a "bug" (which is not
                # actually a bug) in ruby's SSH implementation:
                # https://github.com/net-ssh/net-ssh/issues/93
                #
                # In a nutshell, there is an issue with some routers (Nike) closing the connection because the initial key
                # being sent by NET::SSH is too long. It works by making it shorter, which is why we are doing the following:
                Net::SSH::Transport::Algorithms::ALGORITHMS[:encryption] = %w(aes128-cbc 3des-cbc blowfish-cbc cast128-cbc
                                                                                aes192-cbc aes256-cbc none arcfour128 arcfour256 arcfour
                                                                                aes128-ctr aes192-ctr aes256-ctr cast128-ctr blowfish-ctr 3des-ctr)

                Net::SFTP.start(host, username, { :password => password, :port => port }) do |sftp|
                    unless destination_dir.blank?
                        @logger.info("SFTPing file(s): #{source_file} to remote directory: #{destination_dir} ...")
                        yield sftp if block_given?

                    end
                end
            end

        end
    end
end
