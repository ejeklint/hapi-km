# hapi-km
[Hapi](http://hapijs.com) plugin wrapping [kilometer.io](http://kilometer.io)'s CURL api.

Installation:

`npm install --save hapi-km`

Example usage:

```js
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
```

## `trackIdentifiedEvent(options, [callback])`
Tracks an identified event at kilometer.io.

- `options` An object with the following keys
    - `user_id` A kilometer.io user id
    - `event_name` The name of the event_name
    - `event_properties` An object with one or more properties
        - `event_property` A property on the event_property
        - `event_property_2` Yet a property (opt.)

## `setUserProperty`

## `increaseUserProperty`

## `decreaseUserProperty`
