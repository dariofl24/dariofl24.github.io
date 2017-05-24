/**
 * Created by gledesma on 02/16/17.
 */

var PUPTestData = require('../../lib/testdata/PUPTestData');
var PUPEmea = require('../model/PUPEmea');

var PUPTestData = {


    getValidGermanyPUP : function() {
        return new PUPEmea(
            "Gaby",
            "Tester",
            "85356");
    },
    getValidFrancePUP : function() {
        return new PUPEmea(
            "Gaby",
            "Tester",
            "75008");
    },
    getValidNetherlandsPUP : function() {
        return new PUPEmea(
            "Gaby",
            "Tester",
            "1118CP");
    }
};

module.exports = PUPTestData;