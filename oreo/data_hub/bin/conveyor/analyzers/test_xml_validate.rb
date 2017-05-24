require 'yaml'

require_relative 'xml_validate'
require_relative 'test_utils'

class TestXmlValidate < TestUtils

  def setup
  	@config = YAML.load("--- \n:work_dir: ./xml\n:schema_dir: ./schemas\n:schema_associations:\n    ^foo\.xml$: foo.xsd\n")
  	@file = "foo.xml"
  	@filepath = File.join(@config[:work_dir], @file)
  	@schema = "foo.xsd"
  	@schemapath = File.join(@config[:schema_dir], @schema)
  	Dir.mkdir(@config[:work_dir]) 
  	Dir.mkdir(@config[:schema_dir]) 
    write_file(@filepath, xml_text)
    write_file(@schemapath, schema_text)
  end

  def schema_text
    schema_text = <<SCHEMA_END
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root">
    <xs:complexType>
      <xs:sequence>
        <xs:element type="xs:string" name="child"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
SCHEMA_END
    schema_text
  end

  def invalid_xml_text
    xml_text = <<XML_END
<?xml version="1.0" encoding="utf-8"?>
<root>
  <leaf />
</root>
XML_END
    xml_text
  end

  def teardown
    File.delete(@filepath) if File.exist?(@filepath)
    Dir.delete(@config[:work_dir]) if Dir.exist?(@config[:work_dir])
    File.delete(@schemapath) if File.exist?(@schemapath)
    Dir.delete(@config[:schema_dir]) if Dir.exist?(@config[:schema_dir])
  end


  def test_initialize
    assert_not_nil(XmlValidateAnalyzer.new(@config, @file), "could not instanciate XmlValidate analyzer")
  end

  def test_validate
  	validator = XmlValidateAnalyzer.new(@config, @file)
    analysis = validator.analyze
    assert_equal([{:file=>"foo.xml", :stats=>"foo.xml\nroot\n+--- child (1) \n"}], analysis, "unexpected analysis::#{analysis}")

    write_file(@filepath, invalid_xml_text)
    analysis = validator.analyze
    assert_not_nil(analysis[0][:errors], "did not recognize malformed xml::#{analysis}")
  end


end