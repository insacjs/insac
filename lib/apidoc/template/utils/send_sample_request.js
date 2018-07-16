define([
  'jquery',
  'lodash'
], function($, _) {

  var initDynamic = function() {
      // Button send
      $(".sample-request-send").off("click");
      $(".sample-request-send").on("click", function(e) {
          e.preventDefault();
          var $root = $(this).parents("article");
          var group = $root.data("group");
          var name = $root.data("name");
          var version = $root.data("version");
          sendSampleRequest(group, name, version, $(this).data("sample-request-type"));
      });

      // Button clear
      $(".sample-request-clear").off("click");
      $(".sample-request-clear").on("click", function(e) {
          e.preventDefault();
          var $root = $(this).parents("article");
          var group = $root.data("group");
          var name = $root.data("name");
          var version = $root.data("version");
          clearSampleRequest(group, name, version);
      });
  }; // initDynamic

  function sendSampleRequest(group, name, version, type)
  {
      var $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

      // Optional header
      var header = {};
      $root.find(".sample-request-header").each(function(i, element) {
          var group = $(element).data("sample-request-header-group-id");
          $root.find("[data-sample-request-header-group=\"" + group + "\"]").each(function(i, element) {
            var key = $(element).data("sample-request-header-name");
            var value = element.value;
            if ( ! element.optional && element.defaultValue !== '') {
                value = element.defaultValue;
            }
            header[key] = value;
          });
      });

      // create JSON dictionary of parameters
      var param = {};
      var paramType = {};
      $root.find(".sample-request-param").each(function(i, element) {
          var group = $(element).data("sample-request-param-group-id");
          $root.find("[data-sample-request-param-group=\"" + group + "\"]").not(function() {
            return $(this).val() == "" && $(this).is("[data-sample-request-param-optional='true']");
          }).each(function(i, element) {
            var key = $(element).data("sample-request-param-name");
            var value = element.value;
            if ( ! element.optional && element.defaultValue !== '') {
                value = element.defaultValue;
            }
            param[key] = value;
            paramType[key] = $(element).next().text();
          });
      });

      // grab user-inputted URL
      var url = $root.find(".sample-request-url").val();

      // Insert url parameter
      var pattern = pathToRegexp(url, null);
      var matches = pattern.exec(url);
      for (var i = 1; i < matches.length; i++) {
          var key = matches[i].substr(1);
          if (param[key] !== undefined) {
              url = url.replace(matches[i], encodeURIComponent(param[key]));

              // remove URL parameters from list
              delete param[key];
          }
      } // for

      $root.find(".sample-request-response").fadeTo(250, 1);
      $root.find(".sample-request-response-json").html("Loading...");
      refreshScrollSpy();

      _.each( param, function( val, key ) {
          var t = paramType[ key ].toLowerCase();
          try {
              param[ key ] = parseValue(t, val)
          } catch (e) {}
      });

      for (let prop in param) {
        if (url.indexOf(':' + prop) !== 0) {
          url.replace(':' + prop, param[prop])
        }
      }

      param = type === 'get' ? param : JSON.stringify(param)

      // send AJAX request, catch success or error callback
      var ajaxRequest = {
          url        : url,
          headers    : header,
          data       : param,
          contentType: "application/json",
          dataType   : "json",
          type       : type.toUpperCase(),
          success    : displaySuccess,
          error      : displayError
      };

      $.ajax(ajaxRequest);

      function displaySuccess(data, status, jqXHR) {
          var jsonResponse;
          try {
              jsonResponse = JSON.parse(jqXHR.responseText);
              jsonResponse = JSON.stringify(jsonResponse, null, 4);
          } catch (e) {
              jsonResponse = data;
          }
          $root.find(".sample-request-response-json").html(jsonResponse);
          refreshScrollSpy();
      };

      function displayError(jqXHR, textStatus, error) {
          var message = "Error " + jqXHR.status + ": " + error;
          var jsonResponse;
          try {
              jsonResponse = JSON.parse(jqXHR.responseText);
              jsonResponse = JSON.stringify(jsonResponse, null, 4);
          } catch (e) {
              jsonResponse = escape(jqXHR.responseText);
          }

          if (jsonResponse)
              message += "<br>" + jsonResponse;

          // flicker on previous error to make clear that there is a new response
          if($root.find(".sample-request-response").is(":visible"))
              $root.find(".sample-request-response").fadeTo(1, 0.1);

          $root.find(".sample-request-response").fadeTo(250, 1);
          $root.find(".sample-request-response-json").html(message);
          refreshScrollSpy();
      };
  }

  function parseValue (type, value) {
    type = type.toUpperCase()
    if (type === 'STRING')   { return (value + '') }
    if (type === 'TEXT')     { return (value + '') }
    if (type === 'ENUM')     { return (value + '') }
    if (type === 'INTEGER')  { return parseInt(value + '') }
    if (type === 'FLOAT')    { return parseFloat(value + '') }
    if (type === 'BOOLEAN')  { return (value === '1' || value === 'true') }
    if (type === 'DATE')     { return new Date(Date.parse(value + '')) }
    if (type === 'DATEONLY') { return (value + '') }
    if (type === 'TIME')     { return (value + '') }
    if (type === 'JSON')     { return JSON.parse(value + '') }
    if (type === 'JSONB')    { return JSON.parse(value + '') }
    if (type === 'OBJECT')   { return JSON.parse(value + '') }
    if (type === 'UUID')     { return (value + '') }
    if (type.endsWith('[]')) {
      type = type.substr(0, type.length - 2)
      value = value.substr(1, value.length - 2).toString().split(',')
      const values = []
      if (type === 'STRING')   for (let i in value) { values.push((value[i] + '')) }
      if (type === 'TEXT')     for (let i in value) { values.push((value[i] + '')) }
      if (type === 'ENUM')     for (let i in value) { values.push((value[i] + '')) }
      if (type === 'INTEGER')  for (let i in value) { values.push(parseInt(value[i]) + '') }
      if (type === 'FLOAT')    for (let i in value) { values.push(parseFloat(value[i] + '')) }
      if (type === 'BOOLEAN')  for (let i in value) { values.push((value[i] === '1' || value[i] === 'true')) }
      if (type === 'DATE')     for (let i in value) { values.push(new Date(Date.parse(value[i] + ''))) }
      if (type === 'DATEONLY') for (let i in value) { values.push((value[i] + '')) }
      if (type === 'TIME')     for (let i in value) { values.push((value[i] + '')) }
      if (type === 'JSON')     for (let i in value) { values.push(JSON.parse(value[i] + '')) }
      if (type === 'JSONB')    for (let i in value) { values.push(JSON.parse(value[i] + '')) }
      if (type === 'OBJECT')   for (let i in value) { values.push(JSON.parse(value[i] + '')) }
      if (type === 'UUID')     for (let i in value) { values.push((value[i] + '')) }
      return values
    }
    return value
  }

  function clearSampleRequest(group, name, version)
  {
      var $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

      // hide sample response
      $root.find(".sample-request-response-json").html("");
      $root.find(".sample-request-response").hide();

      // reset value of parameters
      $root.find(".sample-request-param").each(function(i, element) {
          element.value = "";
      });

      // restore default URL
      var $urlElement = $root.find(".sample-request-url");
      $urlElement.val($urlElement.prop("defaultValue"));

      refreshScrollSpy();
  }

  function refreshScrollSpy()
  {
      $('[data-spy="scroll"]').each(function () {
          $(this).scrollspy("refresh");
      });
  }

  function escapeHtml(str) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
  }

  /**
   * Exports.
   */
  return {
      initDynamic: initDynamic
  };

});