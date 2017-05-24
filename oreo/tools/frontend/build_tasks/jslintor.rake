namespace :jslintor do
    # Run JS Lint Tests for Entire Frontend Codebase
    task :lint do
        threads = number_of_processors

        Dir.glob("#{CARTRIDGE_DIR}*/")  do |cartridge_name|
            puts "Scanning cartridges for js files: #{cartridge_name}"
            lint_cartridge(threads, FileList["#{cartridge_name}/cartridge/static/default/js/package/src/**/*.js"])
        end
    end

    def lint_cartridge_file(file)
        cmd = "jshint #{file} --config #{CONFOO_DIR}tools/frontend/jshint/config.json" 
        ret = system(cmd)
        raise "Lint Test failed for #{file}" if !ret
    end

    def lint_cartridge(threads, files)
        fcount = files.count

        if fcount != 0
            puts "Linting files: #{files.join("\n")}"
            check_no_tabs(files)
            tpool = [] 
            prev = 0
            step = fcount/threads
            step = step == 0 ? 1 : step

            (0..fcount).step(step) do |n|
                file = files.slice(prev..n).join(" ")
                tpool.push(Thread.new{lint_cartridge_file(file)})
                prev = n
            end
        
            tpool.each do |t|
                t.join
            end
        end
    end

    def check_no_tabs(files)
        files.each do |path|
            File.open(path, "r").each_line.with_index do |line, lineNumber|
                match = line.match(/\t/)
                if match
                    raise "jslint-ext:#{path}:#{lineNumber + 1}:#{match.offset(0)[0] + 1}:Tabs used for indentation."
                end
            end
        end
    end

    def number_of_processors
        if RUBY_PLATFORM =~ /linux/
            return `cat /proc/cpuinfo | grep processor | wc -l`.to_i
        elsif RUBY_PLATFORM =~ /darwin/
            return `sysctl -n hw.logicalcpu`.to_i
        elsif RUBY_PLATFORM =~ /win32/
            # this works for windows 2000 or greater
            require 'win32ole'
            wmi = WIN32OLE.connect("winmgmts://")
            wmi.ExecQuery("select * from Win32_ComputerSystem").each do |system| 
                begin
                        processors = system.NumberOfLogicalProcessors
                rescue
                        processors = 0
                end
                return [system.NumberOfProcessors, processors].max
            end
        end
        raise "can't determine 'number_of_processors' for '#{RUBY_PLATFORM}'"
    end
end
