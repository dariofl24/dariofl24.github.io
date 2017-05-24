require 'rubygems'
require 'cgi'

module Converse
    module Utils

        DEFAULT_DATETIME_TO_STRING_FORMAT = '%Y-%m-%dT%H:%M:%S.%3N+0000'
        DEFAULT_STRING_TO_SHORT_DATETIME_FORMAT = '%Y-%m-%d'
        DEFAULT_STRING_TO_DATETIME_FORMAT = '%m/%d/%Y %I:%M:%S %p'
        ONE_SIZE = 'One Size'
        ALL_SNEAKER_SIZES = ['010','015','020','025','030','035',
                             '040','045','050','055','060','065',
                             '070','075','080','085','090','095',
                             '100','105','110','115','120','125',
                             '130','135','140','145','150','155',
                             '160','165','170','175','180','185',
                             '240','250','260','270','280','290',
                             '300','310','320','330','340','360',
                             '380','400']
        ALL_APPAREL_SIZES = ['XS','S','SM','M','L','XL','XS-S','S-M','M-L','L-XL','XXL','4','5','6','6X','7',
                             '24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40']

        TAG_PATTERN = %r{(</?.*?>)}

        def safe_downcase(value)
            value.nil? ? value : value.to_s.downcase
        end

        def safe_upcase(value)
            value.nil? ? value : value.to_s.upcase
        end

        def blank_to_nil(value)
            value.blank? ? nil : value
        end

        def blank_to_empty(value)
            value.blank? ? '' : value
        end

        def strip_whitespace(value, replace_with = '')
            value.nil? ? value : value.to_s.gsub(/\s+/, replace_with)
        end

        def strip_new_lines(value, replace_with = ' ')
            value.nil? ? value : value.gsub(/\r/, replace_with).gsub(/\n/, replace_with)
        end

        def ensure_positive_integer(value)
            (value.blank? || Integer(value) < 0) ? 0 : Integer(value)
        end

        def normalize_enum_value(value)
            value.blank? ? value : value.strip.downcase.gsub(/\s+/, "-").gsub(/-+/, '-')
        end

        def first_token(value, delimiter)
            value.blank? ? value : value.split(delimiter).first.strip
        end

        def format_date_time(date, format = DEFAULT_DATETIME_TO_STRING_FORMAT)
            date.nil? ? nil : date.strftime(format)
        end

        def remove_tags(s)
            s.blank? ? s : s.gsub(TAG_PATTERN, '')
        end

        def ellipse(text, length = 30, ellipsis = '...')
            if !text.blank? && text.length > length
                max = length - ellipsis.length - 1
                text.to_s[0..max].gsub(/[^\w]\w+[^\w|\s]*$/, ellipsis)
            else
                text
            end
        end

        def string_to_currency(str)
            str.blank? ? nil : sprintf("%.2f", str)
        end

        def string_to_date_time(str, format=DEFAULT_STRING_TO_DATETIME_FORMAT)
            str.blank? ? nil : DateTime.strptime(str, format)
        end

        def string_to_short_date_time(str, format=DEFAULT_STRING_TO_SHORT_DATETIME_FORMAT)
            str.blank? ? nil : DateTime.strptime(str, format)
        end

        def string_to_boolean(str)
            return safe_downcase(str) == "y"
        end

        def to_url_path(parts)
            parts.map {|e| escape_url_part(e) }.join('/')
        end

        def escape_url_part(part)
            CGI.escape(part)
        end

        def has_valid_sizes(size)
            if size == ONE_SIZE
                return true
            end

            sizes = size.split(',').map { |e| strip_whitespace(e) }
            count = get_size_matches(sizes, ALL_SNEAKER_SIZES)

            if count == sizes.size
                return true
            end

            count = get_size_matches(sizes, ALL_APPAREL_SIZES)

            if count == sizes.size
                return true
            end

            return false
        end

        def get_size_matches(sizes, all_sizes)
            count = 0

            sizes.each do |e|
                if all_sizes.include?(e)
                    count += 1
                end
            end

            return count
        end
    end
end
