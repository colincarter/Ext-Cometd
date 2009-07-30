(function() {

  Ext.ns('Ext.ux');

  org.cometd.JSON.toJSON = Ext.encode;
  org.cometd.JSON.fromJSON = Ext.decode;

  org.cometd.AJAX.send = function(packet) {
    Ext.Ajax.on('beforerequest', function(conn, options) {
      _setHeaders(conn, packet.headers);
      return true;
    }, this);
    
    var transportType = packet.transport.getType();
    if (transportType == 'long-polling') {
      var async = Ext.Ajax.request({
        url: packet.url,
        method: 'POST',
        jsonData: packet.body,
        headers: {'contentType': 'text/json;charset=UTF-8'},
        success: function(response, options) {
          packet.onSuccess(Ext.decode(response.responseText), options);
        },
        failure: function(response, options) {packet.onError();}
      });

      return async.conn;
    }
    else if (transportType === 'callback-polling') {
      return Ext.ux.JSONP.request(packet.url, {
        callbackKey: 'jsoncallback',
        params: {message: packet.body},
        callback: packet.onSuccess,
        failure: function(response, options) {packet.onError();}
      });
    }
  };

  function _setHeaders(conn, headers) {
    if (headers) {
      if (!Ext.Ajax.defaultHeaders) {
        Ext.Ajax.defaultHeaders = {};
      }

      for (var headerName in headers) {
        if (headerName.toLowerCase() === 'content-type') {
          continue;
        }

        Ext.Ajax.defaultHeaders.headerName = headers[headerName];
      }

    }
  }


  Ext.ux.Cometd = new org.cometd.Cometd();

})();
