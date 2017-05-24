namespace :qunitor do
    # Run JS Unit Tests that matches testFilesPattern or the entire Frontend Codebase if used without arguments.
    task :run do | t, args |
        run_qunit Cartridges.All, args
    end

    task :run_us do | t, args |
        run_qunit Cartridges.US, args
    end

    task :run_de do | t, args |
        run_qunit Cartridges.DE, args
    end

    task :run_gb do | t, args |
        run_qunit Cartridges.GB, args
    end

    task :run_fr do | t, args |
        run_qunit Cartridges.FR, args
    end

    task :run_be do | t, args |
        run_qunit Cartridges.BE, args
    end

    task :run_es do | t, args |
        run_qunit Cartridges.ES, args
    end

    task :run_nl do | t, args |
        run_qunit Cartridges.NL, args
    end

    task :run_it do | t, args |
        run_qunit Cartridges.IT, args
    end

    def run_qunit(cartridges, args)
        testFilesPattern = 'cartridge/static/default/js/package/tst/**/*.js'
        run_qunit_for_cartridges cartridges, "depList.js", testFilesPattern
    end

    def read_tst_files(dir, testFilesPattern)
        File.open("#{CONFOO_DIR}/tools/frontend/js_test_runner/testList.js", 'w') do | f |
            f.puts 'var getTestList = ['
            FileList[dir + testFilesPattern].each do |testfile|
                f.puts "'" + testfile + "',"
            end
            f.puts '];'
        end
    end

    def read_src_files(dir, outputName)
        File.open("#{CONFOO_DIR}/tools/frontend/js_test_runner/#{outputName}", 'w') do | f |
            f.puts 'var getDepList = ['
            incFileName = dir + 'cartridge/static/default/js/dependency_list.inc'
            if FileTest.exists?(incFileName)
                text = File.open(incFileName).read

                p = dir.split("/")
                p.pop(1)
                dir = p.join("/") + "/"
                
                text.each_line do |line|
                    l = line.strip
                    if l[0..1] === '#='
                        f.puts "'#{dir}#{l[2..l.length()]}',"
                    end
                end
            end
            f.puts '];'
        end
    end 

    def run_qunit_for_cartridges(cartridges, depFilename, testFilesPattern)
        testFilesPatternMatcher = testFilesPattern.match(/cartridges\/([^\/]+)\/(.*)/)

        if testFilesPatternMatcher != nil
            cartridge, testFilePatternToUse = testFilesPatternMatcher.captures
        else
            cartridge = "*"
            testFilePatternToUse = testFilesPattern
        end

        cartridges.each do | cartridge_name |
            cartridge_dir = File.join(CARTRIDGE_DIR, cartridge_name, '/')

            puts 'Scanning dir: ' + cartridge_name
            read_src_files(cartridge_dir, depFilename)
            read_tst_files(cartridge_dir, testFilePatternToUse)
            puts "Runing tests for cartridge: " + cartridge_name

            run_qunit_for_cartridge()
        end
    end

    def run_qunit_for_cartridge()
        cmd = "phantomjs #{CONFOO_DIR}/tools/frontend/js_test_runner/run-qunit.js #{CONFOO_DIR}/tools/frontend/js_test_runner/index.html"
        ret = system(cmd)
        puts ""
        raise "QUnit Test failed" if !ret
    end
end
