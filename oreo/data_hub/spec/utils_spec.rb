require_relative "support/spec_helper"

require 'converse/utils'

include Converse::Utils

describe Converse::Utils do
    context 'Converse Utils functions' do
        it 'should validate One Size size value' do
            result = has_valid_sizes 'One Size'

            result.should eq true
        end

        it 'should validate sneaker sizes value' do
            result = has_valid_sizes '030,  035, 040   '

            result.should eq true
        end

        it 'should validate apparel sizes value' do
            result = has_valid_sizes 'SM,  M,  L '

            result.should eq true
        end

        it 'should validate sneaker sizes value that have been opened in Excel' do
            result = has_valid_sizes '20,030,040,  050,   060,   000  ,000,000,000   '

            result.should eq false
        end

        it 'should return false when nil' do
            result = string_to_boolean nil

            result.should eq false
        end

        it 'should return false when empty' do
            result = string_to_boolean ''

            result.should eq false
        end

        it 'should return false when "n"' do
            result = string_to_boolean 'n'

            result.should eq false
        end

        it 'should return true when "y"' do
            result = string_to_boolean 'y'

            result.should eq true
        end

        it 'should return true when "Y"' do
            result = string_to_boolean "Y"

            result.should eq true
        end
    end
end
