#!/usr/bin/env ruby

require 'trollop'

require_relative "build_version_cleaner"

opts = Trollop::options do
    opt :host, "Demandware host", :type=>String, :required=>true
    opt :user, "Demandware user", :type=>String, :required=>true
    opt :password, "Demandware password", :type=>String, :required=>true
    opt :how_many_to_keep, "The number of versions to keep", :default => 5
end

cleaner = Demandware::BuildVersionCleaner.new(opts[:host], opts[:user], opts[:password])
cleaner.clean(opts[:how_many_to_keep])
