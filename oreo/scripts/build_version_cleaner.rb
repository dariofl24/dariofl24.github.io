module Demandware

    require_relative "curler"

    class BuildVersionCleaner < Demandware::Curler

        def clean(how_many_to_keep)
            puts "Cleaning up build versions... The number of versions to keep: #{how_many_to_keep}."

            perform_with_path(CODE_DEPLOYMENT_VIEW_URL_PATH)

            active_version = get_active_version
            versions = get_versions
            puts "Active version: #{active_version}. All versions: #{versions}."

            versions_to_delete = get_versions_to_delete(active_version, versions, how_many_to_keep)
            puts "Versions to delete: #{versions_to_delete}"

            success = delete_versions(versions_to_delete)

            raise "Version cleanup failed" unless success
        end

        def get_active_version()
            active_version_regex = /name="SelectedVersionID"\s+value="(\w+)"\s+disabled="disabled"/
            return match_body(active_version_regex, 1)
        end

        def get_versions()
            versions_regex = /name="VersionID"\s+value="(\w+)".+?(\d{1,2}\/\d{1,2}\/\d{1,2}).+?(\d{1,2}:\d{1,2}:\d{1,2}\s+(am|pm))/m
            version_matches = scan_body(versions_regex)

            return version_matches.collect(&:first)
        end

        def get_versions_to_delete(active_version, versions, how_many_to_keep)
            versions_to_delete = []

            if versions.length > how_many_to_keep
                temp_versions = versions.dup
                temp_versions.delete(active_version)
                temp_versions.sort_by! { |s| s[/\d+/].to_i }
                versions_to_delete = temp_versions.take(temp_versions.length - how_many_to_keep + 1)
            end

            return versions_to_delete
        end

        def delete_versions(versions)
            success = true

            unless versions.empty?
                versions.each do |version|
                    success = delete_version(version)
                    break unless success
                end
            end

            return success
        end

        def delete_version(version)
            set_url_for_path(CODE_DEPLOYMENT_DISPATCH_URL_PATH)
            http_post("SelectedVersionID=#{version}&confirmDelete=Delete")
            http_post("delete=OK")

            return success?(version)
        end

        def success?(version)
            success_msg = "Successfully deleted the specified code versions"

            success = body_contains?(success_msg)
            puts "Successfully deleted version \"#{version}\"" if success

            return success
        end
    end

end