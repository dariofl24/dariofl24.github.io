require 'test/unit'
require 'yaml'

require_relative 'analyzer_factory'

class TestAnalyzerFactory < Test::Unit::TestCase

  def test_initialize
    assert_not_nil(AnalyzerFactory.new(), "could not instanciate AnalyzerFactory") 
  end

  def conf_with_schema
  	config = <<WITH_SCHEMA_END
--- 
:work_dir: ./zip
:schema_associations:
    ^foo\.xml$: foo.xsd
WITH_SCHEMA_END
    config
  end

  def test_getAnalyzer
  	config = YAML.load("--- \n:work_dir: ./zip\n")

  	fac = AnalyzerFactory.new()
  	csvAnalyzer = fac.getAnalyzer(config, "foo.csv")
    assert_equal("CsvAnalyzer", csvAnalyzer.class.to_s, "did not not get csv analyzer::#{csvAnalyzer.class}")
  	zipAnalyzer = fac.getAnalyzer(config, "foo.zip")
    assert_equal("ZipAnalyzer", zipAnalyzer.class.to_s, "did not not get csv analyzer::#{zipAnalyzer.class}")
  	unrecognizeAnalyzer = fac.getAnalyzer(config, "foo.bar")
    assert_equal("UnrecognizeAnalyzer", unrecognizeAnalyzer.class.to_s, "did not not get csv analyzer::#{unrecognizeAnalyzer.class}")

  	xmlNoValidateAnalyzer = fac.getAnalyzer(config, "foo.xml")
    assert_equal("XmlNoValidateAnalyzer", xmlNoValidateAnalyzer.class.to_s, "did not not get xml no validate analyzer::#{unrecognizeAnalyzer.class}")

  	configWithSchema = YAML.load(conf_with_schema)

  	xmlValidateAnalyzer = fac.getAnalyzer(configWithSchema, "foo.xml")
    assert_equal("XmlValidateAnalyzer", xmlValidateAnalyzer.class.to_s, "did not not get xml validate analyzer::#{unrecognizeAnalyzer.class}")

  	xmlNoValidateAnalyzer = fac.getAnalyzer(configWithSchema, "bar.xml")
    assert_equal("XmlNoValidateAnalyzer", xmlNoValidateAnalyzer.class.to_s, "didnot get xml no validate analyzer when checking schema::#{unrecognizeAnalyzer.class}")

  end

end
