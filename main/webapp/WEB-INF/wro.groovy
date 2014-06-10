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
        css(minimize: false, "/css/ft/advertising.css")
        css(minimize: false, "/css/ft/registration-widget.css")
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
        css "/css/ft/advertising.css"
        css "/css/ft/registration-widget.css"
    }

    "advertising-${version}" {
        groupRef("advertising-latest")
    }

    "advertising-${version}.min" {
        groupRef("advertising-latest.min")
    }

    "advertising-gpt" {
        js(minimize: false, "/js/thirdparty/third.party.namespace.js")
        js(minimize: false, "/js/ft/advertising.utils.js")
        js(minimize: false, "/js/ft/advertising.utils.cookie.js")
        js(minimize: false, "/js/ft/advertising.utils.timers.js")
        js(minimize: false, "/js/ft/advertising.utils.responsive.js")
        js(minimize: false, "/js/thirdparty/third.party.config.js")
        js(minimize: false, "/js/thirdparty/metadata.js")
        js(minimize: false, "/js/thirdparty/krux.js")
        js(minimize: false, "/js/thirdparty/third.party.targeting.js")
        js(minimize: false, "/js/ft/audienceScienceFacade.js")
        js(minimize: false, "/js/ft/audienceScience.js")
        js(minimize: false, "/js/thirdparty/video.miniplayer.js")
        js(minimize: false, "/js/thirdparty/third.party.slots.js")
        js(minimize: false, "/js/thirdparty/third.party.gpt.js")
        js(minimize: false, "/js/thirdparty/third.party.version.js")
    }

    "advertising-gpt.min" {
        js("/js/thirdparty/third.party.namespace.js")
        js("/js/ft/advertising.utils.js")
        js("/js/ft/advertising.utils.cookie.js")
        js("/js/ft/advertising.utils.timers.js")
        js("/js/ft/advertising.utils.responsive.js")
        js("/js/thirdparty/third.party.config.js")
        js("/js/thirdparty/metadata.js")
        js("/js/thirdparty/krux.js")
        js("/js/thirdparty/third.party.targeting.js")
        js("/js/ft/audienceScienceFacade.js")
        js("/js/ft/audienceScience.js")
        js("/js/thirdparty/video.miniplayer.js")
        js("/js/thirdparty/third.party.slots.js")
        js("/js/thirdparty/third.party.gpt.js")
        js("/js/thirdparty/third.party.version.js")
    }

    "third-party-${version}" {
        groupRef("advertising-gpt")
    }

    "third-party-${version}.min" {
        groupRef("advertising-gpt.min")
    }

    "advertising-gpt-latest" {
        groupRef("advertising-gpt")
        js(minimize: false, "/js/ft/HTMLAds.js")
        js(minimize: false, "/js/thirdparty/ft.switcher.js")
        css(minimize: false, "/css/ft/advertising-gpt.css")
        css(minimize: false, "/css/ft/registration-widget.css")
    }

    "advertising-gpt-latest.min" {
        groupRef("advertising-gpt.min")
        js "/js/ft/HTMLAds.js"
        js "/js/thirdparty/ft.switcher.js"
        css "/css/ft/advertising-gpt.css"
        css "/css/ft/registration-widget.css"
    }

    "advertising-gpt-${version}" {
        groupRef("advertising-gpt-latest")
    }

    "advertising-gpt-${version}.min" {
        groupRef("advertising-gpt-latest.min")
    }

    "third-party-htsi" {
        js(minimize: false, "/js/thirdparty/third.party.htsi.js")
        groupRef("advertising-gpt")
        js(minimize: false, "/js/thirdparty/third.party.htsi.switcher.js")
    }
}
