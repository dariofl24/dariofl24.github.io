require 'yaml'

require_relative 'csv'
require_relative 'unrecognized'
require_relative 'xml_no_validate'
require_relative 'xml_validate'
require_relative 'zip'

class AnalyzerFactory

  def initialize() 
    @csv_regx = /^.*\.csv$/
    @xml_regx = /^.*\.xml$/
    @zip_regx = /^.*\.zip$/
  end

  def getAnalyzer(config, filename) 
    if (@csv_regx.match(filename))
      return CsvAnalyzer.new(config, filename) 
    elsif (@xml_regx.match(filename)) 
      return (validate?(config, filename)) ? 
        XmlValidateAnalyzer.new(config, filename) : 
        XmlNoValidateAnalyzer.new(config, filename) 
    elsif (@zip_regx.match(filename))
      return ZipAnalyzer.new(config, filename) 
    end
    UnrecognizeAnalyzer.new(config, filename) 
  end

private

  def validate?(config, filename) 
    return false if !config[:schema_associations]
    config[:schema_associations].each do |key, value|
      regexp = Regexp.new(key)
      if (filename =~ regexp)
        return true
      end
    end
    false
  end

#  def do_not_validate(config, basename)
#    return false if !config[:no_validation]
#    @config[:no_validation].each do | pattern |
#      return true if Regexp.new(pattern).match(basename) 
#    end 
#    false
#  end

end

