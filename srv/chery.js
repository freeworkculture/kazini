var request = require('request');
var rp = require('request-promise');
var tough = require('tough-cookie');
const cheerio = require('cheerio');


/******************************************************************************************* */
// BUILD THE MPSR_MESSAGE_PACKET
// _csrf_token: WiF7NBsuMiw2MSMxKldwPS45PTcMJgAAivBRjLWtRKkrL2BXkldvOw==
// _utf8: ✓
// data[force]: 1
// data[grantors][0][type]: citizen
// data[grantors][0][actor_category]: grantor
// data[grantors][0][identifier]: 22226787
// data[grantors][0][first_name]: Chris
// data[grantors][0][name]: CHRIS OHABO DANIELS
// data[grantors][0][kra_pin]: A002979826Q
// data[grantors][0][postal_address]: 386
// data[grantors][0][postal_code]: 00517
// data[grantors][0][email]: cohabo@gmail.com
// data[grantors][0][phone_number]:  25472113888
// _csrf_token: WiF7NBsuMiw2MSMxKldwPS45PTcMJgAAivBRjLWtRKkrL2BXkldvOw==
//
// id_number: 22226787
// first_name: CHRIS
// citizenship: citizen
// {"profile": 
// {
// 	"validated":true,
// 	"other_names":"DANIELS",
// 	"last_name":"OHABO",
// 	"id_type":"citizen",
// 	"id_number":"22226787",
// 	"gender":"M",
// 	"first_name":"CHRIS",
// 	"date_of_birth":"1981-12-09"}
// };
//
// _csrf_token: AxkSFwQzICEWOGcJEVBnMAFlMRI6NgAA0N quQEyrB/Jw5UUD0hSyg==
// _utf8: ✓
// data[force]: 1
// data[creditors][0][category_of_secured_creditor]: consensual
// data[creditors][0][type]: citizen
// data[creditors][0][actor_category]: creditor
// data[creditors][0][identifier]: 22226787
// data[creditors][0][first_name]: CHRIS
// data[creditors][0][name]: CHRIS OHABO DANIELS
// data[creditors][0][kra_pin]: A002979826Q
// data[creditors][0][postal_address]: 386
// data[creditors][0][postal_code]: 00517
// data[creditors][0][email]: cohabo@gmail.com
// data[creditors][0][phone_number]:  254721138882
// _csrf_token: AxkSFwQzICEWOGcJEVBnMAFlMRI6NgAA0N quQEyrB/Jw5UUD0hSyg==
//
// _csrf_token: VyMNDDouUAAKACEZByF DSQnaBIRJgAAdt4jKL5XnziZaDLhar1SRw==
// _utf8: ✓
// data[force]: 1
// data[collaterals][0][type]: stock_trade
// data[collaterals][0][description]: Subscriptions and Services
// _csrf_token: VyMNDDouUAAKACEZByF DSQnaBIRJgAAdt4jKL5XnziZaDLhar1SRw==

var MPSR_MESSAGE_PACKET;

var grantorsData = {
	_csrf_token: undefined,
	_utf8: '✓',
	'data[force]': '1',
	'data[grantors][0][actor_category]': 'grantor',
	'data[grantors][0][email]': 'cohabo@gmail.com',
	'data[grantors][0][first_name]': 'Chris',
	'data[grantors][0][identifier]': '22226787',
	'data[grantors][0][kra_pin]': 'A002979826Q',
	'data[grantors][0][name]': undefined,
	'data[grantors][0][phone_number]': '+25472113888',
	'data[grantors][0][postal_address]': '386',
	'data[grantors][0][postal_code]': '00517',
	'data[grantors][0][type]': 'citizen'
};

var creditorsData = {
	_csrf_token: undefined,
	_utf8: '✓',
	'data[creditors][0][actor_category]': 'creditor',
	'data[creditors][0][category_of_secured_creditor]': 'consensual',
	'data[creditors][0][email]': 'cohabo@gmail.com',
	'data[creditors][0][first_name]': 'CHRIS',
	'data[creditors][0][identifier]': '22226787',
	'data[creditors][0][kra_pin]': 'A002979826Q',
	'data[creditors][0][name]': undefined,
	'data[creditors][0][phone_number]': '+254721138882',
	'data[creditors][0][postal_address]': '386',
	'data[creditors][0][postal_code]': '00517',
	'data[creditors][0][type]': 'citizen',
	'data[force]': '1'
};

var collateralsData = {
	_csrf_token: undefined,
	_utf8: '✓',
	'data[collaterals][0][description]': 'Household Items',
	'data[collaterals][0][type]': 'acquired_property',
	'data[force]': '1'
};

var amountData = {
	_csrf_token: undefined,
	_utf8: '✓',
	'data[force]': '1',
	'data[grantor_authorization]': 'true',
	'data[maximum_amount_secured]': '1000000000',
	'data[maximum_amount_secured_currency]': 'KES',
	'data[period_of_effectiveness]': '6'
};

var confirmData = {
	_csrf_token: undefined,
	_utf8: '✓',
	'review[confirm]': 'true'
};

/******************************************************************************************* */
// !!! SETTING UP THE COOKIE MANAGEMENT - DO NOT DELETE
// request.get(url1, function () {
//     var cookie_string = j.getCookieString(url1); // "key1=value1; key2=value2; ..."
//     console.log("IN OUTER REQUEST: " + cookie_string);

//   request.get(url2, function (error, response, body){
//      // this request will will have the cookie which first request received
//      // do stuff
//      var cookies = j.getCookies(url2);
//      console.log("IN INNER REQUEST: " + cookies);
//   });
// });
//
//
// request({url: 'http://www.google.com', jar: j}, function () {
//   var cookie_string = j.getCookieString(url); // "key1=value1; key2=value2; ..."
//   var cookies = j.getCookies(url);
//   // [{key: 'key1', value: 'value1', domain: "www.google.com", ...}, ...]
// })
//****************************************************************************************** */

// Easy creation of the cookie - see tough-cookie docs for details
let _ga = new tough.Cookie({
	key: "_ga",
	value: "GA1.3.1779538580.1542486675",
	domain: 'ecitizen.go.ke',
	httpOnly: false,
	maxAge: 31536000
});

// Easy creation of the cookie - see tough-cookie docs for details
let _gid = new tough.Cookie({
	key: "_gid",
	value: "GA1.3.679846858.1542486675",
	domain: 'ecitizen.go.ke',
	httpOnly: false,
	maxAge: 31536000
});

// Easy creation of the cookie - see tough-cookie docs for details
let _gat = new tough.Cookie({
	key: "_gat",
	value: 1,
	domain: 'ecitizen.go.ke',
	httpOnly: false,
	maxAge: 31536000
});

// Put cookie in an jar which can be used across multiple requests
var Cookie = tough.Cookie;
var cookiejar = request.jar();
var request = request.defaults({ jar: cookiejar });

// ...all requests to https://api.mydomain.com will include the cookie
cookiejar.setCookie(_ga, 'https://ecitizen.go.ke');
cookiejar.setCookie(_gid, 'https://ecitizen.go.ke');
cookiejar.setCookie(_gat, 'https://ecitizen.go.ke');

var landingPage = 'https://accounts.ecitizen.go.ke/login';
var accounts_ecitizen_go_ke = {
	uri: landingPage,
	method: 'GET',
	followAllRedirects: true,
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	headers:
	{
		'Postman-Token': 'b969fef4-c31c-4dba-babd-d3b86d077932',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	},
	json: true // Automatically parses the JSON string in the response
};

var portalPage = 'https://accounts.ecitizen.go.ke/authorize';
var authorisePortal = {
	uri: portalPage,
	method: 'GET',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs: { return_url: 'https://brs.ecitizen.go.ke/auth/sso-authorize' },
	headers:
	{
		'Postman-Token': 'bb894066-ae40-42cc-b9f1-43f8991bb8eb',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	},
	json: false // Automatically parses the JSON string in the response
};

var loginPage = 'https://accounts.ecitizen.go.ke/login';
var loginPortal = {
	uri: loginPage,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	// followAllRedirects: true,
	headers:
	{
		'Postman-Token': 'a9e88b43-cef6-4f52-91b3-a6e239f45fae',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://accounts.ecitizen.go.ke/login',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://accounts.ecitizen.go.ke'
	},
	form:
	{
		_csrf_token: undefined,
		_utf8: '✓',
		'auth[pwd]': 'Nakhumicha:1891',
		'auth[username]': 'cohabo@gmail.com',
		undefined: undefined
	},
	json: false // Automatically parses the JSON string in the response
};

var portalRedirect = 'https://accounts.ecitizen.go.ke/authorize';
var authorisePage = {
	uri: portalRedirect,
	followAllRedirects: true,
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	qs: { return_url: 'https://brs.ecitizen.go.ke/auth/sso-authorize' },
	headers:
	{
		'Postman-Token': '461d2754-e292-403f-a429-5e6c3fe5528c',
		'cache-control': 'no-cache',
		Cookie: '_ga=GA1.3.795740200.1542720705; _gid=GA1.3.232233556.1542720705; _gat=1; _single_signon_key=SFMyNTY.g3QAAAADbQAAAAtfY3NyZl90b2tlbm0AAAAYUUNZZHMzSk9JRHhtSWpSM3o0TzNmdz09bQAAABVhdXRoX2N1cnJlbnRfcmVzb3VyY2V0AAAAF2QACF9fbWV0YV9fdAAAAARkAApfX3N0cnVjdF9fZAAbRWxpeGlyLkVjdG8uU2NoZW1hLk1ldGFkYXRhZAAHY29udGV4dGQAA25pbGQABnNvdXJjZWgCZAADbmlsbQAAAAV1c2Vyc2QABXN0YXRlZAAGbG9hZGVkZAAKX19zdHJ1Y3RfX2QAGEVsaXhpci5TaW5nbGVTaWdub24uVXNlcmQADGFjY291bnRfdHlwZW0AAAAHY2l0aXplbmQABmFjdGl2ZWQABHRydWVkABBidXNpbmVzc19wcm9maWxldAAAAARkAA9fX2NhcmRpbmFsaXR5X19kAANvbmVkAAlfX2ZpZWxkX19kABBidXNpbmVzc19wcm9maWxlZAAJX19vd25lcl9fZAAYRWxpeGlyLlNpbmdsZVNpZ25vbi5Vc2VyZAAKX19zdHJ1Y3RfX2QAIUVsaXhpci5FY3RvLkFzc29jaWF0aW9uLk5vdExvYWRlZGQAC2NpdGl6ZW5zaGlwbQAAAAZLZW55YW5kAApjcmVhdGVkX2F0dAAAAAlkAApfX3N0cnVjdF9fZAAURWxpeGlyLk5haXZlRGF0ZVRpbWVkAAhjYWxlbmRhcmQAE0VsaXhpci5DYWxlbmRhci5JU09kAANkYXlhD2QABGhvdXJhAmQAC21pY3Jvc2Vjb25kaAJhAGEGZAAGbWludXRlYTBkAAVtb250aGEFZAAGc2Vjb25kYQNkAAR5ZWFyYgAAB99kAApkZWxldGVkX2F0ZAADbmlsZAAFZW1haWxtAAAAEGNvaGFib0BnbWFpbC5jb21kAApmaXJzdF9uYW1lbQAAAAVDSFJJU2QABmdlbmRlcm0AAAABTWQAAmlkYgAEGdBkAAlpZF9udW1iZXJtAAAACDIyMjI2Nzg3ZAAIaXNfYWRtaW5kAAVmYWxzZWQACWxhc3RfbmFtZW0AAAAHREFOSUVMU2QADW1vYmlsZV9udW1iZXJtAAAADSsyNTQ3MjExMzg4ODJkAA9tb2JpbGVfdmVyaWZpZWRkAAR0cnVlZAAIcGFzc3dvcmRtAAAAPCQyeSQxMCRVSjZLNzVOa0dwSFVibm5vVlBzYVd1OHByRmMwSmN1YkU2VmdLTU9maUptZVFvNHRDc3VxYWQAB3N1cm5hbWVtAAAABU9IQUJPZAAOdGVybXNfYWNjZXB0ZWRkAAR0cnVlZAAKdXBkYXRlZF9hdHQAAAAJZAAKX19zdHJ1Y3RfX2QAFEVsaXhpci5OYWl2ZURhdGVUaW1lZAAIY2FsZW5kYXJkABNFbGl4aXIuQ2FsZW5kYXIuSVNPZAADZGF5YRJkAARob3VyYQ1kAAttaWNyb3NlY29uZGgCYQBhBmQABm1pbnV0ZWE2ZAAFbW9udGhhB2QABnNlY29uZGEbZAAEeWVhcmIAAAfhZAAMdXNlcl9wcm9maWxldAAAAARkAA9fX2NhcmRpbmFsaXR5X19kAANvbmVkAAlfX2ZpZWxkX19kAAx1c2VyX3Byb2ZpbGVkAAlfX293bmVyX19kABhFbGl4aXIuU2luZ2xlU2lnbm9uLlVzZXJkAApfX3N0cnVjdF9fZAAhRWxpeGlyLkVjdG8uQXNzb2NpYXRpb24uTm90TG9hZGVkZAAIdmVyaWZpZWRkAAR0cnVlbQAAAA9hdXRoX2V4cGlyZXNfYXR0AAAADWQACl9fc3RydWN0X19kAA9FbGl4aXIuRGF0ZVRpbWVkAAhjYWxlbmRhcmQAE0VsaXhpci5DYWxlbmRhci5JU09kAANkYXlhF2QABGhvdXJhD2QAC21pY3Jvc2Vjb25kaAJiAAwGaWEGZAAGbWludXRlYQ9kAAVtb250aGELZAAGc2Vjb25kYSxkAApzdGRfb2Zmc2V0YQBkAAl0aW1lX3pvbmVtAAAADkFmcmljYS9OYWlyb2JpZAAKdXRjX29mZnNldGIAACowZAAEeWVhcmIAAAfiZAAJem9uZV9hYmJybQAAAANFQVQ.5TPziXrQZiX5qICQlvwbgGnnapcjd8SncyscSGAy0D4',//'_ga=GA1.3.1779538580.1542486675; _gid=GA1.3.679846858.1542486675; _gat=1; _single_signon_key=SFMyNTY.g3QAAAADbQAAAAtfY3NyZl90b2tlbm0AAAAYZHZWbmFvOERRd2JLOWVqM2cyVkN1Zz09bQAAABVhdXRoX2N1cnJlbnRfcmVzb3VyY2V0AAAAF2QACF9fbWV0YV9fdAAAAARkAApfX3N0cnVjdF9fZAAbRWxpeGlyLkVjdG8uU2NoZW1hLk1ldGFkYXRhZAAHY29udGV4dGQAA25pbGQABnNvdXJjZWgCZAADbmlsbQAAAAV1c2Vyc2QABXN0YXRlZAAGbG9hZGVkZAAKX19zdHJ1Y3RfX2QAGEVsaXhpci5TaW5nbGVTaWdub24uVXNlcmQADGFjY291bnRfdHlwZW0AAAAHY2l0aXplbmQABmFjdGl2ZWQABHRydWVkABBidXNpbmVzc19wcm9maWxldAAAAARkAA9fX2NhcmRpbmFsaXR5X19kAANvbmVkAAlfX2ZpZWxkX19kABBidXNpbmVzc19wcm9maWxlZAAJX19vd25lcl9fZAAYRWxpeGlyLlNpbmdsZVNpZ25vbi5Vc2VyZAAKX19zdHJ1Y3RfX2QAIUVsaXhpci5FY3RvLkFzc29jaWF0aW9uLk5vdExvYWRlZGQAC2NpdGl6ZW5zaGlwbQAAAAZLZW55YW5kAApjcmVhdGVkX2F0dAAAAAlkAApfX3N0cnVjdF9fZAAURWxpeGlyLk5haXZlRGF0ZVRpbWVkAAhjYWxlbmRhcmQAE0VsaXhpci5DYWxlbmRhci5JU09kAANkYXlhD2QABGhvdXJhAmQAC21pY3Jvc2Vjb25kaAJhAGEGZAAGbWludXRlYTBkAAVtb250aGEFZAAGc2Vjb25kYQNkAAR5ZWFyYgAAB99kAApkZWxldGVkX2F0ZAADbmlsZAAFZW1haWxtAAAAEGNvaGFib0BnbWFpbC5jb21kAApmaXJzdF9uYW1lbQAAAAVDSFJJU2QABmdlbmRlcm0AAAABTWQAAmlkYgAEGdBkAAlpZF9udW1iZXJtAAAACDIyMjI2Nzg3ZAAIaXNfYWRtaW5kAAVmYWxzZWQACWxhc3RfbmFtZW0AAAAHREFOSUVMU2QADW1vYmlsZV9udW1iZXJtAAAADSsyNTQ3MjExMzg4ODJkAA9tb2JpbGVfdmVyaWZpZWRkAAR0cnVlZAAIcGFzc3dvcmRtAAAAPCQyeSQxMCRVSjZLNzVOa0dwSFVibm5vVlBzYVd1OHByRmMwSmN1YkU2VmdLTU9maUptZVFvNHRDc3VxYWQAB3N1cm5hbWVtAAAABU9IQUJPZAAOdGVybXNfYWNjZXB0ZWRkAAR0cnVlZAAKdXBkYXRlZF9hdHQAAAAJZAAKX19zdHJ1Y3RfX2QAFEVsaXhpci5OYWl2ZURhdGVUaW1lZAAIY2FsZW5kYXJkABNFbGl4aXIuQ2FsZW5kYXIuSVNPZAADZGF5YRJkAARob3VyYQ1kAAttaWNyb3NlY29uZGgCYQBhBmQABm1pbnV0ZWE2ZAAFbW9udGhhB2QABnNlY29uZGEbZAAEeWVhcmIAAAfhZAAMdXNlcl9wcm9maWxldAAAAARkAA9fX2NhcmRpbmFsaXR5X19kAANvbmVkAAlfX2ZpZWxkX19kAAx1c2VyX3Byb2ZpbGVkAAlfX293bmVyX19kABhFbGl4aXIuU2luZ2xlU2lnbm9uLlVzZXJkAApfX3N0cnVjdF9fZAAhRWxpeGlyLkVjdG8uQXNzb2NpYXRpb24uTm90TG9hZGVkZAAIdmVyaWZpZWRkAAR0cnVlbQAAAA9hdXRoX2V4cGlyZXNfYXR0AAAADWQACl9fc3RydWN0X19kAA9FbGl4aXIuRGF0ZVRpbWVkAAhjYWxlbmRhcmQAE0VsaXhpci5DYWxlbmRhci5JU09kAANkYXlhFGQABGhvdXJhD2QAC21pY3Jvc2Vjb25kaAJiAAgJK2EGZAAGbWludXRlYSRkAAVtb250aGELZAAGc2Vjb25kYTVkAApzdGRfb2Zmc2V0YQBkAAl0aW1lX3pvbmVtAAAADkFmcmljYS9OYWlyb2JpZAAKdXRjX29mZnNldGIAACowZAAEeWVhcmIAAAfiZAAJem9uZV9hYmJybQAAAANFQVQ.kArg_Ft6JfmG4S2dkVLHxQl3X-NPz4Duwa3H2MwC514',
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://accounts.ecitizen.go.ke/login',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	},
	json: true // Automatically parses the JSON string in the response
};

var pageRedirect = 'https://brs.ecitizen.go.ke/auth/sso-authorize';
var authoriseBRS = {
	uri: pageRedirect,
	method: 'GET',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs: { data: undefined },
	headers:
	{
		'Postman-Token': '03e59007-4924-4743-996f-7b50f1391ed5',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://accounts.ecitizen.go.ke/login',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	}
	,
	json: true // Automatically parses the JSON string in the response
};

var BRSLanding = 'https://brs.ecitizen.go.ke/';
var loginBRS = {
	uri: BRSLanding,
	method: 'GET',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	headers:
	{
		'Postman-Token': '910bdcfa-49df-4b9c-9b59-1385f6656824',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://accounts.ecitizen.go.ke/login',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	},
	json: true // Automatically parses the JSON string in the response
};

var applicationPage = 'https://brs.ecitizen.go.ke/accounts/21810/services/11/make-application';
var makeApplication = {
	uri: applicationPage,
	method: 'GET',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	headers:
	{
		'Postman-Token': '44b2fe2a-214b-407b-a014-994c9662f5f8',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://brs.ecitizen.go.ke/accounts/21810/collaterals',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Upgrade-Insecure-Requests': '1'
	},
	json: true // Automatically parses the JSON string in the response
};

var verifyPage = 'https://brs.ecitizen.go.ke/backend/id-lookup';
let lookup = {
	uri: verifyPage,
	method: 'GET',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs:
	{
		id_number: undefined,
		first_name: undefined,
		citizenship: undefined
	},
	headers:
	{
		'Postman-Token': '391b0e2b-35aa-43aa-a2d9-76ad20282322',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://brs.ecitizen.go.ke/accounts/21810/services/11/new',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'X-Requested-With': 'XMLHttpRequest',
		'X-CSRF-TOKEN': 'AE0SFwBxQ04NBhtcFT8/DAc0Jw12EAAAU8eQQ75wY7A3TfVtLGJG9A==',
		Accept: '*/*'
	},
	json: false // Automatically parses the JSON string in the response
};

var grantorsPage = 'https://brs.ecitizen.go.ke/accounts/21810/services/11/new';
let step1 = {
	uri: grantorsPage,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	headers:
	{
		'Postman-Token': '75ac08f8-5a40-4117-9ffb-a5b8b02c94a7',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: 'https://brs.ecitizen.go.ke/accounts/21810/services/11/new',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryfSjkJehHYAcTAoPd',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://brs.ecitizen.go.ke',
	},
	formData: grantorsData,
	json: true // Automatically parses the JSON string in the response
};

let step2 = {
	uri: undefined,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs: { step: '2' },
	headers:
	{
		'Postman-Token': '105f499a-1489-4944-878b-b2b44c67def5',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: undefined,
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarykYgH04y5wonKdtvB',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://brs.ecitizen.go.ke',
	},
	formData: creditorsData,
	json: true // Automatically parses the JSON string in the response
};

let step3 = {
	uri: undefined,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs: { step: '3' },
	headers:
	{
		'Postman-Token': '71ab78c2-bfff-4e7f-8d5c-519256e2602a',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: undefined,
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryBCidVnbTRrBk50qX',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://brs.ecitizen.go.ke',
	},
	formData: collateralsData,
	json: true // Automatically parses the JSON string in the response
};

var amountPage;
let step4 = {
	uri: amountPage,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	qs: { step: '4' },
	headers:
	{
		'Postman-Token': 'ebfd7bd3-abaa-4058-be73-829af95d113e',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: undefined,
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarymd21Inbw026b5Hbh',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://brs.ecitizen.go.ke',
	},
	formData: amountData,
	json: true // Automatically parses the JSON string in the response
};

let step5 = {
	uri: undefined,
	method: 'POST',
	jar: cookiejar, // Tells rp to include cookies in jar that match uri
	followAllRedirects: true,
	headers:
	{
		'Postman-Token': '3c316c7a-18d4-415b-bc5c-08b2b26603f6',
		'cache-control': 'no-cache',
		Cookie: undefined,
		'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
		'Accept-Encoding': 'gzip, deflate, br',
		Referer: undefined,
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Upgrade-Insecure-Requests': '1',
		Origin: 'https://brs.ecitizen.go.ke'
	},
	formData: confirmData,
	json: true // Automatically parses the JSON string in the response
};

async function lookupId(lookup) {

	console.log('LETS SEE LOOKUP ------------: ', lookup.qs.id_number);
	console.log('LETS SEE LOOKUP ------------: ', lookup.qs.first_name);
	console.log('LETS SEE LOOKUP ------------: ', lookup.qs.citizenship);

	let name;

	let result = await rp(lookup)
		.then(function (data) {
			// decompressed data as it is received
			// console.log('decoded chunk: ' + data)
			const myObj = JSON.parse(data);
			// console.log('MY OBJECT DATA------------: ' + myObj.profile.validated)

			if (myObj.profile.validated != true) {
				console.log("CANNOT VERIFY NAME, ", first_name, " ID NO. ", id_number, " ", citizenship);

				name = false;
			} else {
				var fullName = lookup.qs.first_name + ' ' + myObj.profile.other_names + ' ' + myObj.profile.last_name;
				name = JSON.stringify(fullName);
				// console.log('THIS IS LOOKUP FUNCTION RESULT:-----------------------------------------', fullName);
			}
		})
		.catch(function (err) {
			name = false;
		})
	return name;
}


request.get(accounts_ecitizen_go_ke, function (error, response, body) {
	if (error) console.log('error: ', error);

	//INSPECT RESULT BODY
	// console.log("BODY IN LOGIN PORTAL RESPONSE:----------------------------------------- ", body);

	//INSPECT COOKIE JAR
	var cookie_string = cookiejar.getCookieString(accounts_ecitizen_go_ke.uri); // "key1=value1; key2=value2; ..."
	// console.log("COOKIES IN LANDING PAGE REQUEST: ----------------------------------------------------------", cookie_string);
	// console.log("COOKIE JAR IN LOGIN PORTAL REQUEST: ", cookiejar.getCookies(accounts_ecitizen_go_ke.uri));

	// request.get(authorisePortal, function (error, response, body) {
	// 	if (error) console.log('error: ', error);

	//PARSE TOKEN FROM RESULT BODDY
	var $ = cheerio.load(body);
	loginPortal.form._csrf_token = $('input[name="_csrf_token"]').val();
	// console.log("INSPECT CSRF TOKEN: --------------------------------------------------------", loginPortal.form._csrf_token)

	request.post(loginPortal, function (error, response, body) {
		if (error) console.log('error: ', error);

		//INSPECT RESULT BODY
		// console.log("BODY IN LOGIN PORTAL RESPONSE:----------------------------------------- ", body);

		//INSPECT COOKIE JAR
		var cookie_string = cookiejar.getCookieString(loginPortal.uri); // "key1=value1; key2=value2; ..."
		// console.log("COOKIES IN LOGIN PORTAL REQUEST: ----------------------------------------------------------", cookie_string);
		// console.log("COOKIE JAR IN LOGIN PORTAL REQUEST: *******************************************************", cookiejar.getCookies(loginPortal.uri));

		request.get(authorisePage, function (error, response, body) {
			if (error) console.log('error: ', error);

			//INSPECT RESULT BODY
			// console.log("BODY IN LOGIN PORTAL RESPONSE:----------------------------------------- ", body);

			//INSPECT COOKIE JAR
			var cookie_string = cookiejar.getCookieString(authorisePage.uri); // "key1=value1; key2=value2; ..."
			// console.log("COOKIES IN LOGIN PORTAL REQUEST: ----------------------------------------------------------", cookie_string);
			// console.log("COOKIE JAR IN LOGIN PORTAL REQUEST: *******************************************************", cookiejar.getCookies(authorisePage.uri));

			request.get(loginBRS, function (error, response, body) {
				if (error) console.log('error: ', error);

				//INSPECT COOKIE JAR
				var cookie_string = cookiejar.getCookieString(loginBRS.uri); // "key1=value1; key2=value2; ..."
				// console.log("COOKIES IN LOGIN BRS REQUEST: ----------------------------------------------------------", cookie_string);
				// console.log("COOKIE JAR IN LOGIN BRS REQUEST: *****************************************************", cookiejar.getCookies(loginBRS.uri));

				// })
				// 	.on('response', function (response) {

				request.get(makeApplication, function (error, response, body) {
					if (error) console.log('error: ', error);

					//INSPECT RESULT BODY
					// console.log("BODY IN MAKE APPLICATION RESPONSE:----------------------------------------- ", body);

					// })
					// 	.on('response', function (response) {

					// console.log('WHICH BODY IS--------------///////////////////////', body);

					//INSPECT COOKIE JAR
					let cookie_string = cookiejar.getCookieString(makeApplication.uri); // "key1=value1; key2=value2; ..."
					// console.log("COOKIES IN MAKE APPLICATION REQUEST: ----------------------------------------------------------", cookie_string);
					// console.log("COOKIE JAR IN MAKE APPLICATION REQUEST: *******************************************************", cookiejar.getCookies(makeApplication.uri));
					// step1.headers.Cookie = cookie_string;


					//PARSE TOKEN FROM RESULT BODDY
					var $ = cheerio.load(body);
					// step1.formData['_csrf_token'] = $('div[name="_csrf_token"]').val();
					// $('input[name="_csrf_token"]').val();
					// The .text() method cannot be used on form inputs or scripts. To set or get
					// the text value of input or textarea elements, use the .val() method. To
					// get the value of a script element, use the .html() method.
					//window.CSRF_TOKEN = "HQk6MwUncBYkHhNgfzEzNhFdDh5DJgAAxgVbKMCYlze9FWpdGrxMsA==";
					// <script type="text/javascript">
					// window.CSRF_TOKEN = "HQk6MwUncBYkHhNgfzEzNhFdDh5DJgAAxgVbKMCYlze9FWpdGrxMsA==";
					// </script>
					// GET THE PAGE TOKEN HERE	
					// let tst = $('script').get()[0].children[0].data;
					let _csrf_token = $('script').html();
					step1.formData['_csrf_token'] = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
					// console.log("INSPECT CSRF TOKEN: --------------------------------------------------------", step1.formData['_csrf_token']);

					//VERIFY NAMES AND ID
					lookup.qs.id_number = step1.formData['data[grantors][0][identifier]'];
					lookup.qs.first_name = step1.formData['data[grantors][0][first_name]'];
					lookup.qs.citizenship = step1.formData['data[grantors][0][type]'];

					let fullName = lookupId(lookup);

					fullName.then(function (result) {
						// console.log('FINAL PROCESSED STEP 1 OBJECT: -----------', result) //will log results.
						step1.formData['data[grantors][0][name]'] = result;

						console.log('INSPECT FORM DATA BEFORE STEP 1--------------///////////////////////', step1);


						request.post(step1, function (error, response, body) {
							console.log('error: ', error);

							//INSPECT RESULT BODY
							// console.log("BODY IN AFTER STEP 1 RESPONSE:----------------------------------------- ", body);

							// })
							// {<form accept-charset="UTF-8" action="/accounts/21810/applications/1627159/edit?step=2" class="" enctype="multipart/form-data" method="post">
							// <input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg==">
							// <input name="_utf8" type="hidden" value="✓">
							// <input id="data_force" name="data[force]" type="hidden" value="1">
							// <div id="vue-root" class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">
							// MPSR-AAU6B3D    </h3> <small>COLLATERAL REGISTRY - INITIAL REGISTRATION</small></div> <div class="panel-body"><div class="form-horizontal"><div class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">Particulars Of Creditors</h3></div> <div class="panel-body"><div class="form-group "></div>  <div class="form-group"><input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg=="><button type="button" class="btn btn-primary btn-sm">                        Add Creditor
							//                         <i class="fa fa-plus"></i></button></div></div></div></div></div> <div class="panel-footer clearfix"><div class="pull-right"><a href="/accounts/21810/applications/1627159/edit?step=1" class="btn btn-sm btn-primary"><span class="fa fa-arrow-circle-left"></span> Back
							//       </a> <button class="btn btn-sm btn-success"><span class="fa fa-arrow-circle-right"></span> Save and Continue
							//       </button></div></div></div></form>"};/</input>{}{};
							// 	  body > div.container > div > div.col-sm-10.col-md-10.col-lg-10 > form
							// .on('response', function (response) {

							//INSPECT COOKIE JAR
							var cookie_string = cookiejar.getCookieString(step1.uri); // "key1=value1; key2=value2; ..."
							// console.log("COOKIES IN AFTER STEP 1 REQUEST: ----------------------------------------------------------", cookie_string);
							// console.log("COOKIE JAR AFTER STEP 1 REQUEST: ***********************************************************", cookiejar.getCookies(step1.uri));

							//PARSE TOKEN FROM RESULT BODY
							var $ = cheerio.load(body);
							let _csrf_token = $('script').html();
							step2.formData['_csrf_token'] = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
							let _csrf_tokenALT = $('input[name="_csrf_token"]').val();

							// console.log("LOG STEP2 TOKEN 1 IS: ---------------------:", step2.formData['_csrf_token']);
							// console.log("LOG STEP2 TOKEN VERIFIER IS: ---------------------:", _csrf_tokenALT);

							// PARSE STEP2 URL FROM BODY
							// https://brs.ecitizen.go.ke
							// '/accounts/21810/applications/1640215/edit?step=2'
							step2.headers.Referer = step2.uri = 'https://brs.ecitizen.go.ke' + $('form[method="post"]').attr('action');

							// console.log("LOG STEP2 URL IS: ---------------------:", step2.uri);

							//VERIFY NAMES AND ID
							lookup.qs.id_number = step2.formData['data[creditors][0][identifier]'];
							lookup.qs.first_name = step2.formData['data[creditors][0][first_name]'];
							lookup.qs.citizenship = step2.formData['data[creditors][0][type]'];
							let fullName = lookupId(lookup);

							if (fullName == false)
								console.log("CANNOT VERIFY NAME, ", first_name, " ID NO. ", id_number, " ", fullName);

							fullName.then(function (result) {
								// console.log('FINAL PROCESSED STEP 2 OBJECT: -----------', result) //will log results.
								step2.formData['data[creditors][0][name]'] = result;

								console.log('INSPECT FORM DATA BEFORE STEP 2--------------///////////////////////', step2);


								request.post(step2, function (error, response, body) {
									if (error) console.log('error: ', error);

									//INSPECT RESULT BODY
									console.log("BODY IN AFTER STEP 2 RESPONSE:----------------------------------------- ", body);

									// })
									// {<form accept-charset="UTF-8" action="/accounts/21810/applications/1627159/edit?step=2" class="" enctype="multipart/form-data" method="post">
									// <input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg==">
									// <input name="_utf8" type="hidden" value="✓">
									// <input id="data_force" name="data[force]" type="hidden" value="1">
									// <div id="vue-root" class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">
									// MPSR-AAU6B3D    </h3> <small>COLLATERAL REGISTRY - INITIAL REGISTRATION</small></div> <div class="panel-body"><div class="form-horizontal"><div class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">Particulars Of Creditors</h3></div> <div class="panel-body"><div class="form-group "></div>  <div class="form-group"><input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg=="><button type="button" class="btn btn-primary btn-sm">                        Add Creditor
									//                         <i class="fa fa-plus"></i></button></div></div></div></div></div> <div class="panel-footer clearfix"><div class="pull-right"><a href="/accounts/21810/applications/1627159/edit?step=1" class="btn btn-sm btn-primary"><span class="fa fa-arrow-circle-left"></span> Back
									//       </a> <button class="btn btn-sm btn-success"><span class="fa fa-arrow-circle-right"></span> Save and Continue
									//       </button></div></div></div></form>"};/</input>{}{};
									// 	  body > div.container > div > div.col-sm-10.col-md-10.col-lg-10 > form
									// .on('response', function (response) {

									//INSPECT COOKIE JAR
									var cookie_string = cookiejar.getCookieString(step2.uri); // "key1=value1; key2=value2; ..."
									// console.log("COOKIES IN AFTER STEP 2 REQUEST: ----------------------------------------------------------", cookie_string);
									// console.log("COOKIE JAR AFTER STEP 2 REQUEST: ***********************************************************", cookiejar.getCookies(step2.uri));

									//PARSE TOKEN FROM RESULT BODY
									var $ = cheerio.load(body);
									let _csrf_token = $('script').html();
									step3.formData['_csrf_token'] = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
									let _csrf_tokenALT = $('input[name="_csrf_token"]').val();

									// console.log("LOG STEP3 TOKEN 1 IS: ---------------------:", step3.formData['_csrf_token']);
									// console.log("LOG STEP3 TOKEN VERIFIER IS: ---------------------:", _csrf_tokenALT);

									// PARSE STEP2 URL FROM BODY
									// https://brs.ecitizen.go.ke
									// '/accounts/21810/applications/1640215/edit?step=2'
									step3.headers.Referer = step3.uri = 'https://brs.ecitizen.go.ke' + $('form[method="post"]').attr('action');

									// console.log("LOG STEP3 URL IS: ---------------------:", step3.uri);

									request.post(step3, function (error, response, body) {
										if (error) console.log('error: ', error);

										//INSPECT RESULT BODY
										console.log("BODY IN AFTER STEP 3 RESPONSE:----------------------------------------- ", body);

										// })
										// {<form accept-charset="UTF-8" action="/accounts/21810/applications/1627159/edit?step=2" class="" enctype="multipart/form-data" method="post">
										// <input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg==">
										// <input name="_utf8" type="hidden" value="✓">
										// <input id="data_force" name="data[force]" type="hidden" value="1">
										// <div id="vue-root" class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">
										// MPSR-AAU6B3D    </h3> <small>COLLATERAL REGISTRY - INITIAL REGISTRATION</small></div> <div class="panel-body"><div class="form-horizontal"><div class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">Particulars Of Creditors</h3></div> <div class="panel-body"><div class="form-group "></div>  <div class="form-group"><input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg=="><button type="button" class="btn btn-primary btn-sm">                        Add Creditor
										//                         <i class="fa fa-plus"></i></button></div></div></div></div></div> <div class="panel-footer clearfix"><div class="pull-right"><a href="/accounts/21810/applications/1627159/edit?step=1" class="btn btn-sm btn-primary"><span class="fa fa-arrow-circle-left"></span> Back
										//       </a> <button class="btn btn-sm btn-success"><span class="fa fa-arrow-circle-right"></span> Save and Continue
										//       </button></div></div></div></form>"};/</input>{}{};
										// 	  body > div.container > div > div.col-sm-10.col-md-10.col-lg-10 > form
										// .on('response', function (response) {

										//INSPECT COOKIE JAR
										var cookie_string = cookiejar.getCookieString(step3.uri); // "key1=value1; key2=value2; ..."
										console.log("COOKIES IN AFTER STEP 2 REQUEST: ----------------------------------------------------------", cookie_string);
										console.log("COOKIE JAR AFTER STEP 2 REQUEST: ***********************************************************", cookiejar.getCookies(step3.uri));

										//PARSE TOKEN FROM RESULT BODY
										var $ = cheerio.load(body);
										let _csrf_token = $('script').html();
										step4.formData['_csrf_token'] = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
										let _csrf_tokenALT = $('input[name="_csrf_token"]').val();

										console.log("LOG STEP3 TOKEN 1 IS: ---------------------:", step4.formData['_csrf_token']);
										console.log("LOG STEP3 TOKEN VERIFIER IS: ---------------------:", _csrf_tokenALT);

										// PARSE STEP2 URL FROM BODY
										// https://brs.ecitizen.go.ke
										// '/accounts/21810/applications/1640215/edit?step=2'
										step4.headers.Referer = step4.uri = 'https://brs.ecitizen.go.ke' + $('form[method="post"]').attr('action');

										request.post(step4, function (error, response, body) {
											if (error) console.log('error: ', error);

											//INSPECT RESULT BODY
											console.log("BODY IN AFTER STEP 4 RESPONSE:----------------------------------------- ", body);

											// })
											// {<form accept-charset="UTF-8" action="/accounts/21810/applications/1627159/edit?step=2" class="" enctype="multipart/form-data" method="post">
											// <input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg==">
											// <input name="_utf8" type="hidden" value="✓">
											// <input id="data_force" name="data[force]" type="hidden" value="1">
											// <div id="vue-root" class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">
											// MPSR-AAU6B3D    </h3> <small>COLLATERAL REGISTRY - INITIAL REGISTRATION</small></div> <div class="panel-body"><div class="form-horizontal"><div class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">Particulars Of Creditors</h3></div> <div class="panel-body"><div class="form-group "></div>  <div class="form-group"><input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg=="><button type="button" class="btn btn-primary btn-sm">                        Add Creditor
											//                         <i class="fa fa-plus"></i></button></div></div></div></div></div> <div class="panel-footer clearfix"><div class="pull-right"><a href="/accounts/21810/applications/1627159/edit?step=1" class="btn btn-sm btn-primary"><span class="fa fa-arrow-circle-left"></span> Back
											//       </a> <button class="btn btn-sm btn-success"><span class="fa fa-arrow-circle-right"></span> Save and Continue
											//       </button></div></div></div></form>"};/</input>{}{};
											// 	  body > div.container > div > div.col-sm-10.col-md-10.col-lg-10 > form
											// .on('response', function (response) {

											//INSPECT COOKIE JAR
											var cookie_string = cookiejar.getCookieString(step4.uri); // "key1=value1; key2=value2; ..."
											console.log("COOKIES IN AFTER STEP 4 REQUEST: ----------------------------------------------------------", cookie_string);
											console.log("COOKIE JAR AFTER STEP 4 REQUEST: ***********************************************************", cookiejar.getCookies(step4.uri));

											//PARSE TOKEN FROM RESULT BODY
											var $ = cheerio.load(body);
											let _csrf_token = $('script').html();
											step5.formData['_csrf_token'] = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
											let _csrf_tokenALT = $('input[name="_csrf_token"]').val();

											console.log("LOG STEP5 TOKEN 1 IS: ---------------------:", step5.formData['_csrf_token']);
											console.log("LOG STEP5 TOKEN VERIFIER IS: ---------------------:", _csrf_tokenALT);

											// PARSE STEP2 URL FROM BODY
											// https://brs.ecitizen.go.ke
											// '/accounts/21810/applications/1640215/edit?step=2'
											step5.headers.Referer = step5.uri = 'https://brs.ecitizen.go.ke' + $('form[method="post"]').attr('action');

											request.post(step5, function (error, response, body) {
												if (error) console.log('error: ', error);

												//INSPECT RESULT BODY
												console.log("BODY IN AFTER STEP 5 RESPONSE:----------------------------------------- ", body);

												// })
												// {<form accept-charset="UTF-8" action="/accounts/21810/applications/1627159/edit?step=2" class="" enctype="multipart/form-data" method="post">
												// <input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg==">
												// <input name="_utf8" type="hidden" value="✓">
												// <input id="data_force" name="data[force]" type="hidden" value="1">
												// <div id="vue-root" class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">
												// MPSR-AAU6B3D    </h3> <small>COLLATERAL REGISTRY - INITIAL REGISTRATION</small></div> <div class="panel-body"><div class="form-horizontal"><div class="panel panel-default panel-form"><div class="panel-heading"><h3 class="panel-title">Particulars Of Creditors</h3></div> <div class="panel-body"><div class="form-group "></div>  <div class="form-group"><input name="_csrf_token" type="hidden" value="YgRLJTQhXQ9VFQQ7ECNGVjEibncrNgAAQSrCEC8W1oLxvFt3tw76hg=="><button type="button" class="btn btn-primary btn-sm">                        Add Creditor
												//                         <i class="fa fa-plus"></i></button></div></div></div></div></div> <div class="panel-footer clearfix"><div class="pull-right"><a href="/accounts/21810/applications/1627159/edit?step=1" class="btn btn-sm btn-primary"><span class="fa fa-arrow-circle-left"></span> Back
												//       </a> <button class="btn btn-sm btn-success"><span class="fa fa-arrow-circle-right"></span> Save and Continue
												//       </button></div></div></div></form>"};/</input>{}{};
												// 	  body > div.container > div > div.col-sm-10.col-md-10.col-lg-10 > form
												// .on('response', function (response) {

												//INSPECT COOKIE JAR
												var cookie_string = cookiejar.getCookieString(step5.uri); // "key1=value1; key2=value2; ..."
												console.log("COOKIES IN AFTER STEP 5 REQUEST: ----------------------------------------------------------", cookie_string);
												console.log("COOKIE JAR AFTER STEP 5 REQUEST: ***********************************************************", cookiejar.getCookies(step5.uri));

												//PARSE TOKEN FROM RESULT BODY
												var $ = cheerio.load(body);
												let _csrf_token = $('script').html();
												let review = (_csrf_token.trim()).substring(21, _csrf_token.trim().length - 2);
												let _csrf_tokenALT = $('input[name="_csrf_token"]').val();

												console.log("LOG STEP REVIEW TOKEN 1 IS: ---------------------:", review);
												console.log("LOG STEP 5 TOKEN VERIFIER IS: ---------------------:", _csrf_tokenALT);

												// PARSE STEP2 URL FROM BODY
												// https://brs.ecitizen.go.ke
												// '/accounts/21810/applications/1640215/edit?step=2'
												// step5.headers.Referer = step5.uri = 'https://brs.ecitizen.go.ke' + $('form[method="post"]').attr('action');

											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

