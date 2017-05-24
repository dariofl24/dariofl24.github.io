ENV["RAILS_ENV"] = "test"
require 'simplecov'
SimpleCov.start 'rails'

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

module ActiveRecord
    module ConnectionAdapters
        class PostgreSQLAdapter < AbstractAdapter
            # PostgreSQL only disables referential integrity when connection user is root and that is not the case.
            def disable_referential_integrity
                yield
            end
        end
    end
end

class ActiveSupport::TestCase
  fixtures :all
end
