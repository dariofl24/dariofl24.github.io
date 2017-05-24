#!/usr/bin/ruby

require 'trollop'
require 'rubygems'
require 'open-uri'
require "net/http"
require "net/https"
require "uri"
require 'nokogiri'
require 'csv'
require 'fileutils'
require_relative "../../scripts/global_constants"
require_relative "../../scripts/demandware_upload"


opts = Trollop::options do
    opt :report, "Report where the images to sync are", :type=>String, :required=>true
    opt :host, "Host", :type=>String, :required=>true
    opt :username, "Username", :type=>String, :required=>true
    opt :password, "Password", :type=>String, :required=>true
    opt :relativeProductsPath, "Relative path to the product images", :type=>String, :default=> "relativeProductsPath"
end



$report = opts[:report]
$host = opts[:host]

$productionPrefix = "http://www.converse.com"

$imagesPrefixInDW = "https://#{$host}/on/demandware.servlet/webdav/Sites/Catalogs/masterCatalog_Converse/default/images/products/"


CSV.foreach($report) do |row|
    pathInDW = row[0]
    relativePathInProduction = row[1]
    existInProduction = row[2]
    
    if( existInProduction == "true")
        
        urlInProduction = $productionPrefix + relativePathInProduction
        
        imageInDWResults = pathInDW.scan /(default.*)\/([^\/]*)/
        imageInDWRelativeDirectory = imageInDWResults[0][0]
        imageInDWName = imageInDWResults[0][1]
        
        FileUtils.mkdir_p imageInDWRelativeDirectory
        
        imageInDWRelativePath = "#{imageInDWRelativeDirectory}/#{imageInDWName}"
        
        puts "Downloading #{urlInProduction} INTO #{imageInDWRelativePath}"
        open(urlInProduction) {|f|
           File.open(imageInDWRelativePath,"wb") do |file|
             file.puts f.read
           end
        }
        
        uploader = Demandware::Uploader.new(opts)
        uploader.upload($imagesPrefixInDW, false)

        puts "Deleting #{opts.relativeProductsPath}"
        FileUtils.rm_r opts.relativeProductsPath, :force => true 
        
    end
    
end

