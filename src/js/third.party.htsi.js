/*jshint evil: true, white: false, browser: true, onevar: false, undef: true, nomen: false, plusplus: false, eqeqeq: true, bitwise: true, regexp: false, newcap: true, immed: true */
/*globals window */

/* Example implementation of FT DFP Ads for use by Third Parties.

   Third parties will need to customize values:

   dfp_site

   - this will be assigned to third party sites and should be relatively
   constant across their site. In addition to the main site name, a test
   site name can be created to provide separate ads in a test environment.
   For example if bank.5887.home is your main site name then test.5887.home
   can be set up as a test site for ads in your test environment.

   dfp_zone

   - zones will be defined and provided to third parties and will vary across
   the individual sections of a third party site.  This value will likely
   vary for each page on the third party site.

   targeting

   - additional targeting information may be set by third party based on
   query string, etc.  Before calling FT.env.adCall() you would set
   additional targeting with FT.env.targeting = ';q=markets;author=bill';
   If you don't need additional targeting, set this to an empty string.
   FT.env.targeting = '';

   formats

   - a table mapping ad position names into ad sizes and any additional
   parameters for the ad call. Each ad position name you use needs to have
   an entry in the table so that the allowed sizes can be put into the ad
   call for that position. If you try to make an adCall() for a position
   which has no entry, then no ad call will be made and the position will
   remain empty.

   audSciLimit

   - if you do not require targeting ads based on FT audience science segments
   then you can leave this set to zero. Otherwise, set this to the number of
   Audience Science segments you wish to include in the ad call. These segments
   come from the rsi_segs cookie and must have the client code J07717_ to be
   recognized.

   server

   - if possible, third party can locate which country their users are in and
   change to a local server.  Otherwise the default server can be used.  DFP
   use ISO two letter codes to specify alternate ad servers i.e.
   ad.uk.doubleclick.net and have a limited number of servers so you will
   have to use only the proper ad servers if you wish to go down this route.
   To change the server you would use FT.env.server = 'uk.'; before calling
   FT.env.adCall()

   After placing this javascript on your page, you can perform an ad call by
   putting javascript at the ad call location.  We suggest you place your ad
   call within a div with an id named the same as the ad position name.

   <div id="banner">
      <script type="text/javascript">
      FT.env.adCall('banner', '728x90,468x60');
      </script>
   </div>

*/

var FT = window.FT || {};

FT.env =
{
   // THIRD PARTY CUSTOMISATION HERE
   //'dfp_site':  'test.5887.dev',
   //'dfp_zone':  'master-companion-test',
   //'targeting': ';key=value',

   'formats':   {
      //'banlb':    '468x60,728x90',
      //'newssubs': '239x90',
      //'hlfmpu':   '300x600,336x850',
      //'mpu':      '300x250,336x280',
      //'mpusky':   '160x60',
      //'popup':    '1x1;dcopt=ist'
   },
   'audSciLimit': 20,
   // END THIRD PARTY CUSTOMISATION

   'server':    '',
   'method':    '/adj/',
   'ord':       Math.floor(Math.random() * 1E16),
   'tile':      0,
   'Requests':  {},
   'getAudSci': function (cookie)
   {
      var ft = this;
      ft.cookie = cookie === undefined ? document.cookie : cookie;
      ft.audSci = '';

      if (ft.audSciLimit)
      {
         var rsiSegs = ft.cookie.replace(/^.*\brsi_segs=([^;]*).*$/, '$1');
         if (rsiSegs !== ft.cookie)
         {
            var Segments = rsiSegs.split(/\|/);
            var Found = [];
            for (var idx = 0; Found.length < ft.audSciLimit && idx < Segments.length; ++idx)
            {
               var segment = Segments[idx];
               if (segment.match(/^J07717_/))
               {
                  segment = segment.replace(/^J07717_/, '');
                  segment = ';a=z' + (parseInt(segment, 10) - 10000);
                  Found.push(segment);
               }
            }
            ft.audSci = Found.join('');
         }
      }
      return ft.audSci;
   },
   'getURL': function (pos, size, pt)
   {
      var page_type = "";
      if (pt) {
         page_type = ";pt=" + pt;
      }

     if (!this.config) {
       this.config = this._findConfig();
       this.dfp_site = this.config.dfp_site;
       this.dfp_zone = this.config.dfp_zone;
     }

     var erightsid;
     if (this.config.erightsID) {
      erightsid = ';u=eid='+this.config.erightsID+';eid=' + this.config.erightsID;
     } else {
      erightsid = '';
     }

      var ft = this;
      ft.url = undefined;
      ft.URLParts = undefined;
      ft.pos = pos;
      ft.sz = size || ft.formats[ft.pos];
      if (ft.audSci === undefined)
      {
         ft.audSci = ft.getAudSci(ft.cookie);
      }
      if (ft.sz)
      {
         ft.URLParts = ['http://ad.', ft.server, 'doubleclick.net/N5887', ft.method, ft.dfp_site, '/', ft.dfp_zone, ';sz=', ft.sz, ';pos=', ft.pos, page_type, ft.targeting, erightsid, ft.audSci, ';tile=', ++ft.tile, ';ord=', ft.ord, '?'];
         ft.url = ft.URLParts.join('');
      }
      ft.Requests[ft.pos] = ft.url;
      return ft.url;
   },
   'getTag':    function (pos, size, page_type)
   {
      var ft = this;
      ft.tag = undefined;
      ft.Parts = undefined;
      var url = ft.getURL(pos, size, page_type);
      if (url)
      {
         ft.Parts = ['<', 'script type="text/javascript" src="', url, '"><', '/script>'];
         ft.tag = ft.Parts.join('');
      }
      return ft.tag;
   },
   'advert':   function (id)
   {
     if (!this.config) {
      this.config = this._findConfig();
      this.dfp_site = this.config.dfp_site;
      this.dfp_zone = this.config.dfp_zone;
     }

    this.sz = document.getElementById(id).getAttribute('data-ad-size');
    this.pos = document.getElementById(id).getAttribute('data-ad-position');
    var page_type = document.getElementById(id).getAttribute('data-ad-page-type');
    document.write(this.getTag(this.pos, this.sz, page_type));
   },
   'adCall':    function (pos)
   {
      var tag = this.getTag(pos);
      if (tag)
      {
         document.write(tag);
      }
   },
   '_findConfig': function() {
      var config = {};

      var cookies = {};
      var jar = document.cookie.split('; ');
      for (var i=0; i<jar.length; i++) {
         var first = jar[i].substring(0, jar[i].indexOf('='));
         var last = jar[i].substring(jar[i].indexOf('=')+1);
         cookies[first] = last;
      }

      var eid = null;
      if (cookies.FT_U) {
         var parts = cookies.FT_U.split('_');
         for (i=0; i<parts.length; i++) {
            var nv = parts[i].split('=');
            if (nv[0]==="EID") {
               eid = nv[1].replace(/^0*/, "");
               break;
            }
         }
       } else if (cookies.FT_Remember) {
         eid = cookies.FT_Remember.split(':');
         if (eid && eid.length > 0){ eid = eid[0]; }
       }
       config.erightsID = eid;
       var metas = document.getElementsByTagName('meta');
       for (i=0; i<metas.length; i++) {
       var meta = metas[i];
       if (meta.getAttribute('name') === 'dfp_site') {
         config.dfp_site = meta.getAttribute('content');
       } else if (meta.getAttribute('name') === 'dfp_zone') {
         config.dfp_zone = meta.getAttribute('content');
       }
     }
     return config;
  },
   '_': '_'
};

