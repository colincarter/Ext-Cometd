Ext.onReady(function() {

  var cometd = Ext.ux.Cometd;

  var cometURL = 'http://localhost/cometd';

  cometd.configure({
      url: cometURL,
      logLevel: 'debug'
  });

  cometd.addListener('/meta/connect', _onConnect);

  cometd.handshake();

  var _connected = false;
  function _onConnect(message)
  {
      var wasConnected = _connected;
      _connected = message.successful;
      if (!wasConnected && _connected)
      {
          Ext.get('body').update('Ext Cometd Configured Successfully');
      }
  };

});

