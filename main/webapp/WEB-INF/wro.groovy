groups {
    "advertising-${version}-${APP.ENV}.min" {
        js "/js/ft/**.js"
        js "/js/thirdparty/**.js"
        css "/css/ft/**.css"
    }

    "advertising-${version}-${APP.ENV}" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
        css(minimize: false, "/css/ft/**.css")
    }
}
