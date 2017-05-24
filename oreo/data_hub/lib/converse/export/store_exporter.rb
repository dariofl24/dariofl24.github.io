require 'rubygems'

require 'converse/logging'
require 'converse/utils'
require 'converse/models/canadian_store'
require 'converse/models/usa_store'
require 'converse/models/skateboarding_store'
require 'converse/xml/xml_document_builder'

module Converse
    module Impex

        class StoreExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Logging
            include Converse::Utils

            STORE_CLASSES = [ USAStore, CanadianStore, SkateboardingStore ]

            def self.get_options(options)
                { :output_directory => options['output_directory'], :output_file_prefix => 'stores' }
            end

            def initialize(options, logger = nil)
                super(StoreExporter.get_options(options))
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def build_xml(xml)
                @logger.debug "Building stores XML..."
                xml.stores :xmlns => "http://www.demandware.com/xml/impex/store/2007-04-30" do
                    create_all_stores xml
                end

                @processed_file_paths.push(xml.target!.path)
            end

            def create_all_stores(xml)
                STORE_CLASSES.each do |clazz|
                    create_stores(xml, clazz)
                end
            end

            def create_stores(xml, clazz)
                @logger.debug "Creating #{clazz} XML records..."
                clazz.find_each(
                    :batch_size => 500,
                    :include => :location
                ) do |store|
                    create_store(xml, store)
                end
            end

            def create_store(xml, store)
                @logger.debug "Creating #{store.type[:name]} store XML record \"#{store.name}\"..."
                xml.store("store-id" => "#{store.unique_id}") do
                    xml.name store.name
                    xml.address1 store.address1
                    xml.address2 store.address2 unless store.address2.blank?
                    xml.city store.city
                    xml.tag! "postal-code", store.zip
                    xml.tag! "state-code", store.state
                    xml.tag! "country-code", store.country[:code]
                    xml.email store.email unless store.email.blank?
                    xml.phone store.phone unless store.phone.blank?

                    if store.has_coordinates?
                        xml.latitude store.latitude
                        xml.longitude store.longitude
                    end

                    create_store_custom_attributes(xml, store)
                end
            end

            def create_store_custom_attributes(xml, store)
                xml.tag! "custom-attributes" do
                    xml.tag! "custom-attribute", { "attribute-id" => "type" }, store.type[:code]
                    xml.tag! "custom-attribute", { "attribute-id" => "outlet" }, store.outlet?
                    xml.tag! "custom-attribute", { "attribute-id" => "url" }, store.url unless store.url.blank?
                end
            end

         end

    end
end

