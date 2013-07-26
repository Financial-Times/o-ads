/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, undef:true, unused:true, curly:true, browser:true, indent:3, maxerr:50 */
/*xxxglobal
 $, FT, sinon, tests, module, test, deepEqual
*/

/*properties
 CONST, ads, asset, env, initDFP, stub, spyDocumentReferrer,
 */

FT.ads.initDFP();

//set up test spies
FT.env.asset = "page";
FT.test = {};
FT.test.spyDocumentReferrer = sinon.stub(FT.ads, "getDocReferrer");


function tests() {

   module("Referrer rf ", {
   });

   test("test rf should return correctly for article with query string", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/cece477a-ceca-11e2-8e16-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fcece477a-ceca-11e2-8e16-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.facebook.com%2Fl.php%3Fu%3Dhttp%253A%252F%252Fon.ft.com%252FZSTiyP%26h%3DLAQGl0DzT%26s%3D1");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "cms/s/cece477a-ceca-11e2-8e16-00144feab7deauthorised=falsehtml?_i_location=http%253a%252f%252fwwwftcom%252fcms%252fs%252f0%252fcece477a-ceca-11e2-8e16-00144feab7dehtml&_i_referer=http%253a%252f%252fwwwfacebookcom%252flphp%253fu%253dhttp%25253a%25252f%25252fonftcom%25252fzstiyp%2526h%253dlaqgl0dzt%2526s%253d1", "should return the same");

   });

   test("test rf should return correctly for article without the query string", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/something/here/to/target");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "something/here/to/target", "should return something/here/to/target", "should return the same");

   });

   test("test rf should return correctly for non article", function () {
      FT.env.dfp_targeting = "pt=ind";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/cms/s/cece477a-ceca-11e2-8e16-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fcece477a-ceca-11e2-8e16-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.facebook.com%2Fl.php%3Fu%3Dhttp%253A%252F%252Fon.ft.com%252FZSTiyP%26h%3DLAQGl0DzT%26s%3D1");
      var dfpTargeting = FT.ads.getDFPTargeting();
      deepEqual(dfpTargeting, "pt=ind", "dfpTargeting should be undefined");
      var referrer = (/rf=([^;]*)/).exec(dfpTargeting);
      deepEqual(referrer, null, "dfpTargeting should be undefined");
   });

   test("test rf should return correctly for article with !", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://blogs.ft.com/topics/organisation/Yahoo!_Inc");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "topics/organisation/yahoo_inc", "should return topics/organisation/yahoo_inc");
   });


   test("test rf should return correctly for article with ()", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/topics/people/David_Axelrod_(Political_Consultant)");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "topics/people/david_axelrod_political_consultant", "should return topics/people/david_axelrod_political_consultant");
   });

//   test("test rf should return correctly for article", function () {
//      FT.env.dfp_targeting = ";pt=art";
//      FT.test.spyDocumentReferrer.returns("http://www.ft.com/topics/people/Ant%C3%B3nio_Horta-Os%C3%B3rio");
//      var dfpTargeting = FT.ads.getDFPTargeting();
//
//      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
//      deepEqual(referrer, "topics/people/ant%c3%b3nio_horta-os%c3%b3rio", "should return topics/people/ant%c3%b3nio_horta-os%c3%b3rio");
//   });

   test("test rf should return correctly for existing referrer 1", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/management/dear-lucy");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "management/dear-lucy", "should return management/dear-lucy");
   });

   test("test rf should return correctly for existing referrer 2", function () {
      FT.env.dfp_targeting = ";pt=art";
      FT.test.spyDocumentReferrer.returns("http://www.ft.com/reports/new-demographics");
      var dfpTargeting = FT.ads.getDFPTargeting();

      var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
      deepEqual(referrer, "reports/new-demographics", "should return reports/new-demographics");
   });

    test("test rf should strip out document.referrer hex encoding of special characters (' hex encoded to %27)", function () {
        FT.env.dfp_targeting = ";pt=art";
        FT.test.spyDocumentReferrer.returns("http://www.ft.com/topics/people/Michael_O%27Leary");
        var dfpTargeting = FT.ads.getDFPTargeting();

        var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
        deepEqual(referrer, "topics/people/michael_oleary", "topics/people/michael_oleary");
    });

    test("test rf should strip out document.referrer hex encoding of special characters (\" hex encoded to %22)", function () {
        FT.env.dfp_targeting = ";pt=art";
        FT.test.spyDocumentReferrer.returns("http://www.ft.com/topics/people/Michael_O%22Leary");
        var dfpTargeting = FT.ads.getDFPTargeting();

        var referrer = (/rf=([^;]*)/).exec(dfpTargeting)[1];
        deepEqual(referrer, "topics/people/michael_oleary", "topics/people/michael_oleary");
    });

}
$(tests);