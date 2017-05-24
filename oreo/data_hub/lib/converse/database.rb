require 'rubygems'
require 'active_record'
require 'psych'

module Converse
    module Database

        def connect_db(logger = nil, db_config = nil)
            ActiveRecord::Base.logger = logger if not logger.nil?

            db_config = Psych::load_file 'database.yaml' if db_config == nil
            ActiveRecord::Base.establish_connection(db_config)
        end
    end
end
