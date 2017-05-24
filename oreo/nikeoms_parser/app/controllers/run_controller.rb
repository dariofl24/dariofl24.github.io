class RunController < ApplicationController
    def get_list_of_processes
    end

    def post_start_stores_import_process
        command = Rails.configuration.import_stores_command

        spawn(command)

        redirect_to :action => 'done_start_stores_import_process'
    end

    def done_start_stores_import_process
    end    
end