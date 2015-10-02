var Hapi   = require('hapi');
var Inert  = require('inert');
var Joi    = require('joi');
var Vision = require('vision');
var server = new Hapi.Server({ debug: {"request": ["error", "uncaught"]} })

var register_fields = {
  name  : Joi.string().alphanum().min(1).required(),
  email : Joi.string().email().required()
};
console.log(' - - - - - - - - - - - - - - - - - ');
console.log(register_fields);
console.log(' - - - - - - - - - - - - - - - - - ');

/**
 * extract_validation_error does what its name suggests
 * given that the error is not in a very useable format we
 * need to extract it into a simple set of key:value pairs
 * @param {Object} error see: http://git.io/vcwiU
 * @returns {Object} err - the simplified error object
 */
function extract_validation_error(error){
  var key = error.data.details[0].path;
  // console.log(' >> '+key);
  err = {}
  err[key] = {
    class   : 'input-error',
    message : error.data.details[0].message
  }
  return err;
}

function return_values(error) {
  var values;
  if(error.data && error.data._object) { // see: http://git.io/vciZd
    values = {};
    var keys = Object.keys(error.data._object)
    keys.forEach(function(k){
      values[k] = error.data._object[k];
    });
  }
  return values;
}

function register_handler(request, reply, source, error) {
  var err, values;
  if(error && error.data) {
    console.log(JSON.stringify(error, null, 2));
    err = extract_validation_error(error);
    console.log(err);
    values = return_values(error);
    console.log(values);
  }
  return reply.view('index', {
      title: 'examples/views/handlebars/basic.js | Hapi ' + request.server.version,
      message: 'Hello World!',
      name: 'jim',
      error: err,
      values: values
  });
}

server.connection({ port: process.env.PORT || 8000 });
server.register([Vision, Inert], function (err) {
  if (err) { console.error('Failed to load plugin: ', err); }

  server.views({
      engines: { html: require('handlebars') },
      path: __dirname +'/'
  });

  // console.log(__dirname + '/index.html');
  server.route([{
    method: 'GET',
    path: '/',
    handler: register_handler
  },
  {
    method: '*',
    path: '/register',
    config: {
      validate: {
        payload : register_fields,
        failAction: register_handler
      }
    },
    handler: register_handler
  }]);
});

server.start(function() {
  console.log('Visit: http://127.0.0.1:'+server.info.port);
});
