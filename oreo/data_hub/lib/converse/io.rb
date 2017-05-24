require 'fileutils'

module Converse
    module IO

        extend self

        def safe_copy(file_path, new_file_name)
            unless File.exists?(file_path)
                raise IOError.new "Source file doesn't exist"
            end

            if new_file_name.blank?
                raise IOError.new "Destination file name can't be blank"
            end

            new_file_path = File.join(File.dirname(file_path), new_file_name)
            temp_file_path = "#{new_file_path}.tmp"

            FileUtils.cp(file_path, temp_file_path)
            FileUtils.mv(temp_file_path, new_file_path)
        end

        def get_default_file_suffix
            "-processed-#{Time.now.strftime('%Y%m%d_%H%M')}"
        end

        def add_suffix_to_file(file_path, suffix)
            file_pathname = Pathname.new(file_path)
            File.join(file_pathname.dirname, "#{file_pathname.basename(".*")}#{suffix}#{file_pathname.extname}")
        end

        def mark_file_processed(file_path, suffix = nil)
            processed_file_path = add_suffix_to_file(file_path, suffix || get_default_file_suffix)
            FileUtils.mv(file_path, processed_file_path)
        end

    end
end
