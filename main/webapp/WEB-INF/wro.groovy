groups {
    "jshint" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
    }

    "advertising-latest" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
//        js(minimize: false,"/js/lib/**.js")
        css(minimize: false, "/css/ft/**.css")
    }

    "advertising-latest.min" {
        js "/js/ft/**.js"
        js "/js/thirdparty/**.js"
 //       js "/js/lib/**.js"
        css "/css/ft/**.css"
    }

    "advertising-${version}" {
        groupRef("advertising-latest")
    }

    "advertising-${version}.min" {
        groupRef("advertising-latest.min")
    }
}
