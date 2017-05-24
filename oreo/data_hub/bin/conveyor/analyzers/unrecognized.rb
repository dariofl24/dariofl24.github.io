require_relative 'base'

class UnrecognizeAnalyzer < BaseAnalyzer

  def initialize(config, fileName)
    super(config, fileName) 
  end 


  def analyze 
    analysis = initAnalysis()
    @condition = :unrecognized     #"Unrecognized file: "
    analysis[:unknown_file] = true 
    listify(analysis) 
  end

end
