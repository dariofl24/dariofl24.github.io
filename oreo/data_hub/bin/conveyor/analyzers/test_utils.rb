require 'test/unit'

class TestUtils < Test::Unit::TestCase

  def write_file(file, text)
  	File.open(file, "w") do |f| 
  	  f.write(text)
  	end
  end

  def xml_text
    xml_text = <<XML_END
<?xml version="1.0" encoding="utf-8"?>
<root>
  <child />
</root>
XML_END
    xml_text
  end

end