/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

"use strict";

module.exports = {
   artifactVersion: "${project.version}",
   buildLifeId: "${buildLifeId}",
   buildLifeDate: "${buildLifeDate}",
   gitRev: "${buildNumber}",
   toString: function () {
      return " version: " + this.artifactVersion + " Build life id: " + this.buildLifeId + " Build date: " + this.buildLifeDate + " git revision: " + this.gitRev;
   }
};

