groups {
    "jshint" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
    }

    "advertising-latest" {
        js(minimize: false, "/js/ft/revenue-science.js")
        js(minimize: false, "/js/ft/advertising.utils.js")
        js(minimize: false, "/js/ft/advertising.utils.cookie.js")
        js(minimize: false, "/js/ft/HTMLAds.js")
        js(minimize: false, "/js/ft/DartForPublishers.js")
        js(minimize: false, "/js/ft/audienceScienceFacade.js")
        js(minimize: false, "/js/ft/audienceScience.js")
        js(minimize: false, "/js/ft/registration-widget.js")
        js(minimize: false, "/js/ft/advertising.refresh.js")
        js(minimize: false, "/js/ft/advertising.pagevisibility.js")
        js(minimize: false, "/js/ft/krux.controltag.js")
//        js(minimize: false,"/js/thirdparty/**.js")
//        js(minimize: false,"/js/lib/**.js")
        css(minimize: false, "/css/ft/**.css")
    }

    "third-party-latest" {
        js(minimize: false,"/js/thirdparty/**.js")
    }

    "third-party-latest.min" {
        js "/js/thirdparty/**.js"
    }

    "advertising-latest.min" {
        js "/js/ft/revenue-science.js"
        js "/js/ft/advertising.utils.js"
        js "/js/ft/advertising.utils.cookie.js"
        js "/js/ft/HTMLAds.js"
        js "/js/ft/DartForPublishers.js"
        js "/js/ft/audienceScienceFacade.js"
        js "/js/ft/audienceScience.js"
        js "/js/ft/registration-widget.js"
        js "/js/ft/advertising.refresh.js"
        js "/js/ft/advertising.pagevisibility.js"
        js "/js/ft/krux.controltag.js"
//       js "/js/thirdparty/**.js
 //       js "/js/lib/**.js"
        css "/css/ft/**.css"
    }

    "third-party-${version}" {
        groupRef("third-party-latest")
    }

    "third-party-${version}.min" {
        groupRef("third-party-latest.min")
    }

    "advertising-${version}" {
        groupRef("advertising-latest")
    }

    "advertising-${version}.min" {
        groupRef("advertising-latest.min")
    }
}
