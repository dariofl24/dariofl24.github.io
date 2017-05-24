require 'yaml'
require 'fileutils'


require_relative 'conveyor/analyzers/analyzer_factory'
require_relative 'conveyor/conveyor_metadata'
require_relative 'conveyor/conveyor_notifier'

class Conveyor

  def initialize(conf) 
    config_file = File.join(File.dirname(__FILE__), '../config', conf)
    @config = YAML.load(File.open(config_file))
    mkdirs
    tstamp = Time.now.strftime("%Y%m%dT%H%M%S")
    @config[:work_dir] = File.join(@config[:work_dir], tstamp)
    FileUtils::mkdir_p(@config[:work_dir])
  end

  def convey_files
    prepare # send to work (read md, copy to work)
    check_files # validate, notify
    consume # send to dw
  end

private

  def check_files
    Dir[File.join(@config[:work_dir], @config[:fn_pattern])].each do | fn |
      basename = File.basename(fn)
      analysis = {}
      analysis[:filename] = basename
      analyzer = AnalyzerFactory.new().getAnalyzer(@config, basename)
      analysis[:filedata] = analyzer.analyze 
      analysis[:condition] = analyzer.condition 
      @error = true if (:error == analysis[:condition])
      analysis[:integration] = @config[:integration]
      ConveyorNotifier.new(@config[:notification][:to_addrs], analysis).notify
    end
  end

  def clean_archive
    files = Dir[File.join(@config[:archive_dir], @config[:fn_pattern])]
    if files.length > @config[:archive_max]
      counter = 0
      files.sort{ | x, y | y <=> x }.each do |fn|
        File.delete(fn) unless counter < @config[:archive_max]
        counter += 1
      end
    end
  end

  def consume # move files from work to dw
    Dir[File.join(@config[:work_dir], @config[:fn_pattern])].each do |fn|
      basename = File.basename(fn)
      tstamp = File.ctime(fn).strftime("%Y%m%dT%H%M%S")

      copy_file(fn, @config[:archive_dir], [tstamp, "-", basename].join)

      @config[:out_dirs].each do |outdir| 
        copy_file(fn, outdir, basename) unless @error
      end 

      FileUtils.mv(fn, @config[:garbage_can])
    end
    FileUtils.rmdir(@config[:work_dir])
    clean_archive
  end

  def copy_file(source_f, dest_dir, dest_fn)
    outfile = File.join(dest_dir, dest_fn)
    FileUtils.cp(source_f, outfile)
  end

  def mkdirs
    @config[:mkdirs].each do | symbol |
      FileUtils::mkdir_p @config[symbol]
    end
  end

  def prepare() # send to work dir
    metadata = ConveyorMetadata.new(@config[:metadata_filename], @config[:in_dir], @config[:fn_pattern], @config[:delimiter])
    md = metadata.get()
    md.each do |name, old_size|
      in_file = File.join(@config[:in_dir], name)
      FileUtils.mv(in_file, @config[:work_dir]) if File.size(in_file) == old_size.to_i
    end
    metadata.refresh() # new md
  end

end

ARGV.each do | arg |
  Conveyor.new(arg).convey_files
end
