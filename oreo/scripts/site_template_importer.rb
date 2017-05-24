module Demandware

    require_relative "curler"

    class SiteTemplateImporter < Demandware::Curler

        def import(zip_file)
            puts "Importing #{zip_file} through Business Manager ..."

            import_job_id = start_import(zip_file)

            puts "Import job id: #{import_job_id}"

            wait_for_import_to_complete(import_job_id)

            import_status = get_import_status(import_job_id)

            puts "Import status: #{import_status}"

            raise "Import failed" unless success?(import_status)
        end

        def start_import(zip_file)
            set_url_for_path(IMPEX_DISPATCH_URL_PATH)
            http_post("ImportFileName=#{zip_file}&confirmimport=Import&realmUse=false")
            http_post("ImportFileName=#{zip_file}&import=OK&realmUse=false")

            return get_import_job_id
        end

        def get_import_job_id()
            import_id_regex = /input\s+type="hidden"\s+name="ObjectUUID"\s+value="(\w+)"/
            return match_body(import_id_regex, 1)
        end

        def wait_for_import_to_complete(import_job_id)
            import_running_regex = Regexp.new("name=\"ObjectUUID\"\\s+value=\"#{import_job_id}\".*?Running", Regexp::MULTILINE)

            set_url_for_path(IMPEX_STATUS_URL_PATH)
            wait_until_body_matches(import_running_regex)
        end

        def get_import_status(import_job_id)
            import_status_regex = Regexp.new("name=\"ObjectUUID\"\\s+value=\"#{import_job_id}\".*?\\.log\">\\s+(.*?)\\s+<\\/td", Regexp::MULTILINE)
            return strip_out_irrelevant_tags(match_body(import_status_regex, 1))
        end

        def success?(status)
            return !status.nil? && !status.start_with?("Error")
        end

        def strip_out_irrelevant_tags(status)
            if !status.nil?
                return status.gsub(/<.*?>/, '')
            end

            return status
        end

    end

end