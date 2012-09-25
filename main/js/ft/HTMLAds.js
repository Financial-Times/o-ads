/*IGNORETHISglobal FT, XMLHttpRequest, alert, navigator, ad, document, window, clientAds*/

/*members HTMLAds, HTMLAdData, urlStem, injectionDiv, injectionClass,
prototype, buildAdURL, match, urlStem, getHTMLAd, open, setRequestHeader,
userAgent, send, status, responseText, getElementById, createElement,
isCorporateUser, match, cor, lv1, lv2, setAttribute, className, innerHTML,
appendChild, timeOut, setTime, getTime, toGMTString, cookie, location, hostname,
timeOutCookieName,timeOutCookieVal, timeOutCookieLife, log, createCorppopCookie,
type, src, style, display, injectionParentDiv, injectionLegacyParentDiv, toUpperCase,
urlStemClassicAMO, Properties, CORPORATE_AMO_BASE, reg */

FT.HTMLAds = function () {

	this.HTMLAdData = {
        //directory where all HTML ads are stored
        'urlStem' : 'http://media.ft.com/adimages/banner/',
        'injectionParentDiv' : 'banlb',
        'injectionLegacyParentDiv' : 'ad-placeholder-banlb',
        'injectionDiv' : 'corppop_overlay',
        'injectionClass' : 'corppop_single_occurence',
        'timeOutCookieName' : 'FT_AM',
        'timeOutCookieVal' : 'Check',
        'timeOutCookieLife' : '21600000', // 6 hours in milliseconds (default)
        'urlStemClassicAMO' : 'http://media.ft.com/m/registration.ft.com/corporate/ns/amo/'
	};

};

/**
 *
 * @param AYSC98
 * @param AYSC22 subscription level
 * @param AYSC27 corporate ID
 * @param regex
 * @return {String}
 */
FT.HTMLAds.prototype.buildAdURL = function (AYSC98, AYSC22, AYSC27, regex) {
    var userType = 'anon/',
        fileName = '',
        urlStemNewAMO;
    if ((AYSC22.match(regex.cor)) || (AYSC22.match(regex.lv1)) || (AYSC22.match(regex.lv2))) {
        userType = 'subscribed/';
    } else if ((AYSC22.match(regex.reg))) {
        userType = 'registered/';
    }
    if (AYSC98 === '' || AYSC98.match(/PVT/)) {
        //make sure case is consistent
        AYSC27 = AYSC27.toUpperCase();
        fileName = this.HTMLAdData.urlStem + AYSC27 + '.js';
    } else {
        if ((typeof FT.Properties.CORPORATE_AMO_BASE === "undefined") || (FT.Properties.CORPORATE_AMO_BASE === '')) {
            urlStemNewAMO = this.HTMLAdData.urlStemClassicAMO;
        } else {
            urlStemNewAMO = FT.Properties.CORPORATE_AMO_BASE;
        }
        fileName = urlStemNewAMO + userType + AYSC27;
    }
    return fileName;
};

//get the html ad and inject it
FT.HTMLAds.prototype.getHTMLAd = function (adType, inj, fileName) {
    var js = '<script src="' + fileName + '" type="text/javascript">' +
             '/* Do not remove comment */' +
             '</script>',
        CorppopDiv,
        CorppopDivName,
        corppopDivAgain,
        Script1;
    //force parent div to display: block, even if no banlb ad is served
    inj.style.display = "block";

    CorppopDiv = document.getElementById(this.HTMLAdData.injectionDiv);
    CorppopDivName = this.HTMLAdData.injectionDiv;

    if (CorppopDiv === null) {
        CorppopDiv = document.createElement("div");
    }

    CorppopDiv.setAttribute("id", CorppopDivName);
    CorppopDiv.className = this.HTMLAdData.injectionClass;

    Script1 = document.createElement('script');
    Script1.type = 'text/javascript';
    Script1.src = fileName;

    //in case CorppopDiv is null we put in try block, though this should  not happen
    try {
        inj.appendChild(CorppopDiv);
        //seems to be happier if we get this again after appending it to the div
        corppopDivAgain = document.getElementById(CorppopDivName);
        corppopDivAgain.appendChild(Script1);
    } catch (er2) {
        clientAds.log(er2);
    }
};

//find out from the AYSC cookie values whether the user is a corporate subscriber
FT.HTMLAds.prototype.isCorporateUser = function (AYSC97, AYSC98, AYSC22, AYSC27, regex) {
    if (!AYSC27) {
        return 0;
    }
    if (AYSC98 === '' || (AYSC98.match(/PVT/))) {
       //guard against code injection
        if ((AYSC22.match(/[<>]/)) || (AYSC27.match(/[<>]/)) || (AYSC27.match(/RES/)) || (AYSC27.match(/PVT/))) {
            return 0;
        } else if ((!AYSC27.match(/[0-9A-Za-z]/)) || (AYSC22.match(regex.cor)) || (AYSC22.match(regex.lv1)) || (AYSC22.match(regex.lv2))) {
          //corppop should not be served
            return 0;
        }
    } else if (AYSC98.match(/A/) && !AYSC98.match(/IA/)) {
        //guard against code injection
        if ((AYSC22.match(/[<>]/)) || (AYSC27.match(/[<>]/)) || (AYSC27.match(/RES/)) || (AYSC27.match(/PVT/))) {
            return 0;
        } else if ((!AYSC27.match(/[0-9A-Za-z]/))) {
            //corppop should not be served
            return 0;
        } else if (AYSC97.match(/c/)) {
            return 0;
        }
    } else {
        return 0;
    }
    return 1;
};

//create Corppopcookie
FT.HTMLAds.prototype.createCorppopCookie = function (timeoutTime) {
    var name,
        val,
        date,
        expires;

	//If timeout not set in ad, set to 6 hours as default
	if (typeof timeoutTime === "undefined") {
		timeoutTime = this.HTMLAdData.timeOutCookieLife;
	}

	name = this.HTMLAdData.timeOutCookieName;
	val = this.HTMLAdData.timeOutCookieVal;
	date = new Date();

	date.setTime(date.getTime() + (timeoutTime));
	expires = "; expires=" + date.toGMTString();
	document.cookie = name + "=" + val + expires + "; domain=.ft.com; path=/";

};

//only show the ad if the Corppop cookie has timed out and has been deleted
FT.HTMLAds.prototype.timeOut = function (corppopTimeoutCookie, corppopOldTimeoutCookie) {

	//while we transition to the new cookie name we dont want people being served
	//pop ads unless both values are undefined.
	if (!corppopTimeoutCookie && !corppopOldTimeoutCookie) {
		return 1;
	}
	return 0;
};
