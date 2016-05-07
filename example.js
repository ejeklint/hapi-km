'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register({
    register: require('hapi-km'),
    options: {
        app_id: require('./config').kilometerAppId
    }
}, (err) => {

    // Oops
});

// An example route using the plugin
server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, reply) => {
        request.server.methods.km.trackIdentifiedEvent({
            user_id: 'larry_potter',
            event_name: 'some_event',
            event_properties: {
                event_property: 'some_property'
            }
        }, (err, res) => {

            // This callback is optional

            if (err) {
                throw (err);
            }

            if (res.statusCode >= 400) {
                console.log(res.statusMessage);
            }

            reply('hello there');
        });

    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
