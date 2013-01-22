/*jslint white: true, browser: true, undef: true, plusplus: false, onevar: false,
    nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true,
    immed: true, maxerr: 1000, indent: 3
*/

/*globals FT, RegExp, alert, document, escape, window */

/*members "-", AD_CODE_NOT_FOUND, AD_DIV_PREFIXES, AdInfoTable,
    AdPositions, body, FTPage, FTSection, Requests, STYLE, STYLE_LATEST,
    STYLE_LOCAL, URL, URL_ASSETS, URL_DASHBOARD, URL_DFP, URL_ICON,
    URL_IDLINK, URL_LOCAL, URL_LOOKUP, URL_LOOKUP_IST, URL_TWIKI, VERSION, adCodeHTML, adId,
    adName, adType, addAlertOnClick, addDiagnosticsOnClick, addIconLink,
    addOnClick, addRemoveDialogOnClick, addTableCell, ads, advertiserId,
    adverts, appendChild, buildDiagnosticsInfo, buildTable, buildTableBody,
    cell, className, console, cookie, createElement, createModal,
    createTextNode, creativeId, cssText, debug, makeTroubleshootURL, makeInterstitialTroubleshootURL, dfp_site,
    dfp_targeting, dfp_zone, diagnose, diagnostics, display, div, env, flight,
    gatherAdCode, gatherDiagnostics, gatherResponse, getAdCode, getCookie,
    getDebugInfo, getAdContainers, getAdInnerHTML, getDiagnosticsErrors, getElementById,
    getElementsByClassName, getElementsByTagName, getKeys, getLinkInfo, getPx,
    getRequestURL, hasInterstitial, hasOwnProperty, help, href, id, img,
    indexOf, init, injectStylesheet, innerHTML, join, left, legacy, length,
    link, log, match, mode, name, onclick, opera, parentNode, pos, postError,
    prepareAdModel, push, removeChild, removeElement, removeDialog, replace,
    requestURL, requestUrl, response, rtrim, setAttribute, setLink, setValue,
    setVisibility, setXY, showAdDiagnostics, showDialogBox, size, sort, src,
    style, target, targeting, test, text, title, toLowerCase, top, type, url,
    getEmptyAdInfo, interstitial, getAssetIDs, fullHTML, split, decodeURIError
*/

/*

This Ad Diagnostics code is meant to be used by going to an FT.com page or
other site which uses FT's DFP ads implementation (The Banker for example)
and invoking a bookmark in your browser.  The bookmark is a bit of
javascript (shown below) which pulls in this file to the page being
viewed.  You can get the bookmark by visiting the Ad Tools Twiki page and
right clicking on the DFP Diagnostics Tool link to add the bookmark.

Ad Tools Twiki Page: http://epcvs.osb.ft.com/twiki/bin/view/Main/AdsInfoDFP

The clever bit of javascript to bookmark is:

javascript:var%20e=document.createElement('script');
e.setAttribute('language','javascript');
e.setAttribute('src','http://anthill.svc.ft.com/viewvc/repo/online/website/commons/trunk/javascript/ft-advertising/src/main/webapp/media/js/DFPDiagnostics.js?revision=37684');
document.body.appendChild(e);
void(0);

Note the revision=37684 in the URL, this controls the version of the Tool
that the Ad Ops team uses.  When you wish to release a new version of the
tool you have to update the Twiki page with the new revision number and
you have to update the FTDiag.STYLE value below with the revision number
of the Diagnostics.css file if that has changed.

You can change revision=XXX to view=co to get the latest version of these
files and it is useful to have that as a separate bookmark for developers.

FTQA Cookie - can be used to control some aspects of the tool.  Use
http://www.ft.com/FTCOM/JavaScript/FTQA.html to set the FTQA cookie.

FTQA=diagnose=local;      Uses stylesheet and icons from your falcon.ft.com webserver
FTQA=diagnose=latestcss;  Uses latest stylesheet from version repository
FTQA=setxy=150,120;       Change XY position of diagnostics dialog box

*/

var FTDiag =
{
   // Values taken from page metadata
   "dfp_zone":      "Unknown",
   "dfp_site":      "Unknown",
   "dfp_targeting": "",
   "FTSection":     "Unknown",
   "FTPage":        "Unknown",
	"video_pre_roll_ads_server_url": "Unknown",
	"video_pre_roll_ads_allowed": "Unknown",
	"video_pre_roll_ads_api_enabled": "Unknown",
	"video_pre_roll_ads_player_id": "Unknown",

   // Some constants.
   "VERSION":           "Sprint18 $Rev: 64620 $",
   "URL_ASSETS":        "http://admintools.internal.ft.com:86/adstools",
   "STYLE":             "/css/Diagnostics.css",
   "STYLE_LOCAL":       "/css/Diagnostics.css",        // TODO make this work
   "STYLE_LATEST":      "/css/Diagnostics.css",        // TODO Use the latest checked in versino of the style sheet (for developemnt)
   "URL_LOCAL":         "http://admintools.internal.ft.com:86/adstools",
//      "URL_LOCAL":         "http://falcon.ft.com/test",
   "URL_DFP":           "http://dfp.doubleclick.net",
   "URL_IDLINK":        "http://dfp.doubleclick.net/sso?useSso=true&networkid=5887",
   "URL_LOOKUP":        "http://dfp.doubleclick.net/dfp6/Widgets/TroubleshootingToolsWidget/AdInfo.aspx?Tag=[REPLACE]&ShowSummaries=true&ShowAdDetails=false&ShowCreatives=false&PageSize=50&SearchTypeIndex=1",
   "URL_LOOKUP_IST":    "http://dfp.doubleclick.net/DFP6/Widgets/TroubleshootingToolsWidget/AdInfo.aspx?Site=[SITE]&Zone=[ZONE]&AdSizes=[SIZE];&KeyValues=[KEYVALUES];dcopt=1_ist;&AdServerName=[ADSERVER]&ShowSummaries=true&ShowAdDetails=true&ShowCreatives=true&PageSize=50&SearchTypeIndex=2&SearchTypeIndexForAd=0",
   "URL_DASHBOARD":     "http://dfp.doubleclick.net/dfp6/dashboard.aspx",
   "URL_TWIKI":         "http://admintools.internal.ft.com:86/adstools/",
   "AD_DIV_PREFIXES":   ["", "ad-placeholder-", "ad-container-"],
   "AD_CODE_NOT_FOUND": "unable to find",

   // Internal staging area for diagnostics dialog contents.
   "mode":        "none",
   "left":        undefined,
   "top":         undefined,
   "title":       "",
   "URL":         "",
   "AdPositions": [],
   "AdInfoTable": [],

   // Prepare the object by looking at URL, cookies and page variables.
   "init": function ()
   {
      // Set Asset location when running test plans to use your own local copy
      FTDiag.URL_ICON = FTDiag.URL_ASSETS;
      var useLocalAssets = false;
      if (document.URL.indexOf(FTDiag.URL_LOCAL, 0) >= 0)
      {
         useLocalAssets = true;
      }

      // Let the FTQA cookie value override the asset location, if present
      // For testing. visit: http://www.ft.com/FTCOM/JavaScript/FTQA.html
      // FTQA=diagnose=local;      Uses stylesheet and icons from your falcon.ft.com webserver
      // FTQA=diagnose=latestcss;  Uses latest stylesheet from version repository
      // FTQA=setxy=150,120;       Change XY position of diagnostics dialog box
      var cookie = FTDiag.getCookie("FTQA");
      if (cookie)
      {
         var Match = cookie.match(/diagnose=local/);
         if (Match)
         {
            useLocalAssets = true;
         }
         Match = cookie.match(/diagnose=latestcss/);
         if (Match)
         {
            FTDiag.STYLE = FTDiag.STYLE_LATEST;
         }
         Match = cookie.match(/setxy=(\d+),(\d+)/);
         if (Match)
         {
            FTDiag.left = Match[1] + "px";
            FTDiag.top  = Match[2] + "px";
         }
      }

      // Use local stylesheet and icons when running test plans or if cookie
      // says so. This is super-useful for developing and debugging the tool
      if (useLocalAssets)
      {
         FTDiag.URL_ASSETS = FTDiag.URL_LOCAL;
         FTDiag.STYLE = FTDiag.STYLE_LOCAL;
      }

      // Pull Ad Targeting values from the hosting page (IE safe)
      FTDiag.setValue("FTSection", window.FTSection);
      FTDiag.setValue("FTPage", window.FTPage);
      if (typeof FT !== "undefined" && typeof FT.env !== "undefined")
      {
         FTDiag.setValue("dfp_site", FT.env.dfp_site);
         FTDiag.setValue("dfp_zone", FT.env.dfp_zone);
         FTDiag.setValue("dfp_targeting", FT.env.dfp_targeting);
         FTDiag.setValue("dfp_targeting", FT.env.targeting);
         FTDiag.setValue("video_pre_roll_ads_server_url", FT.env.video_pre_roll_ads_server_url);
         FTDiag.setValue("video_pre_roll_ads_allowed", FT.env.video_pre_roll_ads_allowed);
         FTDiag.setValue("video_pre_roll_ads_api_enabled", FT.env.video_pre_roll_ads_api_enabled);
         FTDiag.setValue("video_pre_roll_ads_player_id", FT.env.video_pre_roll_ads_player_id);
      }

      // Delete the modal window div from the page if it already exists.
      FTDiag.removeDialog();
   },

   // Perform the diagnosis
   "diagnose": function ()
   {
      FTDiag.init();
      FTDiag.prepareAdModel();
      FTDiag.showDialogBox();
      if (typeof FTDiag.left !== "undefined")
      {
         FTDiag.setXY(FTDiag.left, FTDiag.top);
      }
   },

   //======================================================================
   // MVC Architecture - View
   //======================================================================

   "showDialogBox": function ()
   {
      FTDiag.log("FTDiag.showDialogBox()");

      // Begin with Title and links to DFP application and Ad Tools Twiki page
      var dialog = "<h3>" + FTDiag.title + "</h3>" +
         "<p><a href=\"" + FTDiag.URL_DFP + "\" target=\"dfp\" title=\"(WORKS IN IE ONLY)\">DFP Home</a> | " +
         "<a href=\"" + FTDiag.URL_DASHBOARD + "\" target=\"DFPDashboard\" title=\"(WORKS IN IE ONLY)\">DFP Dashboard</a> | " +
         "<a href=\"" + FTDiag.URL_TWIKI + "\" title=\"(Go to Ad Tools Twiki Page)\" target=\"_blank\">Ad Tools</a></p>";

      if (FTDiag.mode === "none")
      {
         dialog = dialog + "<p>DFP Targeting information is not present</p>";
      }
      else
      {
         // Add referring URL and DFP targeting values
         dialog = dialog +
            "<ul>" +
            "<li>URL: <strong>" + FTDiag.URL + "</strong></li>" +
            "<li>DFP Site: <strong>" + FTDiag.dfp_site + "</strong></li>" +
            "<li>DFP Zone: <strong>" + FTDiag.dfp_zone + "</strong></li>" +
            "<li>DFP Targeting: <strong>" + FTDiag.dfp_targeting + "</strong></li>";

         // Add legacy DE targeting values if present
         if (FTDiag.FTSection !== "Unknown" || FTDiag.FTPage !== "Unknown")
         {
            dialog = dialog +
               "<li>FT Section: <strong>" + FTDiag.FTSection + "</strong></li>" +
               "<li>FT Page: <strong>" + FTDiag.FTPage + "</strong></li>";
         }

         // Add brightcove info if present
         if (FTDiag.video_pre_roll_ads_server_url !== "Unknown") {
            dialog = dialog +
               "<li>Pre-roll Server URL: <strong>" + FTDiag.video_pre_roll_ads_server_url + "</strong></li>";
         }

         if (FTDiag.video_pre_roll_ads_allowed !== "Unknown") {
            dialog = dialog +
               "<li>Pre-roll Allowed: <strong>" + FTDiag.video_pre_roll_ads_allowed + "</strong></li>";
         }

         if (FTDiag.video_pre_roll_ads_api_enabled !== "Unknown") {
            dialog = dialog +
               "<li>Pre-roll API Enabled: <strong>" + FTDiag.video_pre_roll_ads_api_enabled + "</strong></li>";
         }

         if (FTDiag.video_pre_roll_ads_player_id !== "Unknown") {
            dialog = dialog +
               "<li>Pre-roll Player Id: <strong>" + FTDiag.video_pre_roll_ads_player_id + "</strong></li>";
         }

         dialog = dialog +
            "</ul>" +
            "<p>There are " + FTDiag.AdPositions.length + " ads on this page:" +
            "</p>";
      }

      // Add some debug info to a hidden div
      dialog = dialog + FTDiag.getDebugInfo();

      FTDiag.injectStylesheet();
      FTDiag.createModal(dialog);
      FTDiag.buildTable();
      FTDiag.buildDiagnosticsInfo();
   },

   // Inject the style sheet into the page
   "injectStylesheet": function ()
   {
      var rStyle = document.createElement("link");
      rStyle.setAttribute("rel", "stylesheet");
      rStyle.setAttribute("type", "text/css");
      var cssURL = FTDiag.URL_ASSETS + FTDiag.STYLE;
      rStyle.setAttribute("href", cssURL);
      document.getElementsByTagName("head")[0].appendChild(rStyle);
   },

   // Inject the Modal dialog window on the page with a background overlay and close button
   "createModal": function (contents)
   {
      var rOverlay = document.createElement("div");
      rOverlay.id = "diagnostic-modal-overlay-id";
      rOverlay.className = "diagnostic-modal-overlay";
      FTDiag.addRemoveDialogOnClick(rOverlay, "remove");

      var rDialog = document.createElement("div");
      rDialog.id = "diagnostic-modal-id";
      rDialog.className = "diagnostic-modal-window";

      var rCloseButton = document.createElement("a");
      rCloseButton.className = "diagnostic-close-window";
      FTDiag.addRemoveDialogOnClick(rCloseButton, "close");

      rDialog.innerHTML = contents;
      rDialog.appendChild(rCloseButton);

      document.body.appendChild(rOverlay);
      document.body.appendChild(rDialog);
   },

   // Build the Ad position Table HTML from thd diagnostics table
   "buildTable": function ()
   {
      var TableHeadings = ["#", "Position", "Information", "Size", "Further Info"];
      var rDialog = document.getElementById("diagnostic-modal-id");
      var rTable;

      if (FTDiag.AdInfoTable.length > 0)
      {
         rTable = document.createElement("table");
         rTable.id = "diagnostic-table";
         var rTHead = document.createElement("thead");
         var rTR = document.createElement("tr");
         for (var head = 0; head < TableHeadings.length; head++)
         {
            var rTH   = document.createElement("th");
            rTH.className = "diagnostic-column-" + head;
            var rText = document.createTextNode(TableHeadings[head]);
            rTH.appendChild(rText);
            rTR.appendChild(rTH);
         }
         rTHead.appendChild(rTR);
         rTable.appendChild(rTHead);

         var rBody = document.createElement("tbody");
         FTDiag.buildTableBody(rBody);

         // appends <tbody> into <table>
         rTable.appendChild(rBody);
         // appends <table> into <modal div>
         rDialog.appendChild(rTable);
         // sets the border attribute of rTable to 2;
         rTable.setAttribute("border", "2");
      }
   },

   // Build the body of the table row by row.
   "buildTableBody": function (rTable)
   {
      for (var row = 0; row < FTDiag.AdInfoTable.length; row++)
      {
         var Cells = [];
         var rRow = document.createElement("tr");

         var rLinkInfo = FTDiag.getLinkInfo(row, "debug", row + 1);
         Cells.push(FTDiag.addTableCell(rLinkInfo));

         rLinkInfo = FTDiag.getLinkInfo(row, "position", FTDiag.AdInfoTable[row].pos);
         Cells.push(FTDiag.addTableCell(rLinkInfo));

         rLinkInfo = FTDiag.getLinkInfo(row, "information", FTDiag.AdInfoTable[row].name);
         Cells.push(FTDiag.addTableCell(rLinkInfo));

         rLinkInfo = FTDiag.getLinkInfo(row, "size", FTDiag.AdInfoTable[row].size);
         Cells.push(FTDiag.addTableCell(rLinkInfo));

         var rCell5 = document.createElement("td");
         Cells.push(rCell5);

         var idx;
         var Links = ["adcode", "position", "editcreative", "editad"];
         for (idx = 0; idx < Links.length; ++idx)
         {
            rLinkInfo = FTDiag.getLinkInfo(row, Links[idx]);
            FTDiag.addIconLink(rCell5, rLinkInfo);
         }

         // Add all the cells to the row in one go so we don't see the
         // icons being added one at a time.
         for (idx = 0; idx < Cells.length; ++idx)
         {
            rRow.appendChild(Cells[idx]);
         }
         rTable.appendChild(rRow);
      }
   },

   // Build the diagnostics info divs below the dialog, all of which are hidden
   // until you click on an ad position number
   "buildDiagnosticsInfo": function ()
   {
      var rDialog = document.getElementById("diagnostic-modal-id");
      for (var idx = 0; idx < FTDiag.AdInfoTable.length; idx++)
      {
         var rItem = FTDiag.AdInfoTable[idx];
         var Diagnostics = [];
         if (rItem.decodeURIError)
         {
            Diagnostics.push("<li>Diag decodeURIError: <strong>" + rItem.decodeURIError + "</strong></li>\n");
         }
         for (var loop = 0; loop < rItem.diagnostics.length; ++loop)
         {
            Diagnostics.push("<li>" + rItem.diagnostics[loop][0] + ": <strong>" + rItem.diagnostics[loop][1] + "</strong></li>\n");
         }
         var diagnostics = Diagnostics.join("");
         if (diagnostics === "")
         {
            diagnostics = "[nothing]";
         }

         var rDiv = document.createElement("div");
         rDiv.id = "diagnostics-" + idx;
         rDiv.className = "diagnostics";
         rDiv.setAttribute("style", "display:none");
         rDiv.style.cssText = "display:none"; // for IE
         var completeInfo = "<strong>Diagnostics Dump for " + rItem.pos + ":</strong> \n<ul>" + diagnostics + "</ul>\n";
         rDiv.innerHTML = completeInfo;
         rDialog.appendChild(rDiv);
      }
   },

   // Add a table cell to the table given the text, help text, url and target window.
   "addTableCell": function (rLinkInfo)
   {
      var rCell = document.createElement("td");
      var rLink = document.createElement("a");
      FTDiag.setLink(rLink, rLinkInfo.url, rLinkInfo.help, rLinkInfo.target);
      rLinkInfo.addOnClick(rLink);

      var rText = document.createTextNode(rLinkInfo.text);
      rLink.appendChild(rText);
      rCell.appendChild(rLink);
      rLinkInfo.cell = rCell;
      rLinkInfo.link = rLink;
      return rCell;
   },

   // Create an Icon link for the given action
   "addIconLink": function (rCell, rLinkInfo)
   {
      var rLink;
      if (rLinkInfo.img)
      {
         rLink = document.createElement("a");
         FTDiag.setLink(rLink, rLinkInfo.url, rLinkInfo.help, rLinkInfo.target);
         rLinkInfo.addOnClick(rLink);
         var rImg = document.createElement("img");
         rImg.src = FTDiag.URL_ICON + rLinkInfo.img;
         rLink.appendChild(rImg);
         rLinkInfo.link = rLink;
         rCell.appendChild(rLink);
      }
      return rLink;
   },

   //======================================================================
   // MVC Architecture - Control
   //======================================================================

   // Get all parameters needed to create an a href link activity .
   // This is used to create both text links and icon links in the interface.
   "getLinkInfo": function (row, type, text)
   {
      // Default is to assume we show debugging info
      var LinkInfo = {
         "type":       "debug",
         "text":       text,
         "url":        "diagnostics-" + row,
         "help":       "Show Debugging",
         "target":     "none",
         "img":        undefined,
         "addOnClick": function (rLink) {
            FTDiag.addDiagnosticsOnClick(rLink, LinkInfo.url, LinkInfo.url);
         }
      };

      if (type === "position" && !FTDiag.AdInfoTable[row].legacy && FTDiag.AdInfoTable[row].size !== "n/a")
      {
         // Create troubleshooting link for non-DE ads
         // If request url no good? cannot troubleshoot so we fall back on
         // showing the diagnostics info for that position.
         LinkInfo.type       = type;
         LinkInfo.url        = FTDiag.makeTroubleshootURL(FTDiag.AdInfoTable[row].requestURL);
         LinkInfo.help       = "Troubleshoot this ad position";
         LinkInfo.target     = "DFPDashboard";
         LinkInfo.img        = "/img/t.png";
         LinkInfo.addOnClick = function () {};
      }
      if (type === "position" && FTDiag.AdInfoTable[row].adType === "interstitial")
      {
         // Create interstitial troubleshooting link for non-DE ads
         LinkInfo.type       = type;
         LinkInfo.url        = FTDiag.makeInterstitialTroubleshootURL(FTDiag.AdInfoTable[row].requestURL);
         LinkInfo.help       = "Troubleshoot interstitial ads in this position";
         LinkInfo.target     = "DFPDashboard";
         LinkInfo.img        = "/img/t.png";
         LinkInfo.addOnClick = function () {};
      }
      else if (type === "information")
      {
         // Information column, have to determine if we should show the
         // Ad Code HTML, Troubleshooting, or a Specific Ad Id
         if (FTDiag.AdInfoTable[row].adId !== 0)
         {
            LinkInfo = FTDiag.getLinkInfo(row, "editad", text);
         }
         else
         {
            LinkInfo = FTDiag.getLinkInfo(row, "adcode", text);
         }
      }
      else if (type === "size")
      {
         // Size column, have to determine if we should show the
         // Ad Code HTML, Troubleshooting, or a Specific Creative Id
         if (FTDiag.AdInfoTable[row].creativeId !== 0)
         {
            LinkInfo = FTDiag.getLinkInfo(row, "editcreative", text);
         }
         else
         {
            LinkInfo = FTDiag.getLinkInfo(row, "position", text);
         }
      }
      else if (type === "editad" && FTDiag.AdInfoTable[row].adId !== 0)
      {
         // Create link to edit an ad
         LinkInfo.type       = type;
         LinkInfo.url        = FTDiag.URL_IDLINK + "&adid=" + FTDiag.AdInfoTable[row].adId;
         LinkInfo.help       = "Show ad " + FTDiag.AdInfoTable[row].adId + " in DFP";
         LinkInfo.target     = "dfp";
         LinkInfo.img        = "/img/i.png";
         LinkInfo.addOnClick = function () {};
      }
      else if (type === "editcreative" && FTDiag.AdInfoTable[row].creativeId !== 0)
      {
         // Create link to edit an ad creative
         LinkInfo.type       = type;
         LinkInfo.url        = FTDiag.URL_IDLINK + "&creativeid=" + FTDiag.AdInfoTable[row].creativeId;
         LinkInfo.help       = "Show creative " + FTDiag.AdInfoTable[row].creativeId + " in DFP";
         LinkInfo.target     = "dfp";
         LinkInfo.img        = "/img/c.png";
         LinkInfo.addOnClick = function () {};
      }
      else if (type === "adcode")
      {
         // Create link to show the Ad HTML code
         LinkInfo.type       = type;
         LinkInfo.url        = "alert";
         LinkInfo.help       = "Show ad HTML";
         LinkInfo.target     = "";
         LinkInfo.img        = "/img/h.png";
         if (text && text.match(/^Unknown/))
         {
            LinkInfo.text = "[simple image or identity <span> missing from ad]";
            if (text.match(/\[ \+ interstitial\]/))
            {
               LinkInfo.text = LinkInfo.text + " [ + interstitial]";
            }
         }
         var pos = FTDiag.AdInfoTable[row].pos;
         var adCodeHTML = FTDiag.AdInfoTable[row].adCodeHTML;
         if (adCodeHTML === FTDiag.AD_CODE_NOT_FOUND)
         {
            adCodeHTML = "\nUnable to find Ad Code div with id: " + pos;
         }
         adCodeHTML = "Ad Code for position: " + pos + "\n" + adCodeHTML;
         LinkInfo.addOnClick = function (rLink) {
            FTDiag.addAlertOnClick(rLink, adCodeHTML, LinkInfo.url);
         };
      }
      return LinkInfo;
   },

   // Set an Anchor element url, target window and help text.
   "setLink": function (rElement, url, help, target)
   {
      rElement.href = url;
      rElement.target = target;
      rElement.setAttribute("title", help);
//      rElement.setAttribute("title", help + "(" + target + ")");
   },

   // Add an onclick() method to an element which will show the ad HTML code in an alert
   "addAlertOnClick": function (rElement, message, name)
   {
      rElement.href = "#" + name;
      rElement.onclick = function ()
      {
         alert(message);
         return false;
      };
   },

   // Add an onclick() method to an element which will show the ad diagnostics output
   "addDiagnosticsOnClick": function (rElement, href, name)
   {

      rElement.href = "#" + name;
      rElement.onclick = function ()
      {
         FTDiag.showAdDiagnostics(href);
         return false;
      };
   },

   // Add an onclick() method to an element which will remove the diagnostics window
   "addRemoveDialogOnClick": function (rElement, name)
   {
      rElement.href = "#" + name;
      rElement.onclick = function ()
      {
         FTDiag.removeDialog();
         return false;
      };
   },

   // Remove the Dialog from the document
   "removeDialog": function ()
   {
      FTDiag.removeElement("diagnostic-modal-id");
      FTDiag.removeElement("diagnostic-modal-overlay-id");
   },

   // Show only one ad diagnostics DIV, hiding all the others
   "showAdDiagnostics": function (idDiv)
   {
      var diagnosticsDivs = FTDiag.getElementsByClassName("diagnostics");
      for (var idx = 0; idx < diagnosticsDivs.length; ++idx)
      {
         FTDiag.setVisibility(diagnosticsDivs[idx].id, "none");
      }
      // Toggle visibility on the id specified
      FTDiag.setVisibility(idDiv);
   },

   // Set the visibility of a DIV. Either specifically, or toggle the current visibility
   "setVisibility": function (id, visibility)
   {
      var rDiv = document.getElementById(id);
      if (rDiv)
      {
         if (typeof visibility === "undefined")
         {
            // No visibility specified, we toggle the current visibility
            rDiv.style.display = (rDiv.style.display === "none") ? "block": "none";
         }
         else
         {
            // Specific visibility given, use it
            rDiv.style.display = visibility;
         }
      }
   },

   // Make a DFP Dashboard Troubleshooting URL to lookup a specific ad position
   "makeTroubleshootURL": function (requestURL)
   {
      var url = FTDiag.URL_LOOKUP;
      url = url.replace(/\[REPLACE\]/, escape(requestURL));
      return url;
   },

   // Make a DFP Dashboard Troubleshooting URL to lookup only interstitial ads in a specific ad position
   "makeInterstitialTroubleshootURL": function (requestURL)
   {
      // We need to parse out portions of the request URL for substitution into
      // the troubleshooting ad call for interstitial ads.
      var url;
      requestURL = requestURL.replace(/;tile=\d+/, "");
      requestURL = requestURL.replace(/;ord=.*$/, "");
      requestURL = requestURL.replace(/;dcopt=ist/, "");
      var reMatch = new RegExp("http://(ad.*\\.doubleclick\\.net)/[^/]+/([^/]+)/([^;]+);sz=([^;]+);([^?]+)");
      var Match = requestURL.match(reMatch);
      if (Match)
      {
         var adServer  = Match[1];
         var site      = Match[2];
         var zone      = Match[3];
         var size      = Match[4];
         var keyValues = Match[5];
         url = FTDiag.URL_LOOKUP_IST;
         url = url.replace(/\[SITE\]/, site);
         url = url.replace(/\[ZONE\]/, zone);
         url = url.replace(/\[SIZE\]/, size);
         url = url.replace(/\[KEYVALUES\]/, keyValues);
         url = url.replace(/\[ADSERVER\]/, adServer);
      }

      return url;
   },

   // Remove an element from the document, given the element ID
   "removeElement": function (id)
   {
      var rDiv = document.getElementById(id);
      if (rDiv)
      {
         rDiv.parentNode.removeChild(rDiv);
      }
   },

   // Get all elements in the document with a specific class name.
   "getElementsByClassName": function (classname, node)
   {
      if (!node)
      {
         node = document.body;
      }
      var Elements = [];
      var re = new RegExp("\\b" + classname + "\\b");
      var els = node.getElementsByTagName("*");
      var length = els.length;
      for (var idx = 0; idx < length; idx++)
      {
         if (re.test(els[idx].className))
         {
            Elements.push(els[idx]);
         }
      }
      return Elements;
   },

   // Set the position of the dialog after it is inserted
   // javascript:FTDiag.setXY(150,150) - useful from your browser
   "setXY": function (xPos, yPos)
   {
      var rDialog = document.getElementById("diagnostic-modal-id");
      if (rDialog)
      {
         FTDiag.left = FTDiag.getPx(xPos);
         FTDiag.top  = FTDiag.getPx(yPos);
         rDialog.style.left = FTDiag.left;
         rDialog.style.top  = FTDiag.top;
      }
   },

   // Convert number to pixel values
   "getPx": function (value)
   {
      if (typeof value === "undefined")
      {
         value = 0;
      }
      if (typeof value === "number")
      {
         value = value + "px";
      }
      return value;
   },

   //======================================================================
   // MVC Architecture - Model
   //======================================================================

   // Accessor Method to get the Ad HTML code for a named ad position
   "getAdCode": function (pos)
   {
      for (var idx = 0; idx < FTDiag.AdInfoTable.length; ++idx)
      {
         if (FTDiag.AdInfoTable[idx].pos === pos)
         {
            return FTDiag.AdInfoTable[idx].adCodeHTML;
         }
      }
      return "";
   },

   // Accessor Method to get the request URL for a named ad position
   "getRequestURL": function (pos)
   {
      for (var idx = 0; idx < FTDiag.AdInfoTable.length; ++idx)
      {
         if (FTDiag.AdInfoTable[idx].pos === pos)
         {
            return FTDiag.AdInfoTable[idx].requestURL;
         }
      }
      return "ERRORURL";
   },

   "getEmptyAdInfo": function (pos)
   {
      var AdInfo =
      {
         "legacy":       false,
         "pos":          pos,
         "name":         "Unknown",
         "advertiserId": 0,
         "adId":         0,
         "creativeId":   0,
         "adType":       "Unknown",
         "hasInterstitial": false,
         "requestURL":   "",
         "size":         "n/a",
         "adCodeHTML":   FTDiag.AD_CODE_NOT_FOUND,
         "diagnostics":  [],
         "-": "-"
      };
      return AdInfo;
   },

   // Prepare all Ad information in a structure which the view will display from.
   "prepareAdModel": function ()
   {
      // First the stuff that is easy to work out
      FTDiag.mode  = "none";
      FTDiag.title = "FT Ad Diagnosis";
      FTDiag.URL   = FTDiag.rtrim(document.URL, "#");
      FTDiag.AdPositions = [];

      // Then a quick check of what diagnostics mode we are working in
      // Which tells us where to look for ad call information
      var Requests = {};
      if (typeof FT !== "undefined" && FT.env)
      {
         if (FT.env.Requests)
         {
            FTDiag.mode  = "lite";
            FTDiag.title = "FT Lite Ad Diagnosis";
            Requests = FT.env.Requests;
         }
         else if (FT.ads && FT.ads.adverts)
         {
            FTDiag.mode  = "falcon";
            FTDiag.title = "FT Falcon Ad Diagnosis";
            Requests = FT.ads.adverts;
         }
         else if (FTDiag.FTSection !== "Unknown" || FTDiag.FTPage !== "Unknown" || FTDiag.dfp_site !== "Unknown" || FTDiag.dfp_zone !== "Unknown")
         {
            FTDiag.mode  = "info";
            FTDiag.title = "FT Ad Metadata Diagnosis";
         }
      }

      // Now we loop through Ad position names gathering information about each ad call.
      // We can examine the diagnostics, response or the HTML in the ad position itself
      // to find out this information.
      var rInterstitial;
      for (var pos in Requests)
      {
         if (Requests.hasOwnProperty(pos))
         {
            var AdInfo = FTDiag.getEmptyAdInfo(pos);
            FTDiag.AdInfoTable.push(AdInfo);
            FTDiag.AdPositions.push(pos);
            FTDiag.gatherAdCode(pos, AdInfo);

            if (typeof Requests[pos] === "object")
            {
               if (Requests[pos].response)
               {
                  // Falcon Library JSON object response is present, use the data
                  AdInfo.adId =       Requests[pos].response.flight;
                  AdInfo.creativeId = Requests[pos].response.adId;
                  AdInfo.name =       Requests[pos].response.adName;
                  AdInfo.adType =     Requests[pos].response.type;
                  FTDiag.gatherResponse(Requests[pos].response, AdInfo);
               }
               if (AdInfo.name === "Unknown" && AdInfo.adId !== 0)
               {
                  AdInfo.name = "Ad ID: " + AdInfo.adId;
               }
               if (Requests[pos].diagnostics)
               {
                  FTDiag.gatherDiagnostics(Requests[pos].diagnostics, AdInfo);
                  if (AdInfo.name === "Unknown")
                  {
                     // Falcon Library diagnostics object is present, get any relevant error messages
                     // and use them as the ad name.
                     AdInfo.name = FTDiag.getDiagnosticsErrors(Requests[pos].diagnostics);
                  }
                  if (Requests[pos].diagnostics.requestUrl)
                  {
                     AdInfo.requestURL = Requests[pos].diagnostics.requestUrl;
                  }
                  else
                  {
                     AdInfo.adType = "invalid";
                  }
               }
            }
            else
            {
               // Lite mode, the request URL is the only thing in the ad position.
               AdInfo.requestURL = Requests[pos];
               if (typeof AdInfo.requestURL === "undefined")
               {
                  AdInfo.requestURL = "";
                  AdInfo.adType = "invalid";
               }
               else
               {
                  AdInfo.diagnostics.push(["requestUrl", AdInfo.requestURL]);
               }
            }

            if (AdInfo.requestURL.match(/ads\.ft\.com/))
            {
               // It is a legacy DE ad request!
               AdInfo.legacy = true;
               if (AdInfo.name === "Unknown")
               {
                  AdInfo.name = "[legacy DE ad call]";
               }
               else
               {
                  AdInfo.name =  "legacy DE ad call: " + AdInfo.name;
               }
            }
            else
            {
               // Get the ad sizes from the DFP request url
               var Match = AdInfo.requestURL.match(/;sz=([0-9x,]+)/);
               if (Match && Match.length > 1)
               {
                  AdInfo.size = Match[1].replace((/,/g), ", ");
               }
            }
            if (AdInfo.adType === "system default")
            {
               AdInfo.name = "[DFP system default]";
            }
            if (AdInfo.adType === "invalid")
            {
               if (AdInfo.name === "Unknown")
               {
                  AdInfo.name = AdInfo.adType;
               }
               else
               {
                  AdInfo.name = AdInfo.adType + ": " + AdInfo.name;
               }
            }
            if (AdInfo.adType === "empty")
            {
               AdInfo.name = AdInfo.adType + ": " + AdInfo.name;
            }
            if (AdInfo.name === "Unknown" && AdInfo.adId !== 0)
            {
               AdInfo.name = "Ad ID: " + AdInfo.adId;
            }
            if (AdInfo.hasInterstitial)
            {
               rInterstitial = AdInfo.interstitial;
               AdInfo.name = AdInfo.name + " [ + interstitial]";
               rInterstitial.requestURL = AdInfo.requestURL;
            }
         } // if
      } // for

      // If there is an interstitial present, create a final row with it
      if (rInterstitial)
      {
         FTDiag.AdInfoTable.push(rInterstitial);
         FTDiag.AdPositions.push(rInterstitial.pos);
      }
   }, // prepareAdModel()

   "getAssetIDs": function (html, Info)
   {
      // Try and find ID values which might look like these:
      // <!-- ad ID: 220435672  creative ID: 34653048 -->
      // <span class="dfp-ad-details" style="display:none">AdvId: 234124345 AdId: 220435672 CrId: 34653048</span>
      var Match = html.match(/Adv\s*Id:\s*(\d+)/i);
      if (Match && Match.length === 2)
      {
         Info.advertiserId = Match[1];
      }
      Match = html.match(/Ad\s*Id:\s*(\d+)/i);
      if (Match && Match.length === 2)
      {
         Info.adId = Match[1];
      }
      else
      {
         // This method is frowned upon but if it works, we'll use it until it doesn't.
         // Every little helps...
         // <img src="http://s0.2mdn.net/viewad/2389285/banlb-728x90.GIF" alt="Markets" border="0">
         var re = new RegExp("/viewad/(\\d+)/");
         try
         {
            // Handle CSS style width=23%; which is quite common
            html = html.replace(/%;/g, '%25%3B');
            html = decodeURI(html);
         }
         catch (err)
         {
            // Sometimes the Ad HTML gives a malformed URI sequence error, which we can just ignore
            Info.decodeURIError = err;
         }
         Match = html.match(re);
         if (Match)
         {
            Info.advertiserId = Match[1];
         }
         // Ad ID = 21772681
         // <a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3954/0/0/%2a/n;217726817;0-0;0;40911646;3454-728/90;33219675/33237552/1;;%7Esscs=%3fhttp://markets.ft.com/markets/overview.asp">
         re = new RegExp(";(\\d+);\\d+-\\d+;\\d+;\\d+;\\d+-\\d+");
         Match = html.match(re);
         if (Match)
         {
            Info.adId = Match[1];
         }
      }
      Match = html.match(/Cr(eative)?\s*Id:\s*(\d+)/i);
      if (Match && Match.length === 3)
      {
         Info.creativeId = Match[2];
      }
   },

   // Find the DIV containing an Ad and grab the Ad ID, Creative ID and Ad Code HTML if possible
   "gatherAdCode": function (pos, AdInfo)
   {
      AdInfo.adCodeHTML = FTDiag.AD_CODE_NOT_FOUND;
      var adCodeHTML = FTDiag.getAdInnerHTML(pos);
      if (typeof adCodeHTML !== 'undefined')
      {
         adCodeHTML = adCodeHTML.replace((/</g), "\n<");
         adCodeHTML = adCodeHTML.replace((/\n[\s\n]+/g), "\n");
         AdInfo.adCodeHTML = adCodeHTML;

         // Check to see if this ad is the DFP system default ad.
         if (adCodeHTML.match(/817-grey\.gif/))
         {
            AdInfo.adType = "system default";
         }

         // Check for an interstitial in here?
         // <!-- Begin Interstitial Ad -->
         // <!-- ad ID: 220435672  creative ID: 34653048 -->
         var rRegex = new RegExp('<!-- ' + 'Begin +Interstitial +Ad -->', 'i');
         if (adCodeHTML.match(rRegex))
         {
            AdInfo.hasInterstitial = true;
            AdInfo.fullHTML = adCodeHTML;
            var Parts = adCodeHTML.split(rRegex);
            adCodeHTML = Parts[0];
            AdInfo.adCodeHTML = adCodeHTML;

            AdInfo.interstitial = FTDiag.getEmptyAdInfo("[" + pos + "]");
            AdInfo.interstitial.adType = "interstitial";
            AdInfo.interstitial.name = "[interstitial off of " + pos + "]";
            AdInfo.interstitial.adCodeHTML = "<!-- Begin Interstitial Ad -->" + Parts[1];
            FTDiag.getAssetIDs(AdInfo.interstitial.adCodeHTML, AdInfo.interstitial);
         }

         if (AdInfo.adType !== "system default")
         {
            FTDiag.getAssetIDs(adCodeHTML, AdInfo);
         }
      }
   },

   // Get diagnostics error messages to use as Ad information
   "getDiagnosticsErrors": function (Diagnostics)
   {
      var Errors = [];
      //var ErrorKeys = ["checkSiteZone", "buildURLForVideo", "requestVideoSync"];
      var ErrorKeys = FTDiag.getKeys(Diagnostics);
      for (var idx = 0; idx < ErrorKeys.length; ++idx)
      {
         // Look at everything except the requestURL, instead of just looking
         // at specific keys
         if (typeof Diagnostics[ErrorKeys[idx]] !== "undefined" && ErrorKeys[idx].toLowerCase() !== "requesturl")
         {
            Errors.push(Diagnostics[ErrorKeys[idx]]);
         }
      }
      if (Errors.length)
      {
         return "[" + Errors.join(": ") + "]";
      }
      return "Unknown";
   },

   // Gather up relevant diagnostics messages for display in the table
   "gatherDiagnostics": function (Diagnostics, AdInfo)
   {
      var Keys = FTDiag.getKeys(Diagnostics);
      for (var idx = 0; idx < Keys.length; ++idx)
      {
         var key = Keys[idx];
         AdInfo.diagnostics.push([key, Diagnostics[key]]);
      }
   },

   // Gather up relevant diagnostics messages from the response object
   "gatherResponse": function (Response, AdInfo)
   {
      var Keys = FTDiag.getKeys(Response);
      for (var idx = 0; idx < Keys.length; ++idx)
      {
         var key = Keys[idx];
         AdInfo.diagnostics.push([key, Response[key]]);
      }
   },

   // A near-duplication from DartForPublishers.js gets the containing DIV for an ad position
   "getAdContainers": function (name)
   {
      var AdContainers = [];
      // Using the legacy API we have to look for ad-container-banlb and ad-placeholder-banlb classes
      // so we loop through entire proxy array. in non-legacy we only look for the named ad container
      for (var idx = 0; idx < FTDiag.AD_DIV_PREFIXES.length; ++idx)
      {
         var idDiv = FTDiag.AD_DIV_PREFIXES[idx] + name;
         var adElement = document.getElementById(idDiv);
         if (adElement) {
            AdContainers.push({'div': adElement, 'name': idDiv});
         }
      }
      return AdContainers;
   },

   // A near-duplication from DartForPublishers.js gets the HTML from Ad container Div.
   // For legacy positions we look in both the placeholder and container.
   "getAdInnerHTML": function (name)
   {
      var html = undefined;
      var AdContainers = this.getAdContainers(name);
      if (AdContainers.length !== 0)
      {
         html = '';
         for (var idx = 0; idx < AdContainers.length; ++idx)
         {
            html = html + "<!-- div " + AdContainers[idx].name + " -->\n" + AdContainers[idx].div.innerHTML;
         }
      }
      return html;
   },

   // Store a value in our object, if its not undefined.
   "setValue": function (key, value)
   {
      if (typeof value !== "undefined")
      {
         FTDiag[key] = value;
      }
   },

   // Get the keys of an object
   "getKeys": function (obj)
   {
      var Keys = [];
      for (var key in obj)
      {
         if (obj.hasOwnProperty(key))
         {
            Keys.push(key);
         }
      }
      return Keys.sort();
   }, // getKeys(obj)

   // Get cookie value and massage the data for regex matching
   "getCookie": function (cookieName)
   {
      var cookie;
      var reCookie = new RegExp(cookieName + "=([^;]*)(;|$)");
      var Matches = document.cookie.match(reCookie);
      if (Matches)
      {
         cookie = Matches[1];
         cookie = cookie.replace(/%3D/g, "=");
         cookie = cookie.replace(/%2C/g, ",");
      }
      return cookie;
   },

   // Trim off spaces and other characters from the end of a string
   "rtrim" : function rtrim(str, chars)
   {
      chars = chars || "\\s";
      return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
   },

   // Assemble some debug info about the diagnostics
   "getDebugInfo": function ()
   {
      var Keys = ["VERSION", "URL_ASSETS", "STYLE", "URL_ICON"];
      var Info = ["<div id=\"diagnostics-debug\" style=\"display:none\"><ul>"];
      Info.push("<li>FTQA cookie: <strong>" + FTDiag.getCookie("FTQA") + "</strong></li>");
      for (var idx = 0; idx < Keys.length; ++idx)
      {
         var key = Keys[idx];
         Info.push("<li>" + key + ": <strong>" + FTDiag[key] + "</strong></li>");
      }
      Info.push("</ul></div>");
      return Info.join("\n");
   },

   // Log a message to the console window, browser safe.
   "log": function (msg)
   {
      if (this.debug === null || this.debug === undefined)
      {
         FTDiag.debug = false;
         var cookie = FTDiag.getCookie("FTQA");
         if (cookie && cookie.match(/debug/))
         {
            FTDiag.debug = true;
         }
      }
      if (FTDiag.debug)
      {
         if (window.console && window.console.log)
         {
            window.console.log(msg);
         }
         else if (window.opera)
         {
            window.opera.postError(msg);
         }
      }
   },

   "-": "-"
};
FTDiag.diagnose();

