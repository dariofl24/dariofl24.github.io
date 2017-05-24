require 'rubygems'
require 'trollop'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/constants'
require 'converse/io'
require 'converse/import/customer_importer'
require 'converse/import/customer_addresses_importer'
require 'converse/import/employee_importer'
require 'converse/import/employee_relatives_importer'
require 'converse/export/exporter_facade'
require 'data_hub/context'

if __FILE__ == $0
    context = DataHub::Context.new( __FILE__, 'process_customer_data.yaml')

    opts = Trollop::options do
        opt :processed_file_suffix, 'Suffix to the input file once processed.',
            :type => :string,
            :required => false,
            :default => Converse::IO.get_default_file_suffix
    end

    context.options[Converse::Constants::PROCESSED_FILE_SUFFIX_OPTION] = opts[:processed_file_suffix]

    context.execute "Customers feed import" do |options,logger|
        customer_importer = Converse::Impex::CustomerImporter.new(options, logger)
        customer_importer.run
    end
    
    context.execute "Customer addresses feed import" do |options,logger|
        customer_addresses_importer = Converse::Impex::CustomerAddressesImporter.new(options, logger)
        customer_addresses_importer.run
    end
    
    context.execute "Exmployees feed import" do |options,logger|
        employee_importer = Converse::Impex::EmployeeImporter.new(options, logger)
        employee_importer.run
    end
    
    context.execute "Employee relatives feed import" do |options,logger|
        employee_relatives_importer = Converse::Impex::EmployeeRelativesImporter.new(options, logger)
        employee_relatives_importer.run
    end
    
    context.execute "Export customers and Employees" do |options,logger|
        exporter = Converse::Impex::ExporterFacade.new(options, logger, Converse::Impex::ExportMode::CUSTOMER | Converse::Impex::ExportMode::EMPLOYEE)
        exporter.run
    end

end
