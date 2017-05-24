#!/usr/bin/ruby

require 'trollop'
require 'rubygems'
require 'open-uri'
require "net/http"
require "net/https"
require "uri"
require 'nokogiri'
require 'csv'


opts = Trollop::options do
    opt :catalog, "Master Catalog XML", :type=>String, :required=>true
    opt :host, "Host", :type=>String, :required=>true
    opt :username, "Username", :type=>String, :required=>true
    opt :password, "Password", :type=>String, :required=>true
    opt :report, "Report where the results will be", :type=>String, :required=>true
end



$filePath = opts[:catalog]
$host = opts[:host]
$username = opts[:username]
$password = opts[:password]
$report = opts[:report]

$images = []
$imagesDifferentPath = []
$imagesPrefix = "/on/demandware.servlet/webdav/Sites/Catalogs/masterCatalog_Converse/default/"

class MyDocument < Nokogiri::XML::SAX::Document
  def xmldecl(version, encoding, standalone)
  end
  def start_document
  end
  def end_document
  end
  def start_element(name, attrs = [])
  end
  def end_element(name)
  end
  def start_element_namespace(name, attrs = [], prefix = nil, uri = nil, ns = [])
    if( name == "image")
      imagePath = attrs[0].value
      
      imageParts = getImageParts(imagePath)
      if(imageParts.length == 0 || imageParts[0].length < 2)
          $imagesDifferentPath <<  imagePath
      else
          $images << imagePath
      end
    end
  end
  def end_element_namespace(name, prefix = nil, uri = nil)
  end
  def characters(string)
  end
  def comment(string)
  end
  def warning(string)
  end
  def error(string)
  end
  def cdata_block(string)
  end
end

def getHTTPSessionInDW
  url = "https://#{$host}#{$imagesPrefix}"
  uri = URI.parse(url)
  
  http = Net::HTTPSession.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  
  return http
end

def existImageInDW?( http, imagePath )
    
    relativeUrl = $imagesPrefix + imagePath
    
    request = Net::HTTP::Head.new(relativeUrl)
    request.basic_auth $username, $password
    
    response = http.request(request)
    if( response.code == "200" )
      return true
    end
    return false
    
end

def getImageParts(imagePath)
   results = imagePath.scan /products\/.*\/(.*)_(.*).png/
   return results
end

def createRelativeImagePathInProduction( sku, type)
    subtype = (type == "standard")? "" : "#{type}_" 
    return "/media/product/#{sku}/#{type}/#{sku}_#{subtype}xl.png"
end


def getHTTPSessionInProduction
  url = "http://www.converse.com/media/product/"
  uri = URI.parse(url)
  
  http = Net::HTTPSession.new(uri.host, uri.port)
  return http
end


def existImageInProduction?( http, relativeUrl )
    
    request = Net::HTTP::Head.new(relativeUrl)
    
    response = http.request(request)
    if( response.code == "200" )
      return true
    end
    return false
end

file = open $filePath
parser = Nokogiri::XML::SAX::Parser.new(MyDocument.new)
parser.parse( file )


report = Array.new

getHTTPSessionInDW.start{ |httpInDW|
    getHTTPSessionInProduction.start{ |httpInProduction|
        $images.each {|imagePath|
            if( !existImageInDW?( httpInDW, imagePath ) )
                imageFullPath =  "https://#{$host}#{$imagesPrefix}#{imagePath}"
                puts imageFullPath
                imageParts = getImageParts(imagePath)
                sku = imageParts[0][0].to_s
                type = imageParts[0][1].to_s
                imageRelativePathInProduction = createRelativeImagePathInProduction( sku, type)
                existsInProduction = existImageInProduction?(httpInProduction, imageRelativePathInProduction)
                
                puts "FOUND? #{existsInProduction}"
                reportItem = [imageFullPath,imageRelativePathInProduction,existsInProduction]
                
                report << reportItem
                
                puts reportItem.to_s
            end
        }
    }
}

CSV.open($report, "wb") {|csv|
  csv << ["missing_image","possible_prod_path","exists_in_prod"] 
  report.each{ |row|
    csv << row
    puts row
  }

  $imagesDifferentPath.each{ |row|
    csv << ["https://#{$host}#{$imagesPrefix}#{row}", "Not analyzed because different path in DW", "false"]
    puts row
  }
}



  
