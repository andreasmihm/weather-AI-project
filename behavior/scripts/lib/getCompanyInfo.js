'use strict'

const request = require('request')

module.exports = function getCompanyInfo(companyName, next) {

	  var headCount = 100;
	  var revenue = "10 Millionen";
	  var interns = 10;
	  var result = {"headCount": headCount, "interns": interns, revenue":revenue, "companyName": companyName};
      next(result);
}
