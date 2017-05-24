#!/usr/bin/env ruby
require_relative "upload_template_base"
opts = get_options()

zip_file_path = Dir.glob("/tmp/staging_sync/Latest_Backup.zip")[0]
opts.zip_file = zip_file_path.split("/")[-1]

upload_and_import_template_zip(opts, zip_file_path)
