(function(w, d, FT, u){
  "use strict";
  FT._ads = FT._ads || {};
  var registrationWidget = FT._ads.registrationWidget = {
      config: {
          clickUrl: false,
          submitUrl: 'https://registration.ft.com/youraccount/updatePosition?erightsid=',
          parentSelector: '#navigation',
          collapseTimeout: 1500,
          animationTime: 'slow',
          header:"Help us enhance your FT.com experience",
          paragraph: "Keep informed on the subjects most important to you with article recommendations and special report notices.",
          saveText: "Save",
          savingText: "Saving",
          savedText: "\u2714 Thank you"
          //name: 'position',
          //options: [{"val":"-1","name":"Select your position"},{"val":"25","name":"Analyst"},{"val":"24","name":"Associate"},{"val":"19","name":"Business School Academic"},{"val":"2","name":"CEO/president/Chairman"},{"val":"11","name":"Consultant"},{"val":"7","name":"Exec Mgmt (EVP/SVP/MD)"},{"val":"18","name":"MBA Student"},{"val":"6","name":"Manager/Supervisor"},{"val":"3","name":"Other C Level (CFO/COO/CIO/CMO)"},{"val":"1","name":"Owner/Partner/Proprietor"},{"val":"12","name":"Professional"},{"val":"23","name":"Programme/Project Manager"},{"val":"14","name":"Secretary/Treasurer"},{"val":"15","name":"Senior Manager/Dept Head"},{"val":"8","name":"Technical/Business Specialist"},{"val":"5","name":"VP/Director"}]
      },
      ammendWidget: function () {
        var config = this.config;

        this.header.text(config.header);
        this.paragraph.text(config.paragraph);
        this.saveText.text(config.saveText);
        this.select.attr('name', config.name);
        this.addOptions(config.options);
        return true;
      },
      buildWidget: function () {
        var config = this.config,
          container = this.container = FT.$('<div id="registrationWidget" class="clearfix"></div>'),
          form = this.form = FT.$('<form name="registration-widget"></form>'),
          header = this.header = FT.$('<h5>' + config.header + '</h5>'),
          paragraph = this.paragraph = FT.$('<p>' + config.paragraph + '</p>'),
          fieldset = FT.$('<fieldset>'),
          select = this.select = FT.$('<select name="' + config.name + '"></select>'),
          save = this.save = FT.$('<button type="submit" class="standardImage disabled"><span><span>' + config.saveText + '</span></span></button>'),
          close = FT.$('<a href="#" title="close" class="close">&times;</a>');

        container.append(form);
        form.append(header)
          .append(paragraph)
          .append(fieldset)
          .append(close);
        fieldset.append(select)
          .append(save);

        this.addOptions(config.options);
        this.saveText = this.save.find('span span');
        return true;
      },
      addOptions: function (options) {
          var option,
          select = this.select;

          select.empty();
          while(option = options.shift()){
              select.append('<option value="' + option.val + '">' + option.name + '</option>');
          }
      },
      destroy: function () {
        registrationWidget.container.slideUp(registrationWidget.config.animationTime, function (){
            registrationWidget.container.remove();
        });
      },
      events: [
          {
              name: 'click',
              selector: '[title="close"]',
              handler: function (){
                  registrationWidget.container.slideUp(registrationWidget.config.animationTime, function (){
                      registrationWidget.container.remove();
                  });
                  return false;
              }
          },
          {
              name: 'submit',
              handler: function (){
                  var self = registrationWidget,
                    config = self.config,
                    eid = FT.cookie.getParam('FT_U', 'EID'),
                    selected = self.select.find(':selected'),
                    name = config.name,
                    value = selected.val(),
                    text =  selected.text(),
                    data = {};

                  data[name] = {id: value, name: text};

                  self.save.addClass('saving');
                  self.saveText.text(config.savingText);

                  if (config.clickUrl) {
                    FT.$.get(config.clickUrl);
                  }

                  FT.$.post(config.submitUrl + eid, data)
                    .complete(function(response) {
                      self.save
                          .removeClass('saving')
                          .addClass('saved');
                      self.saveText.text(config.savedText);
                      setTimeout(self.destroy, config.collapseTimeout);
                  });
                  return false;
              }
          },
          {
              name: 'click',
              selector: '.disabled',
              handler: function (){
                  return false;
              }
          },
          {
              name: 'change',
              selector: 'select',
              handler: function (){
                if(registrationWidget.select.val() !== '-1') {
                  registrationWidget.save.removeClass('disabled');
                } else {
                  if(!registrationWidget.save.hasClass('disabled')) {
                    registrationWidget.save.addClass('disabled');
                  }
                }
                return true;
              }
          }
      ],
      attachWidget: function() {
        return this.container
          .hide()
          .insertAfter(this.config.parentSelector)
          .slideDown(this.config.animationTime);
      },
      attachEvents: function () {
          if (!this.form || !this.events) {
              return false;
          }
          var event,
              events = this.events;
          while(event = events.pop()){
              if (event.selector) {
                  this.form.on(event.name, event.selector, event.handler);
              } else {
                  this.form.on(event.name, event.handler);
              }
          }
      },
      init: function (config) {
        var prop;
        // If a value in the config object supplied is false remove it,
        // this is to stop empty strings overriding the defaults.
        for (prop in config) {
          if (!config[prop]) {
            delete config[prop];
          }
        }

        if (FT.$.isPlainObject(config)) {
          FT.$.extend(true, this.config, config);
        }

        if (!this.container) {
          this.buildWidget();
          this.attachEvents();
          this.attachWidget();
        } else {
          this.ammendWidget();
        }

        return this;
      }
  };
}(window, document, FT));

/* Initialization: */
/* the code below is served as an advert from DFP to initialize the widget, the select options and field name are set here */
/* Country */
/*
FT._ads.registrationWidget.init({
  name: "country",
  options: [{"val":"-1","name":"Select your country"},{"val":"4","name":"Afghanistan"},{"val":"8","name":"Albania"},{"val":"12","name":"Algeria"},{"val":"16","name":"American Samoa"},{"val":"20","name":"Andorra"},{"val":"24","name":"Angola"},{"val":"660","name":"Anguilla"},{"val":"28","name":"Antigua and Barbuda"},{"val":"32","name":"Argentina"},{"val":"51","name":"Armenia"},{"val":"533","name":"Aruba"},{"val":"36","name":"Australia"},{"val":"40","name":"Austria"},{"val":"31","name":"Azerbaijan"},{"val":"44","name":"Bahamas"},{"val":"48","name":"Bahrain"},{"val":"50","name":"Bangladesh"},{"val":"52","name":"Barbados"},{"val":"112","name":"Belarus"},{"val":"56","name":"Belgium"},{"val":"84","name":"Belize"},{"val":"204","name":"Benin"},{"val":"60","name":"Bermuda"},{"val":"64","name":"Bhutan"},{"val":"68","name":"Bolivia"},{"val":"70","name":"Bosnia and Herzegovina"},{"val":"72","name":"Botswana"},{"val":"76","name":"Brazil"},{"val":"96","name":"Brunei Darussalam"},{"val":"100","name":"Bulgaria"},{"val":"854","name":"Burkina Faso"},{"val":"108","name":"Burundi"},{"val":"116","name":"Cambodia"},{"val":"120","name":"Cameroon"},{"val":"124","name":"Canada"},{"val":"132","name":"Cape Verde"},{"val":"136","name":"Cayman Islands"},{"val":"140","name":"Central African Republic"},{"val":"148","name":"Chad"},{"val":"152","name":"Chile"},{"val":"156","name":"China"},{"val":"170","name":"Colombia"},{"val":"174","name":"Comoros"},{"val":"178","name":"Congo"},{"val":"188","name":"Costa Rica"},{"val":"384","name":"Cote D'Ivoire (Ivory Coast)"},{"val":"191","name":"Croatia (Hrvatska)"},{"val":"192","name":"Cuba"},{"val":"196","name":"Cyprus"},{"val":"203","name":"Czech Republic"},{"val":"208","name":"Denmark"},{"val":"262","name":"Djibouti"},{"val":"212","name":"Dominica"},{"val":"214","name":"Dominican Republic"},{"val":"218","name":"Ecuador"},{"val":"818","name":"Egypt"},{"val":"222","name":"El Salvador"},{"val":"226","name":"Equatorial Guinea"},{"val":"232","name":"Eritrea"},{"val":"233","name":"Estonia"},{"val":"231","name":"Ethiopia"},{"val":"234","name":"Faeroe Islands"},{"val":"238","name":"Falkland Islands (Malvinas)"},{"val":"242","name":"Fiji"},{"val":"246","name":"Finland"},{"val":"250","name":"France"},{"val":"254","name":"French Guiana"},{"val":"258","name":"French Polynesia"},{"val":"266","name":"Gabon"},{"val":"270","name":"Gambia"},{"val":"268","name":"Georgia"},{"val":"276","name":"Germany"},{"val":"288","name":"Ghana"},{"val":"292","name":"Gibraltar"},{"val":"300","name":"Greece"},{"val":"304","name":"Greenland"},{"val":"308","name":"Grenada"},{"val":"312","name":"Guadeloupe"},{"val":"316","name":"Guam"},{"val":"320","name":"Guatemala"},{"val":"322","name":"Guernsey"},{"val":"324","name":"Guinea"},{"val":"624","name":"Guinea Bissau"},{"val":"328","name":"Guyana"},{"val":"332","name":"Haiti"},{"val":"340","name":"Honduras"},{"val":"344","name":"Hong Kong"},{"val":"348","name":"Hungary"},{"val":"352","name":"Iceland"},{"val":"356","name":"India"},{"val":"360","name":"Indonesia"},{"val":"364","name":"Iran"},{"val":"368","name":"Iraq"},{"val":"372","name":"Ireland"},{"val":"374","name":"Isle of Man"},{"val":"376","name":"Israel"},{"val":"380","name":"Italy"},{"val":"388","name":"Jamaica"},{"val":"392","name":"Japan"},{"val":"396","name":"Jersey"},{"val":"400","name":"Jordan"},{"val":"398","name":"Kazakhstan"},{"val":"404","name":"Kenya"},{"val":"296","name":"Kiribati"},{"val":"408","name":"Korea (North)"},{"val":"410","name":"Korea (South)"},{"val":"414","name":"Kuwait"},{"val":"417","name":"Kyrgyzstan"},{"val":"418","name":"Laos P.Dem.R."},{"val":"428","name":"Latvia"},{"val":"422","name":"Lebanon"},{"val":"426","name":"Lesotho"},{"val":"430","name":"Liberia"},{"val":"434","name":"Libyan Arab Jamahiriya"},{"val":"438","name":"Liechtenstein"},{"val":"440","name":"Lithuania"},{"val":"442","name":"Luxembourg"},{"val":"446","name":"Macau"},{"val":"807","name":"Macedonia"},{"val":"450","name":"Madagascar"},{"val":"454","name":"Malawi"},{"val":"458","name":"Malaysia"},{"val":"462","name":"Maldives"},{"val":"466","name":"Mali"},{"val":"470","name":"Malta"},{"val":"584","name":"Marshall Islands"},{"val":"474","name":"Martinique"},{"val":"478","name":"Mauritania"},{"val":"480","name":"Mauritius"},{"val":"175","name":"Mayotte"},{"val":"484","name":"Mexico"},{"val":"583","name":"Micronesia"},{"val":"498","name":"Moldova"},{"val":"492","name":"Monaco"},{"val":"496","name":"Mongolia"},{"val":"74","name":"Montenegro"},{"val":"504","name":"Morocco"},{"val":"508","name":"Mozambique"},{"val":"104","name":"Myanmar"},{"val":"516","name":"Namibia"},{"val":"524","name":"Nepal"},{"val":"528","name":"Netherlands"},{"val":"530","name":"Netherlands Antilles"},{"val":"540","name":"New Caledonia"},{"val":"554","name":"New Zealand"},{"val":"558","name":"Nicaragua"},{"val":"562","name":"Niger"},{"val":"566","name":"Nigeria"},{"val":"580","name":"Northern Mariana Islands"},{"val":"578","name":"Norway"},{"val":"512","name":"Oman"},{"val":"586","name":"Pakistan"},{"val":"275","name":"Palestinian Territory"},{"val":"591","name":"Panama"},{"val":"598","name":"Papua New Guinea"},{"val":"600","name":"Paraguay"},{"val":"604","name":"Peru"},{"val":"608","name":"Philippines"},{"val":"616","name":"Poland"},{"val":"620","name":"Portugal"},{"val":"630","name":"Puerto Rico"},{"val":"634","name":"Qatar"},{"val":"638","name":"Reunion"},{"val":"642","name":"Romania"},{"val":"643","name":"Russian Federation"},{"val":"646","name":"Rwanda"},{"val":"654","name":"Saint Helena"},{"val":"659","name":"Saint Kitts and Nevis"},{"val":"662","name":"Saint Lucia"},{"val":"670","name":"Saint Vincent and The Grenadines"},{"val":"882","name":"Samoa"},{"val":"674","name":"San Marino"},{"val":"678","name":"Sao Tome and Principe"},{"val":"682","name":"Saudi Arabia"},{"val":"686","name":"Senegal"},{"val":"891","name":"Serbia"},{"val":"690","name":"Seychelles"},{"val":"694","name":"Sierra Leone"},{"val":"702","name":"Singapore"},{"val":"703","name":"Slovakia"},{"val":"705","name":"Slovenia"},{"val":"90","name":"Solomon Islands"},{"val":"706","name":"Somalia"},{"val":"710","name":"South Africa"},{"val":"724","name":"Spain"},{"val":"144","name":"Sri Lanka"},{"val":"736","name":"Sudan"},{"val":"740","name":"Suriname"},{"val":"748","name":"Swaziland"},{"val":"752","name":"Sweden"},{"val":"756","name":"Switzerland"},{"val":"760","name":"Syrian Arab Rep."},{"val":"158","name":"Taiwan"},{"val":"762","name":"Tajikistan"},{"val":"834","name":"Tanzania"},{"val":"764","name":"Thailand"},{"val":"626","name":"Timor-Leste"},{"val":"768","name":"Togo"},{"val":"776","name":"Tonga"},{"val":"780","name":"Trinidad and Tobago"},{"val":"788","name":"Tunisia"},{"val":"792","name":"Turkey"},{"val":"795","name":"Turkmenistan"},{"val":"796","name":"Turks and Caicos Islands"},{"val":"800","name":"Uganda"},{"val":"804","name":"Ukraine"},{"val":"784","name":"United Arab Emirates"},{"val":"826","name":"United Kingdom"},{"val":"840","name":"United States"},{"val":"581","name":"United States Minor Outlying Islands"},{"val":"858","name":"Uruguay"},{"val":"860","name":"Uzbekistan"},{"val":"548","name":"Vanuatu"},{"val":"336","name":"Vatican City State (Holy See)"},{"val":"862","name":"Venezuela"},{"val":"704","name":"Vietnam"},{"val":"92","name":"Virgin Islands (British)"},{"val":"850","name":"Virgin Islands (US)"},{"val":"732","name":"Western Sahara"},{"val":"887","name":"Yemen"},{"val":"894","name":"Zambia"},{"val":"716","name":"Zimbabwe"}]
});
*/
/* Industry */
/*
FT._ads.registrationWidget.init({
  name: "industry",
  options:[{"val":"-1","name":"Select your industry"},{"val":"1","name":"Accountancy &amp; tax advisory"},{"val":"27","name":"Aerospace &amp; defence"},{"val":"28","name":"Automobiles"},{"val":"2","name":"Banking"},{"val":"29","name":"Basic resources/mining"},{"val":"12","name":"Chemicals"},{"val":"4","name":"Comms/Publishing/Media"},{"val":"10","name":"Consulting/business services"},{"val":"6","name":"Education/Academia"},{"val":"26","name":"Energy/utilities"},{"val":"15","name":"Engineering/construction"},{"val":"3","name":"Financial services"},{"val":"31","name":"Food &amp; beverages"},{"val":"32","name":"Fund/asset management"},{"val":"5","name":"Govt/public service/NGO"},{"val":"30","name":"Health &amp; pharmaceuticals"},{"val":"7","name":"IT/computing"},{"val":"9","name":"Industrial goods &amp; services"},{"val":"33","name":"Insurance"},{"val":"17","name":"Legal services"},{"val":"18","name":"Personal &amp; household goods"},{"val":"23","name":"Property"},{"val":"34","name":"Retail"},{"val":"8","name":"Telecommunications"},{"val":"13","name":"Transport/logistics"},{"val":"14","name":"Travel &amp; leisure"}]
});
*/
/* Position */
/*
FT._ads.registrationWidget.init({
  name: "position",
  options:[{"val":"-1","name":"Select your position"},{"val":"25","name":"Analyst"},{"val":"24","name":"Associate"},{"val":"19","name":"Business School Academic"},{"val":"2","name":"CEO/president/Chairman"},{"val":"11","name":"Consultant"},{"val":"7","name":"Exec Mgmt (EVP/SVP/MD)"},{"val":"18","name":"MBA Student"},{"val":"6","name":"Manager/Supervisor"},{"val":"3","name":"Other C Level (CFO/COO/CIO/CMO)"},{"val":"1","name":"Owner/Partner/Proprietor"},{"val":"12","name":"Professional"},{"val":"23","name":"Programme/Project Manager"},{"val":"14","name":"Secretary/Treasurer"},{"val":"15","name":"Senior Manager/Dept Head"},{"val":"8","name":"Technical/Business Specialist"},{"val":"5","name":"VP/Director"}]
});
*/
/* Responsibility */
/*
FT._ads.registrationWidget.init({
  name: "responsibility",
  options:[{"val":"-1","name":"Select your responsibility"},{"val":"1","name":"Accounting/finance"},{"val":"7","name":"Administration"},{"val":"19","name":"Broker/trader"},{"val":"26","name":"Buying/procurement"},{"val":"13","name":"General management"},{"val":"6","name":"HR/Training"},{"val":"10","name":"IFA/financial adviser"},{"val":"25","name":"Information technology"},{"val":"27","name":"Knowledge management"},{"val":"4","name":"Legal/company secretarial"},{"val":"2","name":"Marketing/communications/PR"},{"val":"20","name":"Money/portfolio management"},{"val":"28","name":"Operations"},{"val":"21","name":"Private Investor"},{"val":"29","name":"Product mgmt/development"},{"val":"12","name":"Research/analysis"},{"val":"23","name":"Retired"},{"val":"30","name":"Risk management/compliance"},{"val":"15","name":"Sales/business development"},{"val":"3","name":"Strategy/planning"},{"val":"24","name":"Student"}]
});
*/
/* Monkey */
/*
FT._ads.registrationWidget.init({
  name: "monkey"
  options: [{val: "-1", name: "Please select your favourite monkey"}, {val: "1", name: "marmoset"}, {val: "2", name: "tamarin"}, {val: "3", name: "capuchin"}, {val: "4", name: "squirrel"}, {val: "5", name: "owl"}, {val: "6", name: "titis"}, {val: "7", name: "sakis"}, {val: "8", name: "uakaris"}, {val: "9", name: "howler"}, {val: "10", name: "spider"}, {val: "11", name: "woolly"}],
  header: "Help us discover the most popular Monkey",
  paragraph: "Like everyone else here at FT.com we love monkeys, but with so many awesome species how do we know which is best, we tried to setup a fight to the death tornament but Peta went CRAZY!!"
});
*/
