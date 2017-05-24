/**
 * Created by vesteban on 4/24/15.
 */

function Account(firstName, lastName, email, dateOfBirth, zipCode, gender, phone, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dateOfBirth = new Date(dateOfBirth);
    this.zipCode = zipCode;
    this.gender = gender;
    this.phone = phone;
    this.password = password;
}

Account.prototype.getFirstName = function() {
    return this.firstName;
};

Account.prototype.getLastName = function() {
    return this.lastName;
};

Account.prototype.getEmail = function() {
    return this.email;
};

Account.prototype.getDateOfBirth = function() {
    return this.dateOfBirth;
};

Account.prototype.getZipCode = function() {
    return this.zipCode;
};

Account.prototype.getPhone = function() {
    return this.phone;
};

Account.prototype.getGender = function() {
    return this.gender;
};

Account.prototype.getPassword = function() {
    return this.password;
};

Account.prototype.equals = function(otherAccount) {
    //var  email =  otherAccount.getEmail() + _test;
    return this.firstName == otherAccount.getFirstName()
           && this.lastName == otherAccount.getLastName()
           && this.email == otherAccount.getEmail()
           && this.email == email
           && this.dateOfBirth == otherAccount.getDateOfBirth()
           && this.zipCode == otherAccount.getZipCode()
           && this.phone == otherAccount.getPhone()
           && this.gender == otherAccount.getGender();
};

module.exports = Account;