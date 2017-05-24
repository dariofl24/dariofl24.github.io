#!/usr/bin/env ruby

require 'trollop'

require_relative "build_version_activator"

opts = Trollop::options do
    opt :host, "Demandware host", :type=>String, :required=>true
    opt :user, "Demandware user", :type=>String, :required=>true
    opt :password, "Demandware password", :type=>String, :required=>true
    opt :build_version, "Build version", :type=>String, :required=>true
end

activator = Demandware::BuildVersionActivator.new(opts[:host], opts[:user], opts[:password])
activator.activate(opts[:build_version])
