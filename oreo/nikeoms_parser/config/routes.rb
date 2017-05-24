NikeomsParser::Application.routes.draw do
  devise_for :business_users

  root :to => 'home#index'

  # Services
  get  '/oms', to: 'oms#get'
  post '/oms', to: 'oms#new_report', defaults: { format: 'xml' }

  get  "upload/get_merch_planner"
  post "upload/post_merch_planner"
  get  "upload/done_merch_planner"

  get  "upload/get_sale_price"
  post "upload/post_sale_price"
  get  "upload/done_sale_price"

  get  "upload/get_us_stores"
  post "upload/post_us_stores"
  get  "upload/done_us_stores"

  get  "upload/get_ca_stores"
  post "upload/post_ca_stores"
  get  "upload/done_ca_stores"

  get  "upload/get_skate_stores"
  post "upload/post_skate_stores"
  get  "upload/done_skate_stores"

  get  "run/get_list_of_processes"
  post "run/post_start_stores_import_process"
  get  "run/done_start_stores_import_process"

  get "list/get_inventory_files"
  get "list/download_inventory_file"
end
