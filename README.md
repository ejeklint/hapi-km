# hapi-km
[Hapi](http://hapijs.com) plugin wrapping [kilometer.io](http://kilometer.io)'s cURL api for easy access within the server. On successful registration, four new methods will be available on the server.methods object.

Why cURL? Because kilometer.io's doesn't provide a JS library suitable for server side use.

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

## Methods

### `trackIdentifiedEvent(options, [callback])`
Tracks an identified event at kilometer.io.

- `options` An object with the following keys:
    - `user_id` A kilometer.io user id
    - `event_name` The name of the event_name
    - `event_properties` An object with one or more properties
        - `event_property` A property on the event_property
        - `event_property_2` Yet a property (opt.)
- `callback` A optional function with signature `function(err, res)` with status of the call to kilometer.io.

### `setUserProperty(options, [callback])`
Sets one or more user properties.

- `options` An object with one or more properties and their values:
    - `foo_property`
    - `bar_property`
- `callback` A optional function with signature `function(err, res)` with status of the call to kilometer.io.

### `increaseUserProperty(options, [callback])`
Increases the value of a property.

- `options` An object with one property and a numerical value to increase it with:
    - `foo_property`
- `callback` A optional function with signature `function(err, res)` with status of the call to kilometer.io.

### `decreaseUserProperty(options, [callback])`
Decreases the value of a property.

- `options` An object with one property and a numerical value to decrease it with:
    - `foo_property`
- `callback` A optional function with signature `function(err, res)` with status of the call to kilometer.io.
