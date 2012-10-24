groups {
    "advertising-latest" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
        css(minimize: false, "/css/ft/**.css")
    }

    "advertising-latest.min" {
        js "/js/ft/**.js"
        js "/js/thirdparty/**.js"
        css "/css/ft/**.css"
    }

    "advertising-${version}.min" {
        groupRef("advertising-latest")
    }

    "advertising-${version}" {
        groupRef("advertising-latest.min")
    }
}
