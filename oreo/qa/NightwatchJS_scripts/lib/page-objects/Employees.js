/**
 * Created by vesteban on 6/5/15.
 */

var TKUtil = require('../util/TKUtil');
var Employee = require('../model/Employee');
var EmployeeTestData = require('../testdata/EmployeeTestData');
var faker = require('../faker.js/faker.js');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};
    css.email = '#dwfrm_mrtaylorstore_customer_email';
    css.verifyButton = '#verify-btn';

    css.register = {};
    css.register.password = '#dwfrm_mrtaylorstore_login_password';
    css.register.firstName = '#dwfrm_mrtaylorstore_customer_firstname';
    css.register.lastName = '#dwfrm_mrtaylorstore_customer_lastname';

    css.register.dateOfBirth = {};
    css.register.dateOfBirth.month = '#birthday-cell > div > div > div:nth-child(2) > #month';
    css.register.dateOfBirth.day = '#birthday-cell > div > div > div:nth-child(3) > #day';
    css.register.dateOfBirth.year = '#birthday-cell > div > div > div:nth-child(4) > #year';

    css.register.zipCode = '#dwfrm_mrtaylorstore_customer_regional_zip';
    css.register.gender_male = '#gender-cell > span:nth-child(2) > #gender-input-male';
    css.register.gender_female = '#gender-cell > span:nth-child(3) > #gender-input-female';
    css.register.employeeId = '#dwfrm_mrtaylorstore_customer_employeeid';
    css.register.last4DigitsSSN = '#dwfrm_mrtaylorstore_customer_ssn';

    css.register.agreeCustomerTerms = '#dwfrm_mrtaylorstore_customer_terms';
    css.register.continueButton = '#register-employee-form > div.form-row.button-row > div > #register-btn';
    
    var dwUrl = TKUtil.getConverseEmployeeVerifyURL(browser.globals);

    return {
        goToVerifyEmployeePage : function() {
            return browser
                .infoLog('[Employees] - Going to Verify Employee Page')
                .infoLog('[Employees] - URL : ' + dwUrl)
                .url(dwUrl)
                .useCss()
                .waitForElementVisible('body', timeout)
                .maximizeWindow()
                .page.NewEmailAddressPopup().closePopupIfExists();
        },
        submitEmail : function(email) {
            return browser
                .infoLog('[Employees] - Submit e-mail: ' + email)
                .useCss()
                .waitForElementVisible(css.email, timeout)
                .clearValue(css.email)
                .setValue(css.email, email)
                .waitForElementVisible(css.verifyButton, timeout)
                .click(css.verifyButton);
        },
        submitFakeEmail : function() {
            var email = faker.internet.email();
            return browser
                .infoLog('[Employees] - Submit e-mail: ' + email)
                .useCss()
                .waitForElementVisible(css.email, timeout)
                .clearValue(css.email)
                .setValue(css.email, email)
                .waitForElementVisible(css.verifyButton, timeout)
                .click(css.verifyButton);
        },
        registerEmployee : function(employee) {
            return browser
                .infoLog('[Employees] - Register Employee: ' + employee.getFirstName() + ' ' + employee.getLastName())
                .useCss()
                .waitForElementVisible(css.register.password, timeout)
                .clearValue(css.register.password)
                .setValue(css.register.password, employee.getPassword())
                .clearValue(css.register.firstName)
                .setValue(css.register.firstName, employee.getFirstName())
                .clearValue(css.register.lastName)
                .setValue(css.register.lastName, employee.getLastName())
                .waitForElementPresent(css.register.dateOfBirth.month, timeout)
                .setValue(css.register.dateOfBirth.month, 2)
                .waitForElementPresent(css.register.dateOfBirth.day, timeout)
                .setValue(css.register.dateOfBirth.day, 2)
                .waitForElementPresent(css.register.dateOfBirth.year, timeout)
                .setValue(css.register.dateOfBirth.year, 1990)
                .clearValue(css.register.zipCode)
                .setValue(css.register.zipCode, employee.getZipCode())
                .clearValue(css.register.zipCode)
                .setValue(css.register.zipCode, employee.getZipCode())
                .waitForElementPresent(css.register["gender_" + employee.getGender()], timeout)
                .click(css.register["gender_" + employee.getGender()])
                .setValue(css.register.employeeId, employee.getEmployeeID())
                .setValue(css.register.last4DigitsSSN, employee.getSSNLast4Digits())
                .waitForElementPresent(css.register.agreeCustomerTerms, timeout)
                .click(css.register.agreeCustomerTerms)
                .waitForElementPresent(css.register.continueButton, timeout)
                .click(css.register.continueButton);
        },
        tryToRegisterFakeEmployee : function() {
            var fakeEmployee = EmployeeTestData.generateEmployee();

            return browser
                .infoLog('[Employees] - Try to Register Fake Employee')
                .infoLog('Date Of Birth; ' + fakeEmployee.getDateOfBirth())
                .page.Employees().registerEmployee(fakeEmployee);
        }
    };
};
