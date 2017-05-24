#!/usr/bin/env ruby

require 'trollop'
require 'curb'
require 'erb'

require_relative "global_constants"
require_relative "demandware_upload"
require_relative "site_template_importer"
require_relative "../tools/build_util"

include Demandware::GlobalConstants

def get_options
    opts = Trollop::options do
        opt :confoo_root_dir, "Confoo root directory path (confoo repository)", :type=>String, :required=>true
        opt :host, "Demandware host", :type=>String, :required=>true
        opt :user, "Demandware user", :type=>String, :required=>true
        opt :password, "Demandware password", :type=>String, :required=>true
        opt :two_factor_auth_required, "Indicates whether 2-factor authentication should be used", :default=>false
        opt :certificate_file, "Certificate file to be used for 2-factor authentication", :type=>String, :default=>DEFAULT_PATH_TO_CERT_FILE
        opt :key_file, "Key file to be used for 2-factor authentication", :type=>String, :default=>DEFAULT_PATH_TO_KEY_FILE
        opt :passphrase, "Passphrase for the certificate", :type=>String, :default=>DEFAULT_PASSPHRASE_FOR_CERT
        opt :zip_file, "Zip file to create and upload", :type=>String, :default=>"site_template.zip"
        opt :env_override, "A list of environment specific template folders", :type=>String, :required=>false, :multi=>true
        opt :bm_host, "Demandware BM host", :type=>String, :required => false
        opt :bm_user, "Demandware BM user", :type=>String, :required => false
        opt :bm_password, "Demandware BM password", :type=>String, :required => false
    end

    opts[:bm_host] = opts[:host] if opts[:bm_host].nil? || opts[:bm_host].empty?
    opts[:bm_user] = opts[:user] if opts[:bm_user].nil? || opts[:bm_user].empty?
    opts[:bm_password] = opts[:password] if opts[:bm_password].nil? || opts[:bm_password].empty?

    return opts
end

def perform_environment_override(env_override, tmp_dir_name)
    puts "Overriding templates with environment specific resources"

    if File.directory?("#{tmp_dir_name}")
        puts "  --> Cleaning up old temp directory before making a new one"
        system("rm -rfv #{tmp_dir_name}")
    end

    system("mkdir #{tmp_dir_name} && cp -R common/* #{tmp_dir_name}/")

    if env_override.to_a.empty? then
        puts "  --> No environment specific overrides provided"
    elsif
        env_override.each do |env_name|
            puts "  --> Overriding site template with content from site_template/#{env_name}"
            system("cp -R #{env_name}/* #{tmp_dir_name}/")
        end
    end
end

def perform_features_generation(tmp_dir_name)
    puts "Generating Feature.xml for all sites"

    content = ""
    content << '<?xml version="1.0" encoding="UTF-8"?>' << "\n"
    content << '<custom-objects xmlns="http://www.demandware.com/xml/impex/customobject/2006-10-31">' << "\n"

    features = Psych.load_file "Feature.yaml" || []
    features.each do | feature |
        content << "<custom-object type-id=\"Feature\" object-id=\"#{feature["name"]}\">" << "\n"
        content << "<object-attribute attribute-id=\"description\">#{feature["description"]}</object-attribute>" << "\n"
        content << '</custom-object>' << "\n"
    end

    content << '</custom-objects>'

    site_dirs = Pathname.new("#{tmp_dir_name}/sites").children.select { |c| c.directory? }.collect { |p| p.to_s }
    site_dirs.each do | site_dir |
        File.open("#{site_dir}/custom-objects/Feature.xml", "w+") do | file |
            file.write content
        end
    end
end

def perform_sites_urls_generation(host_arg, tmp_dir_name)
    puts "Transforming aliases and urlmaps"
    #Binding
    if host_arg == "cert.staging.store.converse.demandware.net"
        host = "staging.store.converse.demandware.net"
    else
        host = host_arg
    end

    Dir.glob("#{tmp_dir_name}/sites/*/urls/*.erb") do |source| 
      BuildUtil.transform_erb( source, binding, true )
    end
end

def create_zip(tmp_dir_name, zip_file)
    zip_file_path = "../#{zip_file}"

    puts "Creating site template archive ..."
    File.delete(zip_file_path) if File.exists? zip_file_path
    system("zip -rv #{zip_file_path} #{tmp_dir_name}/")
    system("rm -rf #{tmp_dir_name}")

    return zip_file_path
end

def upload_template_zip(opts, zip_file_path)
    remote_url = construct_url(opts.host, SITE_TEMPLATE_URL_PATH)
    uploader = Demandware::Uploader.new(opts)
    uploader.upload_file(zip_file_path, remote_url)
end

def import_template_zip(opts)
    site_template_importer = Demandware::SiteTemplateImporter.new(opts.bm_host, opts.bm_user, opts.bm_password)
    site_template_importer.import(opts.zip_file)
end

def upload_and_import_template_zip(opts, zip_file_path)
    upload_template_zip(opts, zip_file_path)
    import_template_zip(opts)
end
