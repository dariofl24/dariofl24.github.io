require 'test/unit'
require 'yaml'

require_relative 'conveyor_notifier'

class TestBase < Test::Unit::TestCase

  def setup
    config = YAML.load("--- foo")
    analysis = {}
    analysis[:integration] = "Integration"
    analysis[:filename] = "file.name"
    @filedata = {:file => "file.name", :stats => "root\n+--- child (1)\n" }
    analysis[:filedata] = [@filedata] 
    analysis[:condition] = nil 
    @analysis = analysis
  end

  def test_initialize
    assert_not_nil(ConveyorNotifier.new("u@h.c", @analysis), "cannot initialize ConveyorNotifier")
  end

  def test_subject
  	noti = ConveyorNotifier.new("u@h.c", @analysis)
  	subj = noti.subject
  	assert_equal("Integration file.name", subj, "did not get default subject::#{subj}")
    @analysis[:condition] = :error
  	errSubj = noti.subject
  	assert_equal("Integration Error: file.name", errSubj, "did not get default subject::#{errSubj}")
    @analysis[:condition] = :unrecognized
  	unkwnSubj = noti.subject
  	assert_equal("Integration Unknown File: file.name", unkwnSubj, "did not get default subject::#{unkwnSubj}")
  end

  def test_body
  	noti = ConveyorNotifier.new("u@h.c", @analysis)
    body = noti.body
    assert_equal("Integration \nroot\n+--- child (1)\n", body, "unexpected body::#{body}")
    @filedata[:unknown_file] = "true"
    ufbody = noti.body
    assert_equal("Integration \nunknown file: file.name\nroot\n+--- child (1)\n", ufbody, "unexpected body::#{ufbody}")
    @filedata[:unknown_file] = nil
    @filedata[:error] = ["err"]
    errbody = noti.body
    assert_equal("Integration \nfile.name\nerrors (1)\n --- \nerr \nroot\n+--- child (1)\n", errbody, "unexpected body::#{errbody}")
  end

end