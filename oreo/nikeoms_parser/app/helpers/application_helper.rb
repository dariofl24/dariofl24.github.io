module ApplicationHelper
    DATE_FORMAT = "%m/%d/%Y"
    DATE_TIME_FORMAT = "%m/%d/%Y %H:%M %Z"

    def parse_request orderString
        requestModel = Request.new

        begin
            xmlDoc = Nokogiri::XML(orderString) do |config|
                config.strict.nonet
            end
        rescue Nokogiri::XML::SyntaxError => syntaxError
            return requestModel
        end

        requestModel.request_segment = get_attribute(xmlDoc, "/request", "segment")
        requestModel.package_id = get_attribute(xmlDoc, "/request/package", "id")
        requestModel.carrier_id = get_attribute(xmlDoc, "/request/package", "carrier_id")
        requestModel.ship_group_id = get_content(xmlDoc, "/request/package/ship_group_id")
        requestModel.order_id = get_content(xmlDoc, "/request/package/order_id")
        requestModel.item_old_state = get_content(xmlDoc, "/request/package/changed_item/old_state")
        requestModel.item_new_state = get_content(xmlDoc, "/request/package/changed_item/new_state")
        requestModel.item_ets_date = get_date(xmlDoc, "/request/package/changed_item/ets_date")
        requestModel.item_timestamp = get_date_time(xmlDoc, "/request/package/changed_item/timestamp")
        return requestModel
    end

    def get_attribute( xmlDoc, xpath, attribute_name)
        element = xmlDoc.xpath(xpath).first

        return element.nil? ? nil : get_value_or_nil(element.attr(attribute_name))
    end

    def get_content( xmlDoc, xpath)
        element = xmlDoc.xpath(xpath).first

        return element.nil? ? nil : get_value_or_nil(element.content)
    end

    def get_date(xmlDoc, xpath)
        value = get_content(xmlDoc, xpath)

        return value.nil? ? nil : Date.strptime(value, DATE_FORMAT)
    end

    def get_date_time(xmlDoc, xpath)
        value = get_content(xmlDoc, xpath)

        return value.nil? ? nil : DateTime.strptime(value, DATE_TIME_FORMAT)
    end

    def get_value_or_nil(value)
        return value.nil? || value.empty? ? nil : value;
    end
end
