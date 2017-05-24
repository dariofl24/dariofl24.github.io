require 'psych'
require 'erb'

module BuildUtil
    def self.print_pretty_header(taskname) 
        puts "#"*60 + "\n"
        puts "# " + "\n"
        puts "# Running: #{taskname}"
        puts "# " + "\n"
        puts "#"*60 + "\n"
    end

    def self.transform_erb( erbTemplate, binding, removeSource =  false, destinationFile = nil )
        if destinationFile == nil
            dest = erbTemplate.gsub('.erb','')
        else
            dest = destinationFile
        end

        File.open("#{dest}", 'w') do |f|
            puts "  --> Running transformation from #{erbTemplate} to #{dest}"
            template = ERB.new File.new("#{erbTemplate}").read, nil, "%"
            f.write(template.result(binding))
        end

        if removeSource
            puts "  --> Removing ERB Template #{erbTemplate}"
            File.delete(erbTemplate) if removeSource
        end
    end
end
