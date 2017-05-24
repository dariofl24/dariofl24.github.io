# switch to the "lib" folder to make loading of the required dependencies easier
$:.unshift File.join(File.dirname(__FILE__), '../../lib')

require_relative "active_record.rb"
require_relative "simplecov.rb"
require_relative "fakefs.rb"
