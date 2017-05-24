#!/usr/bin/ruby

require 'trollop'
require 'rubygems'
require 'csv'


opts = Trollop::options do
    opt :merchplanner, "Merch Planner CSV", :type=>String, :required=>true
    opt :inventory, "Inventory CSV", :type=>String, :required=>true
    opt :newmerchplannerwithsizes, "Result Merch Planner CSV with Sizes", :type=>String, :required=>true
end


$merchPlannerFilePath = opts[:merchplanner]
$inventoryFilePath = opts[:inventory]
$newmerchplannerwithsizesFilePath = opts[:newmerchplannerwithsizes]

$sizes = {}

#Group sizes per sku
CSV.foreach($inventoryFilePath) do |inventoryRow|
    style2 = inventoryRow[0]
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

#Generate a new merch planner including the sizes
CSV.open($newmerchplannerwithsizesFilePath, "wb", {:force_quotes => true, :col_sep => ","}) {|csv|
  
  CSV.foreach($merchPlannerFilePath) do |row|
    sku = row[0]
    sizes = row[36]
    sizes = $sizes[sku].join(',') if $sizes.has_key? sku
    if( sizes.to_s.strip.length == 0)
        sizes = ""
    end
    
    row[36] = sizes
    
    newRow = []
    row.each{ |item| 
      newRow << "#{item}";
    }
    
    csv << newRow 
  end
}

