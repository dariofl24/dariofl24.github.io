require 'rubygems'
require 'bundler'
require 'yaml'
Bundler.setup
Bundler.require

DAV_CONVERSE_ROOT = '/home/converse'
RACK_ROOT         = File.dirname(__FILE__)
CREDENTIAL_FILE   = './credentials.yml'
AUTHORIZED_USERS  = YAML.load(File.open(CREDENTIAL_FILE))

class SinatraDavApp < Sinatra::Base
  set :root,              RACK_ROOT 
end

SinatraDavApp = Rack::Builder.new do
  use Rack::ShowExceptions
  use Rack::CommonLogger

  use Rack::Auth::Basic do |username, password|
    AUTHORIZED_USERS.include?([username, password])
  end

  map '/dav/converse' do
    run RackDAV::Handler.new(:root => DAV_CONVERSE_ROOT)
  end
end
