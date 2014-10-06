//polyfill forEach for IE8 
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}
function encode(str) {
  return encodeURIComponent(str);
}

function decode(str) {
  return decodeURIComponent(str);
}

hashes = {
  cookies: function() {
    var hash = {};
    document.cookie.split('; ').forEach(
    function(item){
        item  = item.split('=');
        hash[item[0]] = item[1];
      }
    );
    return hash;
  }(),
  hash: function () {
    var hash = {};
    location.hash.slice(1).split('&').forEach(
    function(item){
        item  = item.split('=');
        hash[decode(item[0])] = decode(item[1]);
      }
    );
    return hash;
  }()
};

$(function(){
  var header = $('h1'),
    cookiesSec = $('#cookies'),
    examplesSec = $('#exmaples'),
    prepopulaters = $('#prepopulaters'),
    form = $('form[name="cookie-setter"]'),
          defaultLocation = document.location.protocol + '//' + document.location.host + document.location.pathname,
    defaultCookieOptions = { expires: 7, path: '/', domain: '.ft.com', secure: false };


  function renderMessage(msg, type) {
    type = type ? ' ' + type : '';
    $('.alert-message').remove();
   $('<p class="alert-message' + type + '"></p>').append(msg).insertAfter(header);
    return true;
  }

  form.submit(function() {
    var defaults = { expires: 'Expires', path: '', domain: 'Domain' },
      values = $.extend({}, defaultCookieOptions);

    $('input, select').each(function (index, item) {
      var key = item.name,
        value = $(item).val();

      if(defaults[key] !== value) {
        values[key] = $(item).val();
      }
    });

    if (!values.name) {
      renderMessage('cookie not set: no name supplied', 'error');
      return false;
    }

    $.cookie(values.name, values.value, values);
    document.location.hash = '#action=set&name=' + encode(values.name) + '&value=' + decode(values.value);
    document.location.reload();
    return false;
  });

  form.find('select[name="domain"]')   .append('<option>' + document.location.hostname + '</option>');

  $('#cookies').on('click', '.delete', function(ev){
    var row = $(this).parents('tr'),
      name = $(this).parent().next().text().trim();

    $('[name="domain"] option').each(function(index,item){
      if (index !== 0) {
        $.removeCookie(name, {path: '/', domain: $(item).val()});
      }
    });
    $.removeCookie(name, {path: '/'});
    row.remove();
  });

  prepopulaters.on('click', 'button', function(ev){
      var name, value, values, cookie,
        i = 0,
        cookies =  $(this).data('cookies');
      for(;i < cookies.length; i++) {
          cookie = cookies[i];
          $.cookie(cookie.name, cookie.value, defaultCookieOptions);
      }
      if(cookies.length === 1) {
        document.location.hash = '#action=set&name=' + encode(cookies[0].name) + '&value=' + encode(cookies[0].value);
      } else {
        document.location.hash = '#action=multiset&cookies=' + encode(JSON.stringify(cookies));
      }
      document.location.reload();
  });

  cookiesSec.on('click', '.delete', function(ev){
    var row = $(this).parents('tr'),
      name = $(this).data('cookie-name');

    $('[name="domain"] option').each(function(index,item){
      if (index !== 0) {
        $.removeCookie(name, {path: '/', domain: $(item).val()});
      }
    });
    $.removeCookie(name, {path: '/'});
    row.remove();
    document.location.hash = '#action=remove&name=' + encode(name);
    document.location.reload();
  });

  function handleEvents(){
    var hash = hashes.hash,
      cookies = hashes.cookies,
      actions = {
      set: function () {
        if(encodeURIComponent(hash.name) in cookies) {
          renderMessage('cookie set: name ' + hash.name + ' value ' + hash.value, 'success');
        } else {
          renderMessage('sorry, failed to set cookie: name ' + hash.name, 'error');
        }
      },
      multiset: function() {
        var cookie, msgPass, msgFail;
          msg = '<ul>',
          setCookies = JSON.parse(hash.cookies),
          passed = 0,
          failed = 0;
        while(cookie = setCookies.pop()) {
          msgPass = '<li class="success">name ' + cookie.name + ' value ' + cookie.value + '</li>';
          msgFail = '<li class="error">name ' + cookie.name + ' value ' + cookie.value + '</li>';
          if(cookie.value === null){
            if(!(encodeURIComponent(cookie.name) in cookies)) {
              passed++;
              msg += msgPass;
            } else {
              failed++;
              msg += msgFail;
            }
          } else {
            if(encodeURIComponent(cookie.name) in cookies) {
              passed++;
              msg += msgPass;
            } else {
              failed++;
              msg += msgFail;
            }
          }
        }
        msg += '</ul>';

        msg = passed + ' cookies set ' + failed + ' cookies failed!' + msg;
        renderMessage(msg);
      },
      remove: function () {
        if(!(hash.name in cookies)) {
          renderMessage('cookie removed: name ' + hash.name, 'success');
        } else {
          renderMessage('sorry, failed to remove cookie: name ' + hash.name, 'error');
        }
      },
      'default': function (){
        renderMessage('ya\'ll dont be fiddlin wit ma cookie tool!!');
      }
    }

    if(hash.action in actions){
      actions[hash.action]();
    } else if (hash.action){
      actions['default']();
    }
    document.location.hash = '';
  }

  handleEvents(hashes.hash);

  if(document.cookie === '') {
    cookiesSec.find('table').remove();
    cookiesSec.append('<p class="alert-message">No cookies set.</p>');
  } else {
    var name, value,
      table = cookiesSec.find('table tbody');

    for(name in hashes.cookies){
      value = hashes.cookies[name];
      table.append('<tr><td><span class="delete" data-cookie-name="' + name + '">&times;</span></td><td>' + decode(name) +'</td><td>'+ decode(value) + '</td></tr>');
    }
  }
});