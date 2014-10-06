/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
(function (win, doc, undefined) {
    "use strict";

    FT.ads.version = {
       artifactVersion: "${project.version}",
       buildLifeId: "${buildLifeId}",
       buildLifeDate: "${buildLifeDate}",
       gitRev: "${buildNumber}",
       toString: function () {
          return " version: " + this.artifactVersion + " Build life id: " + this.buildLifeId + " Build date: " + this.buildLifeDate + " git revision: " + this.gitRev;
       }
    };
} (window, document));

