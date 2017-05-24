require 'rubygems'

require "converse/models/extended_active_record"

class AbstractModel < ExtendedActiveRecord
    self.abstract_class = true
end
