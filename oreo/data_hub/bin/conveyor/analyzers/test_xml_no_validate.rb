require 'yaml'

require_relative 'xml_no_validate'
require_relative 'test_utils'

class TestXmlNoValidate < TestUtils

  def setup
  	@config = YAML.load("--- \n:work_dir: ./xml_no\n")
  	@file = "foo.xml"
  	@filepath = File.join(@config[:work_dir], @file)
    
  	Dir.mkdir(@config[:work_dir]) 
    write_file(@filepath, xml_text)
  end

  def teardown
    File.delete(@filepath) if File.exist?(@filepath)
    Dir.delete(@config[:work_dir]) if Dir.exist?(@config[:work_dir])
  end


  def test_initialize
    assert_not_nil(XmlNoValidateAnalyzer.new(@config, @file), "could not instanciate XmlNoValidate analyzer")
  end

  def test_analyze
    xmlNoValidate = XmlNoValidateAnalyzer.new(@config, @file)
    analysis = xmlNoValidate.analyze
    assert_equal([{:file=>"foo.xml", :stats=>"foo.xml\nroot\n+--- child (1) \n"}], analysis, "unexpected analyis: #{analysis}")
    condition = xmlNoValidate.condition
    assert_nil(condition, "unexpected condition: #{condition}")
  end

end
