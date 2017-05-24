require 'nokogiri'

require_relative 'xml_no_validate'

class XmlValidateAnalyzer < XmlNoValidateAnalyzer

  def initialize(config, fileName) 
    super(config, fileName) 
  end


  def analyze 
    analysis = initAnalysis()
    doc = Nokogiri::XML(File.read(File.join(@config[:work_dir], @fileName))) 
    errors = validate(doc) 
    if (errors)
      analysis[:errors] = errors 
      @condition = :error    #   "Error: "
    else 
      analysis[:stats] = stats(doc) 
    end
    listify(analysis)
  end

private 

  def getSchema 
    @config[:schema_associations].each do |key, value| 
      return value if (@fileName =~ Regexp.new(key)) 
    end 
  end 

  def validate(doc) 
    res = []
    orig_cwd = FileUtils.pwd
    FileUtils.cd(@config[:schema_dir])
    schema = getSchema
    Nokogiri::XML::Schema(File.read(schema)).validate(doc).each do |error|
      res << error 
    end
    FileUtils.cd(orig_cwd)
    res unless 0 == res.length
  end

end
