#!/usr/bin/env ruby
require_relative "upload_template_base"
opts = get_options()

pwd = Dir.pwd
puts "Current directory: #{pwd}"

Dir.chdir("#{opts.confoo_root_dir}/site_template")

#Should be the same as zip file name so the import works properly
tmp_dir_name = File.basename(opts.zip_file, '.*')

perform_environment_override(opts.env_override, tmp_dir_name)

perform_features_generation(tmp_dir_name)

perform_sites_urls_generation(opts.host, tmp_dir_name)

zip_file_path = create_zip(tmp_dir_name, opts.zip_file)

upload_and_import_template_zip(opts, zip_file_path)

# Restore intial directory
Dir.chdir(pwd)
