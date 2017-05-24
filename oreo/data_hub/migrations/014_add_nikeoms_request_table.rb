class AddNikeomsRequestTable < ActiveRecord::Migration
    def up
        create_table :tbl_NikeOMSRequest do | t |
            t.string :request_segment
            t.string :package_id
            t.string :carrier_id
            t.string :ship_group_id
            t.string :order_id
            t.string :item_old_state
            t.string :item_new_state
            t.date :item_ets_date
            t.datetime :item_timestamp
        end
    end

    def down
        drop_table :tbl_NikeOMSRequest
    end
end