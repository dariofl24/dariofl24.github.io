require 'active_record'
require 'rspec/rails/extensions/active_record/base'
require 'logger'
require 'foreigner'

require "converse/models/master_product.rb"
require "converse/models/variation_product.rb"
require "converse/models/product_price.rb"
require "converse/models/product_inventory.rb"

ActiveRecord::Base.establish_connection adapter: "sqlite3", database: ":memory:"
# Uncomment the following line to output SQL commands to STDERR
#ActiveRecord::Base.logger = Logger.new(STDERR)

Foreigner.load

ActiveRecord::Migrator.up "migrations"

RSpec.configure do |config|
    config.around do |example|
        ActiveRecord::Base.transaction do
            example.run
            raise ActiveRecord::Rollback
        end
    end
end

module ActiveModel::Validations
    def errors_on(attribute)
        self.valid?
        [self.errors[attribute]].flatten.compact
    end

    alias :error_on :errors_on
end
