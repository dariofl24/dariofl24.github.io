# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140422071941) do

  create_table "business_users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  add_index "business_users", ["email"], :name => "index_business_users_on_email", :unique => true
  add_index "business_users", ["reset_password_token"], :name => "index_business_users_on_reset_password_token", :unique => true

  create_table "tbl_Customer", :force => true do |t|
    t.integer  "signup_id",                      :null => false
    t.string   "email",           :limit => 150
    t.string   "first_name",      :limit => 100
    t.string   "last_name",       :limit => 100
    t.string   "zip",             :limit => 20
    t.string   "gender",          :limit => 6
    t.string   "birth_day",       :limit => 10
    t.string   "birth_month",     :limit => 10
    t.string   "birth_year",      :limit => 10
    t.boolean  "active"
    t.datetime "signup_created"
    t.datetime "profile_created"
    t.datetime "profile_updated"
  end

  add_index "tbl_Customer", ["signup_id"], :name => "index_tbl_Customer_on_signup_id", :unique => true

  create_table "tbl_CustomerAddress", :force => true do |t|
    t.integer "signup_id",                   :null => false
    t.string  "first_name",   :limit => 100
    t.string  "last_name",    :limit => 100
    t.string  "address1",     :limit => 50
    t.string  "address2",     :limit => 50
    t.string  "city",         :limit => 50
    t.string  "state",        :limit => 50
    t.string  "zip",          :limit => 20
    t.string  "phone",        :limit => 30
    t.string  "country_code", :limit => 3
    t.integer "address_type"
  end

  create_table "tbl_Employee", :force => true do |t|
    t.integer  "employee_id",                :null => false
    t.integer  "signup_id",                  :null => false
    t.string   "email",       :limit => 150
    t.string   "first_name",  :limit => 100
    t.string   "last_name",   :limit => 100
    t.string   "bvat_id",     :limit => 50
    t.boolean  "active"
    t.datetime "created"
  end

  add_index "tbl_Employee", ["employee_id"], :name => "index_tbl_Employee_on_employee_id", :unique => true

  create_table "tbl_EmployeeRelative", :force => true do |t|
    t.integer  "employee_id",                      :null => false
    t.integer  "signup_id"
    t.string   "email",             :limit => 150
    t.string   "first_name",        :limit => 100
    t.string   "last_name",         :limit => 100
    t.integer  "state"
    t.datetime "agreed_terms_date"
    t.integer  "relationship_id"
    t.datetime "created"
  end

  create_table "tbl_GenescoInventoryInfo", :force => true do |t|
    t.string "sku",         :null => false
    t.string "size"
    t.string "qty_on_hand"
    t.string "expect_date"
    t.string "qty_on_po"
    t.string "upc"
  end

  create_table "tbl_MasterProduct", :force => true do |t|
    t.string  "product_identifier"
    t.string  "name"
    t.string  "cut"
    t.string  "gender"
    t.string  "material"
    t.string  "product_type"
    t.string  "brand_segment"
    t.string  "description",            :limit => 1000
    t.string  "nike_product_id"
    t.string  "merch_planner_category"
    t.string  "pillar"
    t.boolean "core"
    t.string  "instance_id"
    t.string  "inspiration_id"
    t.float   "price"
    t.float   "sale_price"
    t.string  "business_unit_id"
  end

  add_index "tbl_MasterProduct", ["product_identifier"], :name => "index_tbl_MasterProduct_on_product_identifier", :unique => true

  create_table "tbl_MerchPlannerInfo", :force => true do |t|
    t.string "sku",                                        :null => false
    t.string "price"
    t.string "sale_price"
    t.string "product_name"
    t.string "color"
    t.string "cut"
    t.string "gender"
    t.string "material"
    t.string "master_product_id"
    t.string "product_type"
    t.string "brand_segment"
    t.string "size_chart"
    t.string "size_chart_messaging"
    t.string "description",                :limit => 1000
    t.string "current_status"
    t.string "nike_product_id"
    t.string "main_color_hex"
    t.string "accent_color_hex"
    t.string "merch_planner_category"
    t.string "pillar"
    t.string "sleeve"
    t.string "core"
    t.string "dyo_version_product_id"
    t.string "dyo_version_inspiration_id"
    t.string "instance_id"
    t.string "inspiration_id"
    t.string "sizes"
    t.string "master_price"
    t.string "master_sale_price"
    t.string "meta_keywords",              :limit => 1000
    t.string "meta_description",           :limit => 1000
    t.string "meta_search_text",           :limit => 1000
    t.string "product_page_title",         :limit => 1000
    t.string "manufacturer_sku"
    t.string "online_from"
    t.string "online_to"
    t.string "badging"
    t.string "business_unit_id"
  end

  create_table "tbl_NikeOMSRequest", :force => true do |t|
    t.string   "request_segment"
    t.string   "package_id"
    t.string   "carrier_id"
    t.string   "ship_group_id"
    t.string   "order_id"
    t.string   "item_old_state"
    t.string   "item_new_state"
    t.date     "item_ets_date"
    t.datetime "item_timestamp"
    t.string   "status",          :default => "new"
  end

  create_table "tbl_ProductInventory", :force => true do |t|
    t.float   "allocation"
    t.float   "po_allocation"
    t.string  "in_stock_date"
    t.integer "variation_product_id"
    t.boolean "perpetual",            :default => false
  end

  create_table "tbl_ProductPrice", :force => true do |t|
    t.float   "price"
    t.float   "sale_price"
    t.integer "variation_product_id"
  end

  create_table "tbl_ProductToSizeMapping", :force => true do |t|
    t.string  "sku",      :null => false
    t.string  "size",     :null => false
    t.integer "position"
  end

  add_index "tbl_ProductToSizeMapping", ["sku", "size"], :name => "index_tbl_ProductToSizeMapping_on_sku_and_size", :unique => true

  create_table "tbl_StoreLocation", :force => true do |t|
    t.string  "hash_key",                                         :null => false
    t.decimal "latitude",         :precision => 18, :scale => 10
    t.decimal "longitude",        :precision => 18, :scale => 10
    t.integer "geocode_attempts"
  end

  create_table "tbl_Store_Canada", :force => true do |t|
    t.string "name",       :limit => 100, :null => false
    t.string "address1",   :limit => 100
    t.string "address2",   :limit => 100
    t.string "city",       :limit => 100
    t.string "state",      :limit => 100
    t.string "zip",        :limit => 30
    t.string "phone",      :limit => 50
    t.string "email",      :limit => 50
    t.string "url"
    t.string "account_no", :limit => 30
    t.string "company_no", :limit => 30
    t.string "hash_key"
  end

  create_table "tbl_Store_Skateboarding", :force => true do |t|
    t.string  "name",     :limit => 100,                                 :null => false
    t.string  "address1", :limit => 100
    t.string  "address2", :limit => 100
    t.string  "city",     :limit => 100
    t.string  "state",    :limit => 100
    t.string  "zip",      :limit => 30
    t.string  "phone",    :limit => 50
    t.string  "email",    :limit => 50
    t.string  "url"
    t.decimal "lat",                     :precision => 18, :scale => 10
    t.decimal "lng",                     :precision => 18, :scale => 10
    t.string  "hash_key"
  end

  create_table "tbl_Store_USA", :force => true do |t|
    t.string "name",       :limit => 100, :null => false
    t.string "address1",   :limit => 100
    t.string "address2",   :limit => 100
    t.string "city",       :limit => 100
    t.string "state",      :limit => 100
    t.string "zip",        :limit => 30
    t.string "phone",      :limit => 50
    t.string "email",      :limit => 50
    t.string "url"
    t.string "account_no", :limit => 30
    t.string "company_no", :limit => 30
    t.string "hash_key"
  end

  create_table "tbl_VariationProduct", :force => true do |t|
    t.string   "product_identifier"
    t.string   "sku"
    t.string   "color"
    t.string   "size"
    t.boolean  "online"
    t.integer  "master_product_id"
    t.string   "main_color_hex"
    t.string   "accent_color_hex"
    t.string   "sleeve"
    t.string   "dyo_version_product_id"
    t.string   "dyo_version_inspiration_id"
    t.string   "page_title",                 :limit => 1000
    t.string   "page_keywords",              :limit => 1000
    t.string   "page_description",           :limit => 1000
    t.string   "meta_search_text",           :limit => 1000
    t.string   "manufacturer_sku"
    t.datetime "online_from"
    t.datetime "online_to"
    t.string   "upc",                        :limit => 12
    t.string   "badging"
    t.string   "size_chart"
    t.string   "size_chart_messaging"
  end

  add_index "tbl_VariationProduct", ["product_identifier"], :name => "index_tbl_VariationProduct_on_product_identifier", :unique => true

end
