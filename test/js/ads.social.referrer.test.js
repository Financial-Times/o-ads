/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, undef:true, unused:true, curly:true, browser:true, indent:3, maxerr:50 */
/*xxxglobal
 $, FT, sinon, tests, module, test, deepEqual
*/

/*properties
 CONST, ads, asset, env, initDFP, stub, spyDocumentReferrer,
 */



//set up test spies
FT.env.asset = "page";
FT.test = {};
FT.test.spyDocumentReferrer = sinon.stub(FT.ads, "getDocReferrer");


function tests() {

   module("Social Referrer ", {
   });

   test("test mapReferrerName twitter", function () {
      var mappedName = FT.ads.mapReferrerName('t.co');
      deepEqual(mappedName, "twi", "twitter should be mapped from t.co to twi");

   });

   test("test mapReferrerName facebook", function () {
      var mappedName = FT.ads.mapReferrerName('facebook.com');
      deepEqual(mappedName, "fac", "facebook should be mapped from facebook.com to fac");

   });

   test("test mapReferrerName linkedin", function () {
      var mappedName = FT.ads.mapReferrerName('linkedin.com');
      deepEqual(mappedName, "lin", "linkedin should be mapped from linkedin.com to lin");

   });

   test("test mapReferrerName drudge", function () {
      var mappedName = FT.ads.mapReferrerName('drudgereport.com');
      deepEqual(mappedName, "dru", "drudge should be mapped from drudgereport.com to dru");

   });

   test("test social referrer primary (already logged in)  recognised - twitter", function () {

      FT.test.spyDocumentReferrer.returns("http://t.co/cjPOFshzk2");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "twi", "twitter should be mapped from t.co to twi");

   });


   test("test social referrer primary (already logged in)  recognised - facebook", function () {

      FT.test.spyDocumentReferrer.returns("http://www.facebook.com/l.php?");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "fac", "facebook should be mapped from facebook.com to fac");

   });

   test("test social referrer primary (already logged in)  recognised - linkedin", function () {

      FT.test.spyDocumentReferrer.returns("http://www.linkedin.com/company/4697?trk=NUS-body-company-name");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "lin", "linkedin should be mapped from linkedin.com to lin");

   });


   test("test social referrer primary (already logged in)  recognised - drudge", function () {

      FT.test.spyDocumentReferrer.returns("http://www.drudgereport.com/");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "dru", "drudge should be mapped from drudgereport.com to dru");

   });


   test("test social referrer secondary (via login)  recognised - twitter", function () {

      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/ed72d2ac-cf4e-11e2-be7b-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fed72d2ac-cf4e-11e2-be7b-00144feab7de.html&_i_referer=http%3A%2F%2Ft.co%2F9So3Xw9qFH");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "twi", "twitter should be mapped from t.co to twi");

   });


   test("test social referrer secondary (via login) recognised - facebook", function () {

      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/cece477a-ceca-11e2-8e16-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fcece477a-ceca-11e2-8e16-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.facebook.com%2Fl.php%3Fu%3Dhttp%253A%252F%252Fon.ft.com%252FZSTiyP%26h%3DLAQGl0DzT%26s%3D1");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "fac", "facebook should be mapped from facebook.com to fac");

   });

   test("test social referrer secondary (via login) recognised - linkedin", function () {

      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/af925250-c765-11e2-9c52-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Faf925250-c765-11e2-9c52-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.linkedin.com%2Fcompany%2F4697%3Ftrk%3DNUS-body-company-name");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "lin", "linkedin should be mapped from linkedin.com to lin");

   });

   test("test social referrer secondary (via login) recognised - drudge", function () {

      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/af925250-c765-11e2-9c52-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Faf925250-c765-11e2-9c52-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.drudgereport.com%2F");

      var socialReferrer = FT.ads.getSocialReferrer();
      deepEqual(socialReferrer, "dru", "drudge should be mapped from drudgereport.com to dru");

   });

}


$(tests);