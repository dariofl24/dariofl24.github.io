require 'rubygems'
require 'geocoder'

require 'converse/logging'
require 'converse/utils'
require 'converse/models/store'
require 'converse/models/canadian_store'
require 'converse/models/usa_store'
require 'converse/models/store_location'

module Converse
    module Misc

        class StoreGeocoder
            include Converse::Logging
            include Converse::Utils

            STORE_CLASSES = [ USAStore, CanadianStore ]

            attr_accessor :options, :logger

            def initialize(options, logger = nil)
                @options = options
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def run
                @count = 0

                Geocoder.configure(
                    :timeout => 10,
                    :lookup => :google
                )

                geocode_stores(false)
                geocode_stores(true)
            end

            def geocode_stores(failed)
                store_location = StoreLocation.quoted_table_name

                where = failed ?
                    "#{store_location}.latitude IS NULL AND #{store_location}.longitude IS NULL AND #{store_location}.geocode_attempts < #{Store::MAX_GEOCODE_ATTEMPTS}" :
                    "#{store_location}.geocode_attempts IS NULL"

                STORE_CLASSES.each do |clazz|
                    if maximum_reached?
                        return
                    end

                    clazz.includes(:location).where(where).find_each(
                        :batch_size => 500
                    ) do |store|
                        if maximum_reached?
                            break
                        end

                        geocode_store(store)
                    end
                end
            end

            def geocode_store(store)
                coordinates = Geocoder.coordinates(store.get_geocode_address)

                logger.debug "#{store.get_geocode_address} => #{coordinates}"

                save_coordinates(store, coordinates)

                sleep(0.1) # Google limits to 10 requests per second

                @count += 1
            end

            def save_coordinates(store, coordinates)
                latitude = coordinates.nil? ? nil : coordinates[0]
                longitude = coordinates.nil? ? nil : coordinates[1]

                if store.location.nil?
                    store.location = StoreLocation.new({ :hash_key => store.hash_key, :latitude => latitude, :longitude => longitude, :geocode_attempts => 1 })
                else
                    store.location.latitude = latitude
                    store.location.longitude = longitude
                    store.location.geocode_attempts += 1
                end

                store.save
            end

            def maximum_reached?
                @count >= options[:how_many]
            end

         end

    end
end

