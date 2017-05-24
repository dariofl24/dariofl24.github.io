require_relative "support/spec_helper"

require "converse/sftp"

describe Converse::SFTP::SFTPClient do

    context "Initialization" do

        it "should receive options and logger when configured" do
            options_mock = {}
            logger_mock = Logger.new "sftp-000001.log"
            sftp_client = Converse::SFTP::SFTPClient.new(options_mock, logger_mock)

            sftp_client.options == options_mock
            sftp_client.logger == logger_mock
        end

        it "should generate its own logger" do
            options_mock = {}
            sftp_client = Converse::SFTP::SFTPClient.new(options_mock)

            sftp_client.options == options_mock
            sftp_client.logger.respond_to? :info
        end

    end

    context "Uploading files" do

        it "Should upload a file" do
            sftp_mock = mock('sftp')
            sftp_mock.should_receive(:upload!)

            Net::SFTP.stub(:start).and_yield(sftp_mock)
            File.stub(:exists?).and_return(true)

            sftp_client = Converse::SFTP::SFTPClient.new({})
            sftp_client.upload("test_file", "/tmp")

        end

        it "Should upload multiple files" do
            sftp_mock = mock('sftp')
            sftp_mock.should_receive(:upload!).twice

            Net::SFTP.stub(:start).and_yield(sftp_mock)
            File.stub(:exists?).and_return(true)

            sftp_client = Converse::SFTP::SFTPClient.new({})
            sftp_client.upload_files(["test_file", "test2"], "/tmp")

        end
    end

end
