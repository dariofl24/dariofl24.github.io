namespace :html_builder do
    fail "CARTRIDGE_DIR is not defined" unless defined? CARTRIDGE_DIR
    HTML_BUILDER_HOME = CARTRIDGE_DIR + "converse_core/cartridge/static/default/html_builder"

    require 'psych'
    
    desc 'Configure HTML Builder files'
    task :configure,[:host] do |t, args|
        unless args[:host] 
            config = Psych.load_file './dev.yaml' || []
            host = config['host']
            args.with_defaults(:host => host)
        end
        BuildUtil.print_pretty_header("HTML BUILDER CONFIGURE")
            
        #Binding
        host = args[:host]
        BuildUtil.transform_erb( "#{HTML_BUILDER_HOME}/css/html_builder.css.erb", binding)

        #Always create the production version
        host = "www.converse.com"
        BuildUtil.transform_erb( "#{HTML_BUILDER_HOME}/css/html_builder.css.erb", binding, false, "#{HTML_BUILDER_HOME}/css/html_builder_production.css")
    end
end
