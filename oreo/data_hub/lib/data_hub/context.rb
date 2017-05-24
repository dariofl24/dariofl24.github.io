require 'psych'
require 'log4r/yamlconfigurator'
require 'converse/logging'
require 'converse/database'

module DataHub
    class Context
        
        include Converse::Logging
        include Converse::Database
        
        alias_method :converse_connect_db, :connect_db
        
        attr_accessor :options, :logger
        
        def initialize(bin_file_path, config_yaml_file_name=nil, logger_name="data_hub")
            @bin_file_path = bin_file_path
            @root_path = determine_root_path(@bin_file_path)
            @config_yaml_file_name = config_yaml_file_name
            @logger_name = logger_name
            @options = obtain_options
            @logger = obtain_logger
        end
        
        
        def connect_db
            db_config = Psych.load_file "#{@root_path}/config/database.yaml"
            converse_connect_db(logger, db_config)
        end
        
        def execute( description, &block)
            @logger.info( ">>> START - #{description}")
            
            begin
                unless ActiveRecord::Base.connected?
                    connect_db
                end
                
                yield @options, @logger if block_given?
            rescue SystemExit => exit_exception
                unless exit_exception.success?
                    @logger.error exit_exception
                    raise exit_exception
                end
            rescue Exception => e
                @logger.error e
                @logger.error "TRACE:\n" + e.backtrace.join("\n")
                raise e
            ensure
                @logger.info( "<<< END -  #{description}")
            end
        end
        
        private
        
        def determine_root_path( bin_file_path)
            full_bin_file_path = File.expand_path(bin_file_path)
            full_bin_file_path.sub(/\/data_hub\/.*/, '/data_hub')
        end
        
        def obtain_options
            if @config_yaml_file_name == nil
              return nil
            end
            
            return Psych.load_file "#{@root_path}/config/#{@config_yaml_file_name}"
        end
        
        def obtain_logger
            Log4r::YamlConfigurator['log_path'] = "#{@root_path}/log"
            log_config_file_path = "#{@root_path}/config/log.yaml"
            setup_logger(File.basename(@bin_file_path), @logger_name, log_config_file_path)
        end
        
    end
end
