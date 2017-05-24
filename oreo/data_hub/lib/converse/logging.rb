require 'log4r'
require 'log4r/yamlconfigurator'
require 'active_support/inflector'

module Converse
    module Logging

        def setup_logger(clazz, name = nil, logs_configuration_yaml= nil)
            name = name || clazz.name.demodulize.underscore

            if( logs_configuration_yaml == nil || !File.exist?(logs_configuration_yaml))
                logger = Log4r::Logger.new name

                logger.add Log4r::StdoutOutputter.new("console", {
                :formatter => Log4r::PatternFormatter.new({ :pattern => "[%l] %d :: %m",
                                                     :date_pattern => "%Y-%m-%d %H:%M:%S %Z" })
                })

            else
              Log4r::YamlConfigurator.load_yaml_file(logs_configuration_yaml)

              logger = Log4r::Logger[name]
              if logger == nil
                  raise "There is no logger configuration for logger '#{name}' in this file: #{logs_configuration_yaml}"
              end

            end

          logger
        end

    end
end
