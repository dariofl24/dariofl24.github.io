#!/usr/bin/env ruby

require 'trollop'

require_relative "global_constants"
require_relative "demandware_upload"

include Demandware::GlobalConstants

opts = Trollop::options do
   	opt :local_dir, "Local directory to be uploaded", :type=>String, :required=>true
   	opt :host, "Demandware host", :type=>String, :required=>true
   	opt :user, "Demandware user", :type=>String, :required=>true
   	opt :password, "Demandware password", :type=>String, :required=>true
   	opt :two_factor_auth_required, "Indicates whether 2-factor authentication shoud be used", :default=>false
    opt :certificate_file, "Certificate file to be used for 2-factor authentication", :type=>String, :default=>DEFAULT_PATH_TO_CERT_FILE
    opt :key_file, "Key file to be used for 2-factor authentication", :type=>String, :default=>DEFAULT_PATH_TO_KEY_FILE
    opt :passphrase, "Passphrase for the certificate", :type=>String, :default=>DEFAULT_PASSPHRASE_FOR_CERT
    opt :catalog, "Catalog name", :type=>String, :required=>true
end

remote_url = construct_url(opts.host, "#{CATALOGS_URL_PATH}/#{opts.catalog}/default")
uploader = Demandware::Uploader.new(opts)
uploader.upload(remote_url)
