/**
 * Created by vesteban on 6/22/15.
 */

module.exports = {
    tags: ['employees'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .page.Employees().goToVerifyEmployeePage();
    },
    'Verifies Employee Register With Invalid Email' : function(browser) {
        browser
            .page.Employees().submitEmail('notAGoodEmail')
            .verify.invalidEmployeeEmail();
    },
    'Try to register a fake Employee' : function(browser) {
        browser
            .page.Employees().submitFakeEmail()
            .page.Employees().tryToRegisterFakeEmployee()
            .verify.employeeNotQualified();
    },
    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    }
};