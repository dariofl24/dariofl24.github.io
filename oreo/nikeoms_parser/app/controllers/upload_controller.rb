require 'fileutils'

class UploadController < ApplicationController
    def get_merch_planner
    end

    def done_merch_planner
    end

    def post_merch_planner
        file = params[:datafile]
        destination_path = Rails.configuration.merch_planner_folder_path + file.original_filename
        temp_file_path = create_temp_file(file)
        
        move_file_to_folder(temp_file_path, destination_path)
        redirect_to :action => 'done_merch_planner'
    end

    def get_sale_price
    end

    def done_sale_price
    end

    def post_sale_price
        file = params[:datafile]
        destination_path = Rails.configuration.sale_price_folder_path + file.original_filename
        temp_file_path = create_temp_file(file)
        
        move_file_to_folder(temp_file_path, destination_path)
        redirect_to :action => 'done_sale_price'
    end

    def get_us_stores
    end

    def done_us_stores
    end

    def post_us_stores
        file = params[:datafile]
        destination_path = Rails.configuration.stores_folder_path + file.original_filename
        temp_file_path = create_temp_file(file)
        
        move_file_to_folder(temp_file_path, destination_path)
        redirect_to :action => 'done_us_stores'
    end

    def get_ca_stores
    end

    def done_ca_stores
    end

    def post_ca_stores
        file = params[:datafile]
        destination_path = Rails.configuration.stores_folder_path + file.original_filename
        temp_file_path = create_temp_file(file)
        
        move_file_to_folder(temp_file_path, destination_path)
        redirect_to :action => 'done_ca_stores'
    end

    def get_skate_stores
    end

    def done_skate_stores
    end

    def post_skate_stores
        file = params[:datafile]
        destination_path = Rails.configuration.stores_folder_path + file.original_filename
        temp_file_path = create_temp_file(file)
        
        move_file_to_folder(temp_file_path, destination_path)
        redirect_to :action => 'done_skate_stores'
    end

private
    def create_temp_file(file)
        temp_file = File.new '/tmp/upload.' + SecureRandom.hex, 'w+'
        temp_file.write file.read.force_encoding("UTF-8")
        temp_file.flush
        temp_file.close

        temp_file.path
    end

    def move_file_to_folder(temp_file_path, destination_path)
        FileUtils.mv temp_file_path, destination_path
    end
end