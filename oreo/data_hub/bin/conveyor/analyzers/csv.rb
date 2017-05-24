require_relative 'base'

class CsvAnalyzer < BaseAnalyzer 

  def initialize(config, fileName)
    super(config, fileName) 
    @rule_valiolation = []
  end 

  def analyze 

    analysis = initAnalysis()
    analysis[:stats] = report 
    analysis[:error] = @rule_valiolation unless @rule_valiolation.empty?
    analysis[:condition] = :error if @condition === :error
    listify(analysis) 
  end 

private 
#    @config = YAML.load("--- \n:work_dir: ./csv\n
# :validation_rules:\n    - :notnull: 2\n    - :unique: 2\n    - :min_nbr_rows: 2")
  def countFields(line) 
    field_count = 1 
    line.each_char do |current| 
      field_count += 1 if current == ',' 
    end 
    field_count 
  end 

  def report 
    res = "#{@fileName}\n" 
    line_counts = iterate_file 
    line_counts.each do |r| 
      res += "#{r[1]} lines: #{r[0]} fields\n" 
    end 
    res 
  end 

  def stats(file, line_counts) 
    file.each_line do |line| 
      fields = countFields(line) 
      line_counts[fields] = 0 if nil === line_counts[fields] 
      line_counts[fields] = line_counts[fields] + 1 
    end 
  end

  def iterate_file 
    line_counts = {}
    File.open(File.join(@config[:work_dir], @fileName), "r") do |file_handle| 
      stats(file_handle, line_counts)
      validate(file_handle) if @config[:validation_rules]
    end 
    line_counts 
  end 

  def validate(file_handle) 
    targets = @config[:validation_rules]
    targets.each do |target|
      break unless @fileName == target[:file]
      target[:rules].each do |rule|
        validate_not_empty(file_handle, rule) if (rule[:notempty])  
        validate_unique(file_handle, rule) if (rule[:unique])
        validate_min_nbr_rows(file_handle, rule) if (rule[:min_nbr_rows])
      end
    end
  end

  def validate_not_empty(file, rule)
    notEmptyField = rule[:notempty]
    count = 0
    file.rewind
    file.each_line do |line| 
      count += 1
      fields = line.split(',')
      if (fields.size <= notEmptyField)
        @rule_valiolation << "not enough fields: #{File.basename(file)} line: #{count} col (0-base): #{notEmptyField} ::#{line}|\n"
        @condition = :error
        break
      end
      if (fields[notEmptyField].strip.empty?)
        @rule_valiolation << "empty not allowed at #{File.basename(file)} line: #{count} col (0-base): #{notEmptyField} ::#{line}|\n"
        @condition = :error
        break
      end
    end
  end

  def validate_unique(file, rule)
    uniqueField = rule[:unique]
    dictionary = {}
    file.rewind
    count = 0
    file.each_line do |line| 
      count += 1
      fields = line.split(',')
      if (fields.size <= uniqueField)
        @rule_valiolation << "not enough fields: #{File.basename(file)} line: #{count} col (0-base): #{uniqueField} ::#{line}|\n"
        @condition = :error
        break
      end
      target = fields[uniqueField].strip
      if (dictionary[target] )
        @rule_valiolation << "non unique value at #{File.basename(file)} line: #{count} col (0-base): #{uniqueField} ::#{line}|\n"
        @condition = :error
        break
      end
      dictionary[target] = 1
    end
    true
  end

  def validate_min_nbr_rows(file, rule)
    minNbrRows = rule[:min_nbr_rows]
    count = 0 
    file.rewind
    file.each_line do |line| 
      count += 1
    end
    if (minNbrRows > count)
      @rule_valiolation << "not enough rows at #{File.basename(file)} requirement: #{minNbrRows} found: #{count}\n"
      @condition = :error
    end
  end
 
end 
