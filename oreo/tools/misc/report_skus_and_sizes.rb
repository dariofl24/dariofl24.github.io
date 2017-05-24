#!/usr/bin/ruby

require 'trollop'
require 'rubygems'
require 'csv'
require 'roo'


opts = Trollop::options do
    banner <<-EOS
    Generates a SKU - Sizes report in CSV file.
    Takes the SKUs from a Merch Planner XLS file and the SIZEs from a sigma inventory CSV file.
    
    Usage:
           ./report_skus_and_sizes.rb [options]
    where [options] are:
EOS

    opt :merchplanner, "Merch Planner XLS. E.g.: Merch\ Planner_Aug_5.xls", :type=>String, :required=>true
    opt :inventory, "Sigma Inventory CSV. E.g.: sigmacoinvats.csv", :type=>String, :required=>true
    opt :report, "Result CSV with SKUs and  Sizes. E.g.: report.csv", :type=>String, :required=>true
    opt :sheet, "Active Sheet to process in the Merch Planner XLS", :type=>Integer, :require=>false, :default=>1
    opt :sku_column_name, "Name of the SKU column", :type=>String, :require=>false, :default=>"SKU"
    opt :sizes_column_name, "Name of the Sizes column", :type=>String, :require=>false, :default=>"Sizes"
end


$merchPlannerFilePath = opts[:merchplanner]
$inventoryFilePath = opts[:inventory]
$reportPath = opts[:report]
$active_sheet = opts[:sheet]
$sku_column_name = opts[:sku_column_name]
$sizes_column_name = opts[:sizes_column_name]

$sizes = {}

#Group sizes per sku
CSV.foreach($inventoryFilePath) do |inventoryRow|
    style2 = inventoryRow[0]
    if( style2.is_a? Numeric)
      style2 = style2.to_i
    elsif style2.is_a? String
      style2.strip!
    end
    
    style2 = style2.to_s
    
    size = inventoryRow[2]
    
    if !$sizes.has_key? style2
        $sizes[style2] = []
    end
    newSize = size
    begin 
      if( size.is_number? && size < 100 )
        newSize = "0" + newSize
      end
    rescue
    end
    
    $sizes[style2] << newSize
    
end

$sizes.delete("Style2")


#MERCH PLANNER XLS processing

xls = Roo::Excel.new($merchPlannerFilePath)
xls.default_sheet = xls.sheets[$active_sheet]

#Detect SKU and Sizes column numbers
$sizes_column_index = -1
$sku_column_index =-1

(1..100).each{ |column_index|
    column_name = xls.cell(1,column_index)
    if column_name == $sku_column_name
      $sku_column_index = column_index
    elsif column_name == $sizes_column_name
      $sizes_column_index = column_index
    end
    
    if( $sku_column_index != -1 && $sizes_column_index != -1 )
      break
    end
}

puts "SKU column index = #{$sku_column_index}, SIZES column index=#{$sizes_column_index}"


if( $sku_column_index == -1 || $sizes_column_index == -1 )
  puts "SIZES or SKU columns where not found in merchplanner xls file."
  exit
end



row = 2 #row 1 is the column names

CSV.open($reportPath, "wb", {:force_quotes => true, :col_sep => "|"}) {|csv|
  csv << [$sku_column_name, $sizes_column_name]
  
  while true do
    
      sku = xls.cell(row, $sku_column_index)
      
      if( sku == nil )
        puts "DONE - #{row-2} rows processed."
        break
      end
      
      if( sku.is_a? Numeric)
        sku = sku.to_i
      elsif sku.is_a? String
        sku.strip!
      end
      
      sku = sku.to_s
      
    sizes = $sizes[sku].join(',') if $sizes.has_key? sku
    if( sizes.to_s.strip.length == 0)
        if( xls.cell(row, "J") == "Accessories")
          sizes = "One Size"
        else
          sizes = "0"
        end
    end
    
    csv_result_row = ["#{sku}", "#{sizes}"]
    csv << csv_result_row
    row =row+1
  end

}

puts "DONE - Results in CSV file #{$resultPath}, columns separated by pipe '|'."


