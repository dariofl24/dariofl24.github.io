require 'converse/constants'

class AddStatusColumnToNikeomsRequestTable < ActiveRecord::Migration
    include Converse::Constants
    
    def up
        add_column :tbl_NikeOMSRequest, :status, :string, default: OMS_STATUS::NEW
    end

    def down
        remove_column :tbl_NikeOMSRequest, :status
    end
end