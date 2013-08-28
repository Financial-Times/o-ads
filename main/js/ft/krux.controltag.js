if(!window.FT) { window.FT = {};}
if(!FT.ads) { FT.ads ={};}
    /**
    * @namespace FT.ads
    */
FT.ads.kruxConfigId= (FT.ads.getDFPSite().match(/^ft.com/)) ? "IgnVxTJW" : "IhGt1gAD";
var Krux = window.Krux||((Krux=function(){Krux.q.push(arguments);}).q=[]);
  (function(){
    var k=document.createElement('script');k.type='text/javascript';k.async=true;
    var m,src=(m=location.href.match(/\bkxsrc=([^&]+)/))&&decodeURIComponent(m[1]);
    k.src = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :
      (location.protocol==="https:"?"https:":"http:")+"//cdn.krxd.net/controltag?confid="+FT.ads.kruxConfigId;
    var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(k,s);
  }());
