#!/usr/bin/env ruby
require "net/http"
require 'trollop'


def getCartridgesPublished(siteFile)
     
    cartridgeHtml = ""
  
    if File.exist?(siteFile) then   
        cartridgeLine = File.readlines(siteFile).select { |line| line =~ /<custom-cartridges>/ }
        if cartridgeLine.size > 0 then
            cartridges = cartridgeLine[0].gsub("<custom-cartridges>","").gsub("</custom-cartridges>","").split(":", -1)
            puts "Retrieving list of cartridges..."
            cartridges.each do |c| cartridgeHtml << "<li>#{c.strip}</li>" end
        elsif
            cartridgeHtml << "<li> NO CARTRIDGES </li>"
            puts "-- No Cartrdiges were found --"
        end
    elsif
        puts "-- File with cartrdige info was not found"
    end
    return cartridgeHtml;
    
end

 
def getBuildValue(body_line, token)
    # "key"   :   "value"
    return body_line.empty?? " - " : body_line[0].split(token)[1];
end
  
#Retrieve deploy Information
#Connect to retrieve deploy Information
def getDeployInformation(user, password, deployURL)
    
    uri = URI.parse("http://#{user}:#{password}@#{deployURL}")
    puts "Retrieving last succesful deploy information"
    response = Net::HTTP.post_form(uri, {"pretty" => "true"})

    #Parse response to get Info
    body = response.body.lines
    
    puts "#{response.body}"
    
    helperLine= body.select{ |e|  e =~ /(commitId|SHA1)/ } 
    commit = getBuildValue(helperLine, ":");
    
    helperLine = body.select{ |e|  e =~ /(date|id)/ }                                        
    date = getBuildValue(helperLine, ":");
    
    helperLine = body.select{|e| e =~ /fullName/ }
    deployer =  getBuildValue(helperLine, ":");
    
    helperLine = body.select{|e| e =~ /"url"/ }
    detailsPage =  getBuildValue(helperLine, "\" :");
     
    return "COMMIT: #{commit} <br/> DATE: #{date} <br/> USER:#{deployer}<br/><a href=#{detailsPage}>details</a>";
end

def writeFile(buildInfoFile, content)  
    File.open(buildInfoFile, 'w+') do
        |f| 
        f.write(content);  
    end
end


#GET PARAMETERS
jenkins = Trollop::options do
    opt :confoo_root_dir, "Confoo root directory path", :type=>String, :required=>true
    opt :integration_build_url, "Path to current build", :type=>String, :required=>true
    opt :user, "Integration user name", :type=>String, :required=>true
    opt :password, "Integration password", :type=>String, :required=>true
end

puts "=== BUILDING DEPLOY INFO PAGE ===";

# GET Properties
siteFile = "#{jenkins.confoo_root_dir}/site_template/common/sites/converse/site.xml";
buildInfoPage = "#{jenkins.confoo_root_dir}/site_template/common/static/default/buildInfo.html"
buildInfoTemplate = "#{jenkins.confoo_root_dir}/cartridges/converse_core/cartridge/templates/default/util/buildInfo.isml"
deployURL = "#{jenkins.integration_build_url}/api/json"

htmlContent = "<html><body>
  <h2> Build Page Info <h2><br/>
  <h3>CARTRIDGES:</h3>
  <ul>#{getCartridgesPublished(siteFile)}</ul><br/><h3>DEPLOY INFO</h3><br/>#{getDeployInformation(jenkins.user, jenkins.password, deployURL)}<br/>
  </body></html>";

writeFile(buildInfoPage, htmlContent);
writeFile(buildInfoTemplate, htmlContent);

puts "...page completed!"
