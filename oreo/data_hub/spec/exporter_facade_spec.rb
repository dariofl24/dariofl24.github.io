require 'log4r'

require_relative 'support/spec_helper'
require 'converse/export/exporter_facade'

describe Converse::Impex::ExporterFacade do
    context "run export processes" do

        it "should receive options and logger when configured" do
            options_mock = {}
            logger_mock = Logger.new "exporter_facade-000001.log"
            facade = Converse::Impex::ExporterFacade.new(options_mock, logger_mock)

            facade.options == options_mock
            facade.logger == logger_mock
        end

        it "should have a default logger" do
            options_mock = {}
            facade = Converse::Impex::ExporterFacade.new(options_mock)

            facade.options == options_mock
            facade.logger.respond_to? :info
        end

        it "should run exporters in proper order" do

            class ExporterFacadeMock < Converse::Impex::ExporterFacade
                attr_accessor :results

                def initialize
                    super({})
                    @results = []
                end

                def run_exporter(exporter, parameters = {})
                    results << { :exporter_class => exporter[:class], :output_file_name => exporter[:file_name] }
                end
            end

            facade_mock = ExporterFacadeMock.new
            facade_mock.run

            expected = [
                { :exporter_class => Converse::Impex::CatalogExporter, :output_file_name => "catalog.xml" },
                { :exporter_class => Converse::Impex::DefaultPriceBooksExporter, :output_file_name => "prices.xml" },
                { :exporter_class => Converse::Impex::ProductInventoryExporter, :output_file_name => "inventory.xml" },
                { :exporter_class => Converse::Impex::CustomerExporter, :output_file_name => "customers.xml" },
                { :exporter_class => Converse::Impex::EmployeeRelativesExporter, :output_file_name => "employee_relatives.xml" },
                { :exporter_class => Converse::Impex::NikeOMSRequestExporter, :output_file_name => "nikeoms_requests.csv" },
                { :exporter_class => Converse::Impex::StoreExporter, :output_file_name => "stores.xml" },
                { :exporter_class => Converse::Impex::SalesPriceBooksExporter, :output_file_name => 'sale-prices.xml' }
            ]

            expected.each_with_index do |value, index|
                facade_mock.results[index][:exporter_class] == value[:exporter_class]
                facade_mock.results[index][:output_file_name] == value[:output_file_name]
            end
        end

        it "should run an exporter" do

            options_mock = {}
            facade_mock = Converse::Impex::ExporterFacade.new(options_mock)
            class << facade_mock
                attr_accessor :current_filename, :output_filename

                def safe_copy(current_filename, output_filename)
                    self.current_filename = current_filename
                    self.output_filename = output_filename
                end
            end

            class ExporterMock
                attr_accessor :output_filename
                
                def initialize(options, logger)
                    @@options = options
                    @@logger = logger
                    @@run_executed = false
                end

                def run
                    @@run_executed = true
                    @@processed_file_paths = ["my_results_file.txt"]
                    @output_filename = "my_results_output.txt"
                end

                def self.options
                    @@options
                end

                def self.run_executed
                    @@run_executed
                end

                def can_override_output?(file_name)
                    true
                end

                def processed_file_paths
                    @@processed_file_paths
                end
            end

            facade_mock.run_exporter({ :class => ExporterMock, :file_name => "my_outputfile.txt" })

            ExporterMock.options == options_mock
            ExporterMock.run_executed == true

            facade_mock.current_filename == "my_results_file.txt"
            facade_mock.output_filename == "my_outputfile.txt"

        end

        it "should verify the exporters have a constructor with two args at least" do
            options_mock = {}
            logger_mock = Logger.new "exporter_facade-000001.log"

            Converse::Impex::CatalogExporter.new(options_mock, logger_mock)
            Converse::Impex::DefaultPriceBooksExporter.new(options_mock, logger_mock)
            Converse::Impex::ProductInventoryExporter.new(options_mock, logger_mock)
            Converse::Impex::CustomerExporter.new(options_mock, logger_mock)
            Converse::Impex::EmployeeRelativesExporter.new(options_mock, logger_mock)
            Converse::Impex::StoreExporter.new(options_mock, logger_mock)
            Converse::Impex::SalesPriceBooksExporter.new(options_mock, logger_mock)
        end

    end
end
