/**
 * Created by vesteban on 4/30/15.
 */

var Address = require('../model/Address');
var AddressEmea = require('../model/AddressEmea');

var faker = require('../faker.js/faker.js');

var AddressTestData = {

    generateAddress : function() {
        return new Address(faker.address.streetAddress(false),
                            faker.address.secondaryAddress(),
                            faker.address.city(),
                            faker.address.state(),
                            faker.address.zipCode());
    },
    generateAddressEmea : function() {
            return new AddressEmea( faker.address.streetAddress(false),
                                    faker.address.secondaryAddress(),
                                    faker.address.city(),
                                    faker.address.zipCode(),
                                    faker.address.country(),
                                    faker.address.phone());
    },
    getInvalidAddress : function() {
        return new Address('123 Happy Place',
                           '',
                           'San Francisco',
                           'Florida',
                           '03105');
    },
    getInvalidAddressEmea : function() {
            return new AddressEmea('123 Happy Place',
                               '',
                               'Artic',
                               '00000',
                               'Germany',
                               '1395287410');
    },
    getTKSFAddress : function() {
        return new Address('27 Maiden Lane',
                           'Fourth Floor',
                           'San Francisco',
                           'CA',
                           '94108'
        );
    },
    getValidLosAngelesAddress : function() {
        return new Address(
            faker.address.streetAddress(false),
            faker.address.secondaryAddress(),
            'Los Angeles',
            'California',
            '90045'
        );
    },
    getValidMiamiAddress : function() {
        return new Address(
            faker.address.streetAddress(false),
            faker.address.secondaryAddress(),
            'Miami',
            'Florida',
            '33153'
        );
    },
    getValidNewYorkAddress : function() {
        return new Address(
            faker.address.streetAddress(false),
            faker.address.secondaryAddress(),
            'New York',
            'New York',
            '10163'
        );
    },
    getValidRedmondAddress : function() {
        return new Address(
            faker.address.streetAddress(false),
            faker.address.secondaryAddress(),
            'Redmond',
            'Washington',
            '98052'
        );
    },
    getValidUkAddress : function() {
        return new AddressEmea(
            "10 Midford Place",
            "",
            "London",
            "W1T 5AG",
            "United Kingdom",
            "44 (0)207 404 8040");
    },
    getValidGermanyAddress : function() {
        return new AddressEmea(
            "Nordallee 25",
            "",
            "München",
            "85356",
            "Germany",
            "1234567890");
    },
    getValidFranceAddress : function() {
        return new AddressEmea(
            "69125 Colombier-Saugnieu",
            "",
            "Lyon",
            "69125",
            "France",
            "0146708912");
    },
    getValidBelgiumAddress : function() {
        return new AddressEmea(
            "Paul Van der Meerschenlaan 7",
            "",
            "Knokke-Heist",
            "8301",
            "Belgium",
            "770-937-9735");
    },
    getValidSpainAddress : function() {
        return new AddressEmea(
            "Plaza de la Lealtad 5",
            "",
            "Madrid",
            "28014",
            "Spain",
            "+34 913 697 070");
    },
    getValidNetherlandsAddress : function() {
        return new AddressEmea(
            "Evert van de Beekstraat 202",
            "",
            "Schiphol",
            "1118 CP",
            "Netherlands",
            "+31 900 0141");
    },
    getValidItalyAddress : function() {
        return new AddressEmea(
            "Via dell' Aeroporto 320",
            "",
            "Fiumicino",
            "00054",
            "Italy",
            "+39 06 65951");
    },
    getValidInvoiceAddressGermany : function() {
            return new AddressEmea(
                "Koppel 60",
                "",
                "Hamburg",
                "20099",
                "Germany",
                "12345");
        },
    getValidInvoiceAddressGermanyOld : function() {
        return new AddressEmea(
            "Goldstrasse",
            "",
            "Entenhausen",
            "12345",
            "Germany",
            "12345");
    },
    getValidInvoiceAddressNetherlands : function() {
        return new AddressEmea(
            "Van Baerlestraat 22",
            "",
            "Amsterdam",
            "1071 AX",
            "Netherlands",
            "206822299");
    }
};

module.exports = AddressTestData;