require 'yaml'
require 'zip'

require_relative 'zip'
require_relative 'test_utils'
require_relative 'analyzer_factory'


class TestZip < TestUtils

  def setup
    @config = YAML.load("--- \n:work_dir: ./zip\n")
    @file = "foo.xml"
    @filepath = File.join(@config[:work_dir], @file)
    @zipfile = "foo.zip"
    @zipfilepath = File.join(@config[:work_dir], @zipfile)

    Dir.mkdir(@config[:work_dir]) 
    write_file(@filepath, xml_text)
    Zip::File.open(@zipfilepath, Zip::File::CREATE) do |zf|
    	zf.get_output_stream(@file) { |os| os.print(File.open(@filepath, "rb").read ) }
    end
    File.delete(@filepath)
  end

  def teardown
    File.delete(@zipfilepath) if File.exist?(@zipfilepath)
    File.delete(@filepath) if File.exist?(@filepath)
    Dir.delete(@config[:work_dir]) if Dir.exist?(@config[:work_dir])
  end

  def test_initialize
  	zp = ZipAnalyzer.new(@config, @zipfile) 
  	assert_not_nil(zp, "could not instanciate zip analyzer")
  end

  def test_analyze
  	zp = ZipAnalyzer.new(@config, @zipfile) 
  	analysis = zp.analyze
  	assert_equal([{:file=>"foo.xml", :stats=>"foo.xml\nroot\n+--- child (1) \n"}], analysis, "did not get expected output::#{analysis}")
  end

end
