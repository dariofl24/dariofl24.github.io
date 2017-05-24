module Demandware

    require_relative "curler"

    class BuildVersionActivator < Demandware::Curler

        def activate(version)
            puts "Activating build version \"#{version}\" on host \"#@host\"..."

            http_post_with_path(ACTIVATE_BUILD_URL_PATH, "CodeVersionID=#{version}")

            raise "Activation failed" unless success?(version)
        end

        def success?(version)
            success_msg = "Successfully activated version '#{version}'"

            success = body_contains?(success_msg)
            puts success_msg if success

            return success
        end

    end

end