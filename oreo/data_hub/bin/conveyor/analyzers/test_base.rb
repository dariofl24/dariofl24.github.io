require 'yaml'

require_relative 'base'
require_relative 'test_utils'

class TestBase < TestUtils

  def setup
#    @dir = "dir"
#    @file = "file"
    config = YAML.load("--- foo")
    @base = BaseAnalyzer.new(config, "file")
  end

  def test_initialize
    assert_not_nil(@base, "cannot initialize BaseAnalyzer")
  end

  def test_condition
  	@base.condition = :ok
    assert_equal(:ok, @base.condition, "cannot set baseAnalyzer condition")
  end

  def test_listify
  	someString = "someString"
  	assert_equal([someString], @base.listify(someString), "cannot listify string")
  	someArray = [someString]
  	assert_equal([someString], @base.listify(someArray), "cannot listify 1 element array")
  	someArray << someString
  	assert_equal([someString, someString], @base.listify(someArray), "cannot listify 2 element array")
  	anotherArray = [someString, someString]
  	someArray << anotherArray
  	assert_equal([someString, someString, [someString, someString]], someArray, "cannot make nested array")
  	assert_equal([someString, someString, someString, someString], @base.listify(someArray), "cannot listify nested array")
  end

end