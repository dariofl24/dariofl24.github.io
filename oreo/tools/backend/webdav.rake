require 'rubygems'
require 'pathname'
require 'net/dav'

namespace :web_dav do

    desc "Uses WebDAV protocol to put the specified file on the selected Demandware server"
    task :put_cartridge, [:server, :user, :password, :file] do | t, args |
        put_cartridge_file args[:server], args[:user], args[:password], args[:file]
    end

    def put_cartridge_file (server, user, password, file)
        filePathname = Pathname.new(file)
        unless filePathname.exist?
            puts "File \"#{file}\" doesn't exist"
            return
        end

        puts "Connecting #{user}@#{server}..."

        dav = Net::DAV.new("https://#{server}", :curl => false)
        dav.credentials(user, password)
        dav.verify_server = false

        dav.cd("/on/demandware.servlet/webdav/Sites/Cartridges/version1")

        puts "Putting file on server: #{file}"
        filePathname.open("r") do | stream |
            dav.put("#{filePathname.basename}", stream, filePathname.size)
        end
    end
end