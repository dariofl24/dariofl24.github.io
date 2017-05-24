class Request < ActiveRecord::Base

    self.table_name = "tbl_NikeOMSRequest"

    validates :request_segment,
              :ship_group_id,
              :order_id,
              :item_old_state,
              :item_new_state,
              :item_timestamp, presence: true
end
