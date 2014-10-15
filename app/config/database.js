var setupWaterline = require('./waterline');

setupWaterline({
  adapters: {
    'sails-disk': require('sails-disk')
  },
  collections: {
    user: {
      connection: 'tmp',
      attributes: {}
    }
  },
  connections: {
    tmp: {
      adapter: 'sails-disk'
    }
  }
}, function waterlineReady(err, ontology) {
  if (err)
    throw err;
  console.log(ontology.collections);
  console.log(ontology.connections);
  // Our collections (i.e. models):
  ontology.collections;

  // Our connections (i.e. databases):
  ontology.connections;

});