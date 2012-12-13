groups {
    "jshint" {
        js(minimize: false, "/js/ft/**.js")
        js(minimize: false,"/js/thirdparty/**.js")
    }

    "advertising-latest" {
        js(minimize: false, "/js/ft/**.js")
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
        js "/js/ft/**.js"
 //       js "/js/thirdparty/**.js"
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
