class ListController < ApplicationController

    def get_inventory_files
        pattern = Rails.configuration.inventory_file_pattern
        folder_path = Rails.configuration.inventory_files_backup_folder_path
        entries = Dir.entries(folder_path)

        @files = entries.select { |x| !((x =~ Regexp.new(pattern)).nil?) && File.file?(folder_path + x) }.sort
    end

    def download_inventory_file
        pattern = Rails.configuration.inventory_file_pattern
        folder_path = Rails.configuration.inventory_files_backup_folder_path
        file_name = params[:file_name]

        if (file_name =~ Regexp.new(pattern)).nil?
            redirect_to :action => 'error_inventory_file'
        end

        file_path = folder_path + file_name

        if !File.exists?(file_path)
           redirect_to :action => 'error_inventory_file' 
        end

        data = File.read(file_path)

        send_data(data, :type => 'text/csv', :filename => file_name)
    end

    def error_inventory_file
    end
end