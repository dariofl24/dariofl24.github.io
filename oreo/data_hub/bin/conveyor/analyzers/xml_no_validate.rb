require 'nokogiri'

require_relative 'base'

class XmlNoValidateAnalyzer < BaseAnalyzer

  def initialize(config, fileName) 
    super(config, fileName)
  end


  def analyze
    analysis = initAnalysis()
    doc = Nokogiri::XML(File.read(File.join(@config[:work_dir], @fileName))) 
    analysis[:stats] = stats(doc) 
    listify(analysis) 
  end

private 

  def stats(doc)
    result = {}
    result[:root] = doc.root.name
    result[:children] = Hash.new(0)
    doc.root.children.each do | node | 
      result[:children][node.name] += 1 if node.element? 
    end
    stats_msg(result)
  end

  def stats_msg(stats)
    res = "#{@fileName}\n#{stats[:root]}\n"
    stats[:children].each do | name, count|
      res += sprintf("+--- %s (%d) \n", name, count)
    end
    res
  end

end
