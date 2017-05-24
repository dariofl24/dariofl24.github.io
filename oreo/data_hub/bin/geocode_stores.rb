require 'rubygems'
require 'trollop'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/misc/store_geocoder'
require 'data_hub/context'

if __FILE__ == $0
    context = DataHub::Context.new( __FILE__)

    opts = Trollop::options do
        opt :how_many,
            'How many stores to geocode.',
            :type => :integer,
            :required => false,
            :default => 500
    end

    context.execute "Geo coding stores" do |options,logger|
        store_geocoder = Converse::Misc::StoreGeocoder.new(opts, logger)
        store_geocoder.run
    end
end
