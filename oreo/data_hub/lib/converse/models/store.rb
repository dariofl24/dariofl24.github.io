require 'rubygems'
require 'active_record'
require 'digest'
require 'digest/sha1'

require "converse/models/abstract_model"
require "converse/models/store_location"

class Store < AbstractModel
    self.abstract_class = true
    has_one :location, :class_name => "StoreLocation", :foreign_key => "hash_key", :primary_key => "hash_key", :autosave => true, :dependent => :destroy

    TYPE = {
        :US => {
            name: 'USA',
            code: 'US'
        },
        :CA => {
            name: 'Canadian',
            code: 'CA'
        },
        :SKATEBOARDING => {
            name: 'Skateboarding',
            code: 'SKATE'
        }
    }

    COUNTRY = {
        :US => {
            name: 'USA',
            code: 'US'
        },
        :CA => {
            name: 'Canada',
            code: 'CA'
        }
    }

    MAX_GEOCODE_ATTEMPTS = 3

    def type
        raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
    end

    def country
        raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
    end

    def latitude
        location.nil? ? nil : location.latitude
    end

    def longitude
        location.nil? ? nil : location.longitude
    end

    def has_coordinates?
        !latitude.nil? && !longitude.nil?
    end

    def outlet?
        false
    end

    def unique_id
        "#{type[:code]}#{id}"
    end

    def generate_hash_key
        parts = [ name ].concat(get_address_parts)
        Digest::SHA1.hexdigest(parts.join('_'))
    end

    def get_full_address
        get_address_parts.join(', ')
    end

    def get_geocode_address
        parts = get_address_parts

        if last_geocode_attempt? && !address1.blank? && !address2.blank?
            parts.shift # let's try without address1
        end

        parts.join(', ')
    end

    def get_address_parts
        parts = []

        parts.push(address1) unless address1.blank?
        parts.push(address2) unless address2.blank?
        parts.push(city) unless city.blank?
        parts.push(state) unless state.blank?
        parts.push(zip) unless zip.blank?
        parts.push(country[:name])

        parts
    end

    def last_geocode_attempt?
        !location.nil? && location.geocode_attempts == MAX_GEOCODE_ATTEMPTS - 1
    end
end
