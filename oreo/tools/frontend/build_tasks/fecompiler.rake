namespace :fecompiler do
    require 'pathname'
    require 'sprockets'
    require 'logger'

    TYPE_JS = "js"
    TYPE_CSS = "css"
    TYPE_ALL = "all"

    # Compile Frontend Code for Production (CSS & JS)
    task :compile do
        frontend_compile Cartridges.All, true, TYPE_ALL
    end

    task :compile_us do
        frontend_compile Cartridges.US, true, TYPE_ALL
    end

    task :compile_gb do
        frontend_compile Cartridges.GB, true, TYPE_ALL
    end

    # Compile Frontend Code for Development (CSS & JS)
    task :compile_dev do
        frontend_compile Cartridges.All, false, TYPE_ALL
    end

    task :compile_dev_us do
        frontend_compile Cartridges.US, false, TYPE_ALL
    end

    task :compile_dev_gb do
        frontend_compile Cartridges.GB, false, TYPE_ALL
    end

    def frontend_compile(cartridges, production, type=TYPE_ALL)
        cartridges.each do |name|
            dir = File.join(CARTRIDGE_DIR, name, '/')
            puts "\nScanning Dir: #{dir}"
            
            if type == TYPE_ALL or type == TYPE_JS
                concat_files(dir, TYPE_JS, production)
            end

            if type == TYPE_ALL or type == TYPE_CSS
                concat_files(dir, TYPE_CSS, production)
            end
        end
    end

    def apply_cachebust_hash(base_dir, type, filename)
        outputfile = "#{base_dir}/#{type}/#{filename}"
        md5 = Digest::MD5.file(outputfile).hexdigest
        flist = filename.split(".")
        fext = flist.pop()
        filename = "#{flist.join('.')}.#{md5}.#{fext}"
        cachebustfile = "#{base_dir}/#{type}/#{filename}"
        `mv #{outputfile} #{cachebustfile}`
    end

    def minify(file)
        cmd = "java -jar /usr/lib/yuicompressor/build/yuicompressor-2.4.8pre.jar #{file} -o #{file}"
        ret = system(cmd)
        raise "Minification failed for #{file}" if !ret
    end
    
    def clean_compiled_files(compiled_dir, type)
        `rm -f #{compiled_dir}/*.#{type}`
    end

    def concat_files(dir, type, production)
        core_cartridge_base_dir = "#{CORE_CARTRIDGE_DIR}static/default/#{type}"
        emea_cartridge_base_dir = "#{EMEA_CARTRIDGE_DIR}static/default/#{type}"
        package_dir  = "#{dir}cartridge/static/default/#{type}/package"
        base_dir     = "#{dir}cartridge/static/default/"
        compiled_dir = "#{dir}cartridge/static/default/#{type}"

        if production
            environment = 'production'
        else
            environment = 'development'
        end

        if type == TYPE_CSS 
            `compass clean #{package_dir} 2>&1`
            output = `compass compile -e #{environment} #{package_dir} 2>&1`
            error_messages = ["WARNING", "error"]
            
            if error_messages.any? { |mes| output.include? mes }
                puts output
                puts "\n\n=============================== ERROR: FAIL:"
                puts "Your CSS compile failed miserably."
                puts "take a look above for the errors\n\n"
                exit 1
            end
        end

        puts package_dir
        flist = FileList["#{package_dir}/*.#{type}"]

        if flist.count > 0
            clean_compiled_files(compiled_dir, type)
        
            flist.each do |file|
                filename = file.split("/").last
                puts "Creating compiled file: " + filename
                root = Pathname.new(File.dirname(__FILE__))
                logger = Logger.new(STDOUT)
                sprockets = Sprockets::Environment.new(root) do |env|
                    env.logger = logger

                    if production
                        env.unregister_processor('text/css', Sprockets::DirectiveProcessor)
                        env.register_processor('text/css', ProductionIncludeCSSDirectiveProcessor)
                    else                  
                        env.unregister_processor('application/javascript', Sprockets::DirectiveProcessor)
                        IncludeJavaScriptDirectiveProcessor.set_compiled_dir compiled_dir
                        IncludeJavaScriptDirectiveProcessor.set_filename filename
                        env.register_processor('application/javascript', IncludeJavaScriptDirectiveProcessor )

                        env.unregister_processor('text/css', Sprockets::DirectiveProcessor)
                        DevelopmentIncludeCSSDirectiveProcessor.set_compiled_dir compiled_dir
                        DevelopmentIncludeCSSDirectiveProcessor.set_filename filename
                        env.register_processor('text/css', DevelopmentIncludeCSSDirectiveProcessor)
                    end
                end
                
                sprockets.append_path(core_cartridge_base_dir)
                sprockets.append_path(emea_cartridge_base_dir)
                sprockets.append_path(package_dir)
                sprockets.append_path(base_dir)
                assets = sprockets.find_asset("#{package_dir}/#{filename}")
                outputfile = "#{base_dir}/#{type}/#{filename}"
                assets.write_to(outputfile)

                if production
                    minify(outputfile)
                end
            end
        end
    end
end

class IncludeJavaScriptDirectiveProcessor < Sprockets::DirectiveProcessor
    @@compile_dir
    @@filename
  
    class << self
        def set_compiled_dir( compiled_dir )
            @@compiled_dir = compiled_dir
        end

        def set_filename( filename )
            @@filename = filename
        end
    end
  
    protected
    def process_source
        unless @has_written_body || processed_header.empty?
            @result << processed_header << "\n"
        end
      
        @result << "var JS_ROOT_PATH = $('script[src*=\"#{@@filename}\"]').attr('src').replace('#{@@filename}','');\n"
      
        included_pathnames.each do |pathname|
            pathname_to_use = pathname.sub @@compiled_dir, "."
            @result << "document.write('<script src=\"' + JS_ROOT_PATH + '#{pathname_to_use}\"></script>');\n"
        end
      
        pathname_to_use = pathname.sub @@compiled_dir, "."
        @result << "document.write('<script src=\"' + JS_ROOT_PATH + '#{pathname_to_use}\"></script>');\n"
    end
end

class DevelopmentIncludeCSSDirectiveProcessor < Sprockets::DirectiveProcessor  
    @@compile_dir
    @@filename
  
    class << self
        def set_compiled_dir( compiled_dir )
            @@compiled_dir = compiled_dir
            @@core_import_paths = []
        end

        def set_filename( filename )
            @@filename = filename
        end
    end
  
    protected

    def process_include_core_directive(path)
        pathname = context.resolve(path)
        context.depend_on_asset(pathname)

        @@core_import_paths << path
    end

    def process_source
        normalize_compiled_dir = @@compiled_dir.sub("/css", "")

        included_pathnames.each do |pathname|
            pathname_to_use = pathname.sub normalize_compiled_dir, ".."
            @result << "@import url('#{pathname_to_use}');\n"
        end

        @@core_import_paths.each do |import_path|
            @result << "@import url('#{import_path}');\n"
        end
    end
end

class ProductionIncludeCSSDirectiveProcessor < Sprockets::DirectiveProcessor  
    protected

    def process_include_core_directive(path)
        process_include_directive(path)
    end
end
