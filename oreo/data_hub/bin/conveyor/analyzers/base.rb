class BaseAnalyzer

  attr_accessor :condition

  def initialize(config, fileName) 
    @config = config
    @fileName = fileName
  end

  def initAnalysis
    @condition = nil
    analysis = {} 
    analysis[:file] = @fileName 
    analysis
  end

  def listify(target)
    newlist = Array.new()
    newlist << target
    newlist.flatten
  end

end
