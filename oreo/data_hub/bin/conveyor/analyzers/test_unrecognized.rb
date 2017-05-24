require 'test/unit'
require 'yaml'

require_relative 'unrecognized'

class TestUnrecognized < Test::Unit::TestCase


  def setup
    @config = YAML.load("--- \n:work_dir: ./unrecognized\n")
    @file = "unrecognized"
    @filepath = File.join(@config[:work_dir], @file)
  end

  def test_initialize
    unrecognized = UnrecognizeAnalyzer.new(@config, @file)
    assert_not_nil(unrecognized, "could not instanciate unrecognized analyzer")
  end

  def test_analyze
    unrecognized = UnrecognizeAnalyzer.new(@config, @file)
    analysis = unrecognized.analyze
    assert_equal([{:file=>"unrecognized", :unknown_file=>true}], analysis, "unexpected analyis: #{analysis}")
    condition = unrecognized.condition
    assert_equal(:unrecognized, condition, "unexpected condition: #{condition}")
  end

end