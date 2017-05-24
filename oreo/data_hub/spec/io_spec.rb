require_relative "support/spec_helper"

require "converse/io"

describe IO do

    before(:each) do
        @dummy_class = Class.new { extend Converse::IO }
    end

    describe "#safe_copy" do

        context "with null file path and null file name" do
            it "should raise an error" do
                expect { @dummy_class.safe_copy(nil, nil) }.to raise_error(TypeError)
            end
        end

        context "with non-existing file and empty file name" do
            it "should raise IO error" do
                expect { @dummy_class.safe_copy("does/not/exist/test.txt", "") }.to raise_error(IOError)
            end
        end

        context "with non-existing file and valid file name" do
            it "should raise IO error" do
                expect { @dummy_class.safe_copy("does/not/exist/test.txt", "copy.txt") }.to raise_error(IOError, "Source file doesn't exist")
            end
        end

        context "with existing file and empty file name", fakefs: true do
            it "should raise IO error" do
                test_dir = "/tmp/tests"
                src_file_path = File.join(test_dir, "test.txt")

                FileUtils.mkdir_p(test_dir)
                FileUtils.touch(src_file_path)

                expect { @dummy_class.safe_copy(src_file_path, "") }.to raise_error(IOError, "Destination file name can't be blank")
            end
        end

        context "with existing file and valid file name", fakefs: true do
            it "should copy the file" do
                content = "some content goes here"
                test_dir = "/tmp/tests"
                src_file_path = File.join(test_dir, "test.txt")
                dest_file_path = File.join(test_dir, "copy.txt")

                FileUtils.mkdir_p(test_dir)
                File.open(src_file_path, "w") do |f|
                    f << content
                end

                @dummy_class.safe_copy(src_file_path, "copy.txt")

                File.exists?(dest_file_path).should == true
                File.read(dest_file_path).should == content
                File.size(dest_file_path).should == File.size(src_file_path)
            end
        end

    end

end

