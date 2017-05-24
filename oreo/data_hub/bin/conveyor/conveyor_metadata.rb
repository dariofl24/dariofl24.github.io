class ConveyorMetadata

  def initialize(metadata_filename, in_dir, fn_pattern, field_delimiter) 
    @metadata_fn = File.join(in_dir, metadata_filename)
    @fn_pattern = fn_pattern
    @delim = field_delimiter
    @in_dir = in_dir
  end

  def get() # read the file
    md = Hash.new
    if File.exists?(@metadata_fn)
      metadata_file = File.new(@metadata_fn, "r")
      metadata_file.each_line do |line|
        parts = line.chomp.split(@delim)
        md[parts[0]] = parts[1]
      end
      metadata_file.close
    end
    md
  end

  def refresh # new metadata
    metadata_file = File.new(@metadata_fn, "w")
    Dir[File.join(@in_dir, @fn_pattern)].each do |fn|
      metadata_file.write("#{File.basename(fn)}#{@delim}#{File.size(fn)}\n")
    end
    metadata_file.close
  end

end
