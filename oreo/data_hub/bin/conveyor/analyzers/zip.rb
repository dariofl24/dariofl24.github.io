require 'zip'

require_relative 'base'

class ZipAnalyzer < BaseAnalyzer

  def initialize(config, fileName) 
    super(config, fileName) 
  end

  def analyze
    orig_work_dir = @config[:work_dir]
    @config[:work_dir] = copy_zip_to_subdir

    @condition = nil 
    analysis_collection = Array.new()
    working_zip = File.join(@config[:work_dir], @fileName)
    Zip::File.open(working_zip) do |this_zip| #subdir
      this_zip.each do |entry| 
        unzipped = File.join(@config[:work_dir], entry.name)
        entry.extract(unzipped)
        analyzerFactory = AnalyzerFactory.new()
        analyzer = analyzerFactory.getAnalyzer(@config, entry.name)
        analysis = analyzer.analyze
        @condition = analyzer.condition() if (nil != analyzer.condition())
        analysis_collection += analysis
        File.delete(unzipped)
      end
    end
    File.delete(working_zip)
    FileUtils.rmdir(@config[:work_dir])
    @config[:work_dir] = orig_work_dir
    listify(analysis_collection)
  end

  def copy_zip_to_subdir ()
    tstamp = Time.now.strftime("%Y%m%dT%H%M%S")
    dir_name = @fileName + tstamp
    original_zip = File.join(@config[:work_dir], @fileName)
    new_dir = File.join(@config[:work_dir], dir_name) # original work dir
    FileUtils::mkdir_p(new_dir)
    FileUtils.cp(original_zip , new_dir)
    new_dir
  end

end