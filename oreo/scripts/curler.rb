module Demandware

    require 'curb'
    require_relative "global_constants"

    class Curler
        include Demandware::GlobalConstants

        def initialize(host, username, password)
            @host = host
            @username = username
            @password = password

            @curl = setup
            login
        end

        attr_accessor :host, :username, :password, :curl

        def setup
            Curl::Easy.new do |curl|
                curl.ssl_verify_host = false
                curl.ssl_verify_peer = false
                curl.enable_cookies = true
                curl.follow_location = true
                curl.ssl_version = Curl::CURL_SSLVERSION_TLSv1
                #curl.verbose = true
            end
        end

        def set_url(url)
            curl.url = url
        end

        def set_url_for_path(path)
            set_url(construct_url(host, path))
        end

        def perform_with_path(path)
            set_url_for_path(path)
            curl.perform
        end

        def http_post(data)
            curl.http_post(data)
        end

        def http_post_with_path(path, data)
            set_url_for_path(path)
            http_post(data)
        end

        def body_contains?(str)
            return has_body? && !curl.body_str.index(str).nil?
        end

        def match_body(regex, captureId = 0)
            if has_body?
                matchData = regex.match(curl.body_str)

                if !matchData.nil?
                    return matchData[captureId]
                end

                return matchData
            end

            return nil
        end

        def scan_body(regex)
            return has_body? ? curl.body_str.scan(regex) : []
        end

        def has_body?
            return !curl.body_str.nil? && !curl.body_str.empty?
        end

        def wait_until_body_matches(regex)
            begin
                sleep 3
                curl.perform
                matchedString = match_body(regex)
            end while matchedString != nil
        end

        def login
            puts "Logging into #@host as #@username..."
            http_post_with_path(LOGIN_URL_PATH, "LoginForm_Login=#@username&LoginForm_Password=#@password&LoginForm_RegistrationDomain=Sites")
        end

    end

end
