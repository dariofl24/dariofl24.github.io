require 'colorize'
require 'json'
require 'net/http'

namespace :unit do
    task :unit_config, [:server, :user, :pass] do | t, args |
      unless args[:server]
        config = Psych.load_file './dev.yaml' || []
        server = config['host']
        user = config['storefront_user']
        pass = config['storefront_password']
        args.with_defaults(:server => server, :user => user, :pass => pass)
      end
        @server = args[:server]
        @user = args[:user]
        @pass = args[:pass]
    end

    desc "Run all suites"
    task :run, [:server, :user, :pass] => :unit_config do  | t, args |
        run_suites_and_print @server, DE_SITE_ID
        run_suites_and_print @server, GB_SITE_ID
    end

    desc "Run all suites for US site"
    task :run_us, [:server, :user, :pass] => :unit_config do  | t, args |
        run_suites_and_print @server, US_SITE_ID
    end

    desc "Run all suites for DE site"
    task :run_de, [:server, :user, :pass] => :unit_config do  | t, args |
        run_suites_and_print @server, DE_SITE_ID
    end

    desc "Run all suites for GB site"
    task :run_gb, [:server, :user, :pass] => :unit_config do  | t, args |
        run_suites_and_print @server, GB_SITE_ID
    end

    def run_suites_and_print(server, siteId)
        result = run_suites server, siteId
        print_result result
    end

    def run_suites (server, siteId)
        url = "http://#{server}/on/demandware.store/Sites-#{siteId}-Site/default/Unit-Run?noRedirect"

        puts "Running #{url}"

        uri = URI.parse(url)

        Net::HTTP.start(uri.host, uri.port) do |http|
            req = Net::HTTP::Get.new(uri)

            req.basic_auth(@user, @pass)

            resp = http.request(req)

            return JSON.parse(resp.body)
        end
    end

    def print_exception (exception)
        puts ""
        puts "         message: #{exception['message']}"
        puts ""
        puts "            file: #{exception['fileName']}"
        puts "            line: #{exception['lineNumber']}"
        puts "           stack: #{exception['stack']}"
        puts ""
    end

    def print_test_result (result)
        number_of_failed_tests = 0

        result['suites'].each do | suite |
            puts ""
            puts "Suite #{suite['name']}"
            suite['tests'].each do | test |
                status = test['passed'] ? 'SUCCESS'.green : 'FAILURE'.red
                status = test['ignored'] ? 'IGNORED'.yellow : status
                puts "  #{status} - #{test['name']}"
                unless test['passed']
                    print_exception test['exception']
                    number_of_failed_tests += 1
                end
            end
        end

        print_summary(number_of_failed_tests)
    end

    def print_summary(number_of_failed_tests)
        puts ""

        if number_of_failed_tests == 0
            puts "PASSED: All tests passed!".green
        else
            puts "FAILED: #{number_of_failed_tests} test(s) failed!".red
            exit 1
        end

        puts ""
    end

    def print_internal_error (result)
        puts ""
        puts result['error'].red
        exit 1
    end

    def print_result(result)
        if result['error'] then
            print_internal_error result
        else
            print_test_result result
        end
    end
end
