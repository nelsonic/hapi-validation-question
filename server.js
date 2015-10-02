var Hapi   = require('hapi');
var Inert  = require('inert');
var Joi    = require('joi');
var Vision = require('vision');
var server = new Hapi.Server({ debug: {"request": ["error", "uncaught"]} })

var register_fields = {
  name  : Joi.string().alphanum().min(1).required(),
  email : Joi.string().email().required()
};

function extract_validation_error(error){
  var key = error.data.details.path;
  var err = {
    key : 'input-error',
    message : error.data.details[0].message
  }
  return err;
}

function register_handler(request, reply, source, error) {
  if(error && error.data) {
    console.log(request.payload);
    console.log(' - - - - - - - - - - - - - - - - - - - - -');
    console.log(source)
    console.log(' - - - - - - - - - - - - - - - - - - - - -');
    console.log(JSON.stringify(error, null, 2))

    console.log(error.data.details);
    var err = extract_validation_error(error);
    console.log(err);
  }
    return reply.view('index', {
        title: 'examples/views/handlebars/basic.js | Hapi ' + request.server.version,
        message: 'Hello World!',
        name: "Jim"
    });
  //
  // else {
  //   return reply('welcome!');
  // }
}

server.connection({ port: process.env.PORT || 8000 });
server.register([Vision, Inert], function (err) {
  if (err) { console.error('Failed to load plugin: ', err); }

  server.views({
      engines: { html: require('handlebars') },
      path: __dirname
  });

  // console.log(__dirname + '/index.html');
  server.route([{
    method: 'GET',
    path: '/',
    handler: {
        file: __dirname + '/index.html'
    }
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
