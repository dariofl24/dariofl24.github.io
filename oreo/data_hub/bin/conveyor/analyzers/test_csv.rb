require 'yaml'

require_relative 'csv'
require_relative 'test_utils'

class TestCsv < TestUtils


  def setup

    @file = "foo.csv"
    @config = YAML.load("--- \n:work_dir: ./csv\n")
  	@filepath = File.join(@config[:work_dir], @file)

    File.delete(@filepath) if (Dir.exist?(@config[:work_dir]) && File.exist?(@filepath))
    Dir.delete(@config[:work_dir])  if Dir.exist?(@config[:work_dir])

    Dir.mkdir(@config[:work_dir]) 
    write_file(@filepath, csv_text)
  end
  
  def csv_text
    csv_text = <<CSV_END
field1, field2, field3
1,2,3
2, ,3
3,,3
CSV_END
    csv_text
  end

  def rule_text 
    rule_text = <<RULE_END
--- 
:work_dir: ./csv
:validation_rules:
    - :file: foo.csv
      :rules:
        - :notempty: 0
        - :unique: 0
        - :min_nbr_rows: 4 
RULE_END
    rule_text
  end

  def teardown
    File.delete(@filepath) 
    Dir.delete(@config[:work_dir]) 
  end

  def test_initialize
    csv = CsvAnalyzer.new(@config, @file)
    assert_not_nil(csv, "could not instanciate csv analyzer")
  end

  def test_analyze
    csv = CsvAnalyzer.new(@config, @file)
    analysis = csv.analyze
    assert_equal( [{:file=>"foo.csv", :stats=>"foo.csv\n4 lines: 3 fields\n"}], analysis, "unexpected analyis: #{analysis}")
    condition = csv.condition
    assert_nil(condition, "unexpected condition: #{condition}")
  end

  def test_validate_all_ok
    config = YAML.load(rule_text)
    csv = CsvAnalyzer.new(config, @file)
    analysis = csv.analyze
    assert_nil(csv.condition, "condition not nil::#{csv.condition}")
  end

  def test_validate_not_empty
    config = YAML.load(rule_text)
    csv = CsvAnalyzer.new(config, @file)
    config[:validation_rules][0][:rules][0][:notempty] = 1
    analysis = csv.analyze
    assert_equal(:error, csv.condition, "not detecting missing field")
    config[:validation_rules][0][:rules][0][:notempty] = 4
    analysis = csv.analyze
    assert_equal(:error, csv.condition, "not detecting non-existing field")
  end


  def test_validate_unique
    config = YAML.load(rule_text)
    csv = CsvAnalyzer.new(config, @file)
    config[:validation_rules][0][:rules][0][:unique] = 1
    analysis = csv.analyze
    assert_equal(:error, csv.condition, "not detecting non-unique field")
    config[:validation_rules][0][:rules][0][:unique] = 2
    analysis = csv.analyze
    assert_equal(:error, csv.condition, "not detecting non-unique field")
  end


  def test_validate_min_nbr_rows
    config = YAML.load(rule_text)
    csv = CsvAnalyzer.new(config, @file)
    config[:validation_rules][0][:rules][0][:min_nbr_rows] = 5
    analysis = csv.analyze
    assert_equal(:error, csv.condition, "not detecting too few rows")
  end

end
