var html= '<div id="accmanwrapper">' +
'<div id="accmanlogo">' +
'<div class="accmanlogo-client"></div>' +
'<div class="accmanlogo-ft"></div>' +
'</div><!--end accmanlogo-->' +
'<div id="accmancontent">' +
'<h1>Welcome to your global access to FT.com</h1>' +
'<div class="accmanmaincontent">' +
'<h2>Sign up just once for seamless access to FT news, comment and analysis online.</h2>' +
'<p><strong>Use your username & password to access personalised features such as:</strong></p>' +
'<ul>' +
'<li><strong>FT Alphaville</strong> For the best-informed start to the financial working day, get the 6am Cut from FT Alphaville, providing essential news and         analysis on the markets, hedge funds and private equity.</li>' +
'<li><strong>Lex Emails</strong> Receive alerts of Lex notes up to three times a day. In addition, &#39;Best of Lex&#39; delivers a weekly round-up of the most topical 			Lex notes as selected by the Editor.</li>' +
'<li><strong>Email Briefings</strong> Select from over 40 daily email briefings on a wide range of global industry and sector topics. They include the Morning         Headlines, sent at 8am.</li>' +
'<li><strong>Company Alerts</strong> Get the latest FT news stories related to specific companies and activities you are monitoring.</li>' +
'</ul>' +
'<p><strong>Please ensure that you sign up using your Company Name Here email address.</strong></p>' +
'<div class="accmandiv-btn">' +
'<a href="https://registration.ft.com/registration/subscription-service/corporateAccessSignup?cpgid=9999" title="Link to Sign up now page">' +
'<span class="accmanoff-screen">Sign up now</span>' +
'</a>' +
'</div>' +
'</div><!--end accmanmaincontent-->' +
'<FORM id=loginForm method=post name=loginForm action=https://registration.ft.com/registration/barrier/login target=_top><INPUT type=hidden name=location> <INPUT value=http%3A%2F%2Fflagscape.bankofamerica.com type=hidden name=referer> <INPUT type=hidden name=cpgid value="9999"> <INPUT value=1832 type=hidden name=segid>' +
'<div class="accmansignup">' +
'<p><strong>If you have already signed up to FT.com, please enter your username or email address and password in the fields below.</strong></p>' +
'<div class="formElements">' +
'<label>Username or Email Address</label><input type="text" />' +
'</div>' +
'<div class="formElements">' +
'<label>Password</label><input type="password" />' +
'</div>' +
'<div  class="accmandiv-btn">' +
'<button type="submit" name="Log in Button" title="Log in Button" class="corpLogBtn">&nbsp;</button>' +
'</div>' +
'</form>' +
'<div class="wrapper-btn-close">' +
'	<p class="accmannote">Forgotten your password? <a title="Forgotten your password" href="https://registration.ft.com/registration/login/forgottenpassword?forgottenPasswordUsername=&amp;location=http://www.ft.com/home/uk">Click here</a></p>' +
'	<div class="accmandiv-btn-close">' +
'		<a href="javascript:hidediv()">             <span class="accmanoff-screen">Close x</span>' +
'		</a>' +
'	</div>' +
'</div>' +
'</div><!--end accmansignup div-->' +
'</div>' +
'</div>' +
'<style type=text/css media=all>' +
'a{' +
'	text-decoration:none;' +
'}' +
'#leaderboard div, #leaderboard a, #leaderboard img {' +
'	 display:block;' +
'	 line-height:16px' +
'}' +
'#accmanwrapper{' +
'	top:0;' + 
'	left:0;' +
'	border:8px solid #777777;' +
'	position:absolute;' +
'	width:900px;' +
'	z-index:21000000;' +
'	font-family:Arial, Helvetica, sans-serif;' +
'   text-align:left !important' +
'	height:auto;' +
'	background-color:#ffffff' +
'}' +
'#accmanlogo{' +
'	height:110px;' +
'}' +
'#accmancontent p{' +
'	  text-transform:none !important;' +
'     color:#000 !important;' +
'     padding:1.0em !important' +
'}' +
'#accmancontent p.accmannote a{' +
'	 display:inline-block !important;' +
'}' +
'.accmanlogo-ft{' +
'	background:url("http://media.ft.com/adimages/banner/ftcmyk.gif") no-repeat scroll 0 0 #FF0000;' +
'	display:inline-block !important;' +
'	float:right;' +
'	height:80px;' +
'	margin:15px !important;' +
'	width:59px;' +
'}' +
'.accmanlogo-client{' +
'	background:url("http://media.ft.com/adimages/banner/placeholder.gif") no-repeat scroll left center transparent;' +
'	display:inline-block !important;' +
'	float:left;' +
'	height:80px;' +
'	margin:15px !important;' +
'	width:210px;' +
'}' +
'#accmancontent{' +
'	font-size:13px;' +
'	clear:both;' +
'}' +
'#accmancontent h1{' +
'	background-color:#FFE9D1;' +
'	font-size:25px;' +
'	font-weight:normal;' +
'	margin:0;' +
'	padding:15px;' +
'}' +
'#accmancontent h2{' +
'	font-size:18px !important;' +
'}' +
'.accmanmaincontent{' +
'	background-color:#FFF3E5 !important;' +
'	margin:0;' +
'	padding:5px 15px !important;' +
'   text-align:left !important;' +
'}' +
'.accmanmaincontent ul{' +
'	 width:790px;' +
'	 padding-left:20px;' +
'}' +
'.accmanmaincontent ul li{' +
'	 padding:6px 0;' +
'	 list-style:disc !important;' +
'}' +
'.accmansignup{' +
'	padding:0 15px !important;' +
'	clear:both;' +
'   text-align:left !important;' +
'}' +
'.accmansignup div{' +
'	display:inline-block !important;' +
'	width:200px;' +
'	float:left;' +
'	margin:10px 0 0 8px !important;' +
'}' +
'.formElements {' +
'   width:220px !important;' +
'}' +
'.formElements label {' +
'   display:block;' +
'	padding:3px 0;' +
'	font-weight:800;' +
'   font-size:0.9em;' +
'   margin:0 0 10px 0;' +
'}' +
'#accmancontent p.accmannote{' +
'	font-size:.8em !important;' +
'	color:#666666 !important;' +
'	clear:both !important;' +
'	padding-bottom:0 !important;' +
'	margin:0 !important;' +
'	display:inline-block;' +
'	float:left;' +
'}' +
'.accmandiv-btn{' +
'	margin:0 auto !important;' +
'	width:100px !important;' +
'}' +
'.accmandiv-btn a, .accmandiv-btn button{' +
'	background:url("http://media.ft.com/Common/Subscription/images/case_sprite.gif") no-repeat scroll 0 -70px transparent;' +
'	display:inline-block;' +
'	height:32px;' +
'	left:41%;' +
'	width:104px;' +
'	border:none;' +
'}' +
'.accmandiv-btn button.corpLogBtn{' +
'	background-position:0 -120px !important;' +
'	margin:20px 0 0 !important;' +
'}' +
'.wrapper-btn-close{' +
'	clear:both;' +
'	width:100% !important;' +
'}' +
'.accmandiv-btn-close{' +
'	float:right !important;' +
'	padding:0 5px 5px !important;' +
'	text-align:right;' +
'}' +
'.accmandiv-btn-close a{' +
'	background:url("http://media.ft.com/Common/Subscription/images/case_sprite.gif") no-repeat scroll 0 -180px transparent;' +
'	display:inline-block;' +
'	height:32px;' +
'	_height:20px;' +
'	width:60px;' +
'}' +
'.accmanoff-screen{' +
'	top:-1000px;' +
'	left:-1000px;' +
'	position:absolute;' +
'}' +
'</style>';


function hidediv() {
	document.getElementById('accmanwrapper').style.visibility = 'hidden';
}
var corppopDiv3 = document.getElementById(FT.corppop.HTMLAdData.injectionDiv);
corppopDiv3.innerHTML = html;
//cookie timeout value in miliseconds from present
var cookieTimeOut = 21600000;
FT.corppop.createCorppopCookie(cookieTimeOut);
