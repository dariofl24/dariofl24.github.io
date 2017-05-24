require 'rubygems'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/constants'
require 'data_hub/context'
require 'converse/export/exporter_facade'

if __FILE__ == $0

    context = DataHub::Context.new(__FILE__, 'export_nikeoms_requests.yaml')

    context.execute "Export Nike OMS request CSV feed for EMEA orders" do |options, logger|
        exporter = Converse::Impex::ExporterFacade.new(options, logger, Converse::Impex::ExportMode::NIKE_OMS_EMEA)
        exporter.run
    end
end
