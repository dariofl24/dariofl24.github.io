/**
 * Created by vesteban on 4/24/15.
 */
var Account = require('../model/Account');
var faker = require('../faker.js/faker.js');

var AccountTestData = {
    getValidAccount : function() {
        return new Account('Carlos',
                            'Tester',
                            'cgomez@tacitknowledge.com',
                            '07/25/1981',
                            '10163',
                            'Male',
                            '3333333333',
                            'tacittacit');
    },
    getValidAccountEmea : function() {
            return new Account('Gaby',
                                'Tester',
                                'gledesma@tacitknowledge.com',
                                '07/25/1981',
                                '10163',
                                'Male',
                                '3333333333',
                                'testy010');
        },
    generateAccount : function(country) {
        faker.locale = country;
        var  newEmail =  'test' + faker.internet.email();
        return new Account(faker.name.firstName(),
                           faker.name.lastName(),
                           newEmail,
                           faker.date.past(30),
                           faker.address.zipCode(),
                           'Male',
                           '3333333333',
                           'Test1234');
    },
    getValidInvoiceAccount : function() {
        return new Account( 'Ralf',
                            'Clasen',
                            'gledesma@tacitknowledge.com',
                            faker.date.past(30),
                            '12345',
                            'Male',
                            '123456789',
                            faker.internet.password());
    }
};

module.exports = AccountTestData;
