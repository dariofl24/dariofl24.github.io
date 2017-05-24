/**
 * Created by vesteban on 6/5/15.
 */

var Employee = require('../model/Employee');
var faker = require('../faker.js/faker.js');
var TKUtil = require('../util/TKUtil');

var EmployeeTestData = {
    generateEmployee : function() {
        return new Employee(faker.name.firstName(),
            faker.name.lastName(),
            faker.internet.email(),
            faker.date.past(30),
            faker.address.zipCode(),
            TKUtil.getRandomElementInArray(['male', 'female']),
            '3333333333',
            faker.internet.password(),
            TKUtil.randomInt(111111, 999999),
            TKUtil.randomInt(1111, 9999));
    }
};

module.exports = EmployeeTestData;