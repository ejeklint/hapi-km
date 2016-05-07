'use strict';

const Hoek = require('hoek');
const Wreck = require('wreck');

let _kilometer_app_id;

// Sending 'identified events'
const track_identified_event = (options, callback) => {
    Hoek.assert(options, 'Required options object is missing');
    Hoek.assert(options.user_id,
        'Required kilometer.io user_id is missing');
    Hoek.assert(options.event_name,
        'Required kilometer.io event_name is missing');
    Hoek.assert(options.event_properties,
        'Required kilometer.io event_properties is missing');

    options.event_type = 'identified';

    Wreck.post('http://events.kilometer.io/events', {
        payload: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json',
            'Customer-App-Id': _kilometer_app_id,
            'Timestamp': Date.now()
        }
    }, (err, res, payload) => {

        if (callback && typeof(callback) === 'function') {
            callback(err, res);
        }

    });
};

// Setting user property
const set_user_property = (options, callback) => {
    Hoek.assert(options, 'Required options object is missing');
    Hoek.assert(options.user_id,
        'Required kilometer.io user_id is missing');
    Hoek.assert(options.properties,
        'Required kilometer.io properties is missing');

    Wreck.put('http://events.kilometer.io/users/' + options.user_id +
        '/properties', {
            payload: JSON.stringify(options.properties),
            headers: {
                'Content-Type': 'application/json',
                'Customer-App-Id': _kilometer_app_id,
                'Timestamp': Date.now()
            }
        }, (err, res, payload) => {

            if (callback && typeof(callback) === 'function') {
                callback(err, res);
            }

        });
};

// Increase a user property with given amount
const increase_user_property = (options, callback) => {
    Hoek.assert(options, 'Required options object is missing');
    Hoek.assert(options.user_id,
        'Required kilometer.io user_id is missing');
    Hoek.assert(options.property,
        'Required kilometer.io options.property is missing');
    Hoek.assert(options.value,
        'Required kilometer.io options.value is missing');

    Wreck.post('http://events.kilometer.io/users/' + options.user_id +
        '/properties/' + options.property + '/increase/' +
        options.value, {
            headers: {
                'Content-Type': 'application/json',
                'Customer-App-Id': _kilometer_app_id,
                'Timestamp': Date.now()
            }
        }, (err, res, payload) => {

            if (callback && typeof(callback) === 'function') {
                callback(err, res);
            }

        });
};

// Decrease a property by given amount
const decrease_user_property = (options, callback) => {
    Hoek.assert(options, 'Required options object is missing');
    Hoek.assert(options.user_id,
        'Required kilometer.io user_id is missing');
    Hoek.assert(options.property,
        'Required kilometer.io options.property is missing');
    Hoek.assert(options.value,
        'Required kilometer.io options.value is missing');

    Wreck.post('http://events.kilometer.io/users/' + options.user_id +
        '/properties/' + options.property + '/decrease/' +
        options.value, {
            headers: {
                'Content-Type': 'application/json',
                'Customer-App-Id': _kilometer_app_id,
                'Timestamp': Date.now()
            }
        }, (err, res, payload) => {

            if (callback && typeof(callback) === 'function') {
                callback(err, res);
            }

        });
};

exports.register = function(server, options, next) {
    Hoek.assert(options, 'Required options object is missing');
    Hoek.assert(options.app_id, 'Required kilometer.io app_id is missing');

    _kilometer_app_id = options.app_id;

    server.method([{
        name: 'km.trackIdentifiedEvent',
        method: track_identified_event,
        options: {}
    }, {
        name: 'km.setUserProperty',
        method: set_user_property,
        options: {}
    }, {
        name: 'km.increaseUserProperty',
        method: increase_user_property,
        options: {}
    }, {
        name: 'km.decreaseUserProperty',
        method: decrease_user_property,
        options: {}
    }]);

    // Setting 'User properties'
    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
