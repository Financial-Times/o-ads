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

// Temporary hack to allow selenium tests to pass until ad server configured-
//FT.ads = {};
FT.env =
{
   // THIRD PARTY CUSTOMISATION HERE
   'dfp_site':  'test.5887.dev',
   'dfp_zone':  'master-companion-test',
   'targeting': ';key=value',

   'formats':   {
      'square':   '1x2,2x2,3x3,4x4',
      'newssubs': '239x90',
      'hlfmpu':   '300x250',
      'mpusky':   '300x250',

      'ribbon':   '980x60',
      'ban':      '468x60',
      'banlb':    '468x60,728x90;dcopt=ist',
      'banlb2':   '468x60,728x90',
      'mpu':      '300x250',
      'sky':      '120x600',
      'wdesky':   '120x600,160x600',
      'button1':  '120x60,120x90,120x120',
      'button2':  '120x60,120x90,120x120',
      'button3':  '120x60,120x90,120x120',
      'button4':  '120x60,120x90,120x120',
      '-': '-'
   },
   'audSciLimit': 0,
   // END THIRD PARTY CUSTOMISATION

   'server':    '',
   'method':    '/adj/',
   'ord':       Math.floor(Math.random() * 1E16),
   'tile':      0,
   'Requests':  {},
   'getAudSci': function (cookie)
   {
      var   ft = this,
            rsiSegs,
            Segments,
            Found,
            idx,
            segment;
      ft.cookie = cookie === undefined ? document.cookie : cookie;
      ft.audSci = '';

      if (ft.audSciLimit)
      {
         rsiSegs = ft.cookie.replace(/^.*\brsi_segs=([^;]*).*$/, '$1');
         if (rsiSegs !== ft.cookie)
         {
            Segments = rsiSegs.split(/\|/);
            Found = [];
            for (idx = 0; Found.length < ft.audSciLimit && idx < Segments.length; ++idx)
            {
               segment = Segments[idx];
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
   'getURL':    function (pos)
   {
      var ft = this;
      ft.url = undefined;
      ft.URLParts = undefined;
      ft.pos = pos;
      ft.sz = ft.formats[ft.pos];
      if (ft.audSci === undefined)
      {
         ft.audSci = ft.getAudSci(ft.cookie);
      }
      if (ft.sz)
      {
         ft.URLParts = ['http://ad.', ft.server, 'doubleclick.net', ft.method, ft.dfp_site, '/', ft.dfp_zone, ';sz=', ft.sz, ';pos=', ft.pos, ft.targeting, ft.audSci, ';tile=', ++ft.tile, ';ord=', ft.ord, '?'];
         ft.url = ft.URLParts.join('');
      }
      ft.Requests[ft.pos] = ft.url;
      return ft.url;
   },
   'getTag':    function (pos)
   {
      var ft = this,
      url = ft.getURL(pos);
      ft.tag = undefined;
      ft.Parts = undefined;
      if (url)
      {
         ft.Parts = ['<', 'script src="', url, '"><', '/script>'];
         ft.tag = ft.Parts.join('');
      }
      return ft.tag;
   },
   'adCall':    function (pos)
   {
      /*jshint evil:true */ 
      var tag = this.getTag(pos);
      if (tag)
      {
         document.write(tag);
      }
   },
   '_': '_'
};
