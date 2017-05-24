require "socket"
require 'net/smtp'

class ConveyorNotifier

  def initialize(to_addrs, analysis)
    @to_addresses = to_addrs
    @analysis = analysis
  end
  
  def notify 
    send_mail(message(subject, body))
  end

  def body   
    result = "#{@analysis[:integration]} \n"
    @analysis[:filedata].each do |fd|
      result += "unknown file: #{fd[:file]}\n" if fd[:unknown_file]
      result += error_msg(fd) if fd[:error]
      result += fd[:stats] if fd[:stats]
    end
    result
  end

  def message(subj_header, msg) 
    message = <<MESSAGE_END
From: Datahub <DO_NOT_REPLY@#{Socket.gethostname}>
To: #{@to_header}
Subject: #{subj_header}
#{msg}
MESSAGE_END
    message
  end

  def subject
    "#{@analysis[:integration]} #{condition}#{@analysis[:filename]}"
  end

private

  def condition
    return 'Unknown File: ' if @analysis[:condition] == :unrecognized
    return 'Error: ' if @analysis[:condition] == :error
  end 

  def error_msg(fd)
    res =  "#{fd[:file]}\nerrors (#{fd[:error].length})\n"
    fd[:error].each do | error|
        res += " --- \n#{error} \n"
    end
    res
  end

  def make_to_header() 
    to_header = ''
    @to_addresses.each do | addr |
       to_header += ', ' unless 0 == to_header.size
       to_header += addr
    end 
    to_header
  end
  

  def send_mail(msg)
    Net::SMTP.start('localhost') do |smtp|
      smtp.send_message(msg, "DO_NOT_REPLY@#{Socket.gethostname}", @to_addresses) 
    end
  end

end


