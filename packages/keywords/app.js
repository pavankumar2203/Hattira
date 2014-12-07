'use strict';

var Module = require('meanio').Module;

var Keywords = new Module('keywords');

Keywords.register(function(app, auth, database) {
  Keywords.routes(app, auth, database);

  Keywords.aggregateAsset('css', 'keywords.css');

  return Keywords;
});
