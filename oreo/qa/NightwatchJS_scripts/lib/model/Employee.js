/**
 * Created by vesteban on 6/5/15.
 */

Account = require('./Account');

Employee = function(firstName, lastName, email, dateOfBirth, zipCode, gender, phone, password, employeeID, SSNLast4Digits) {
    Account.call(this, firstName, lastName, email, dateOfBirth, zipCode, gender, phone, password);

    this.employeeID = employeeID;
    this.SSNLast4Digits = SSNLast4Digits;
};

Employee.prototype = new Account();

Employee.prototype.constructor = Employee;

Employee.prototype.getEmployeeID = function() {
    return this.employeeID;
};

Employee.prototype.getSSNLast4Digits = function() {
    return this.SSNLast4Digits;
};

module.exports = Employee;

