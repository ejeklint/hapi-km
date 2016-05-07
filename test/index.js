'use strict';

const Lab = require('lab');
const Hapi = require('hapi');
const Code = require('code');
const nock = require('nock');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

let server = new Hapi.Server({
    debug: false
});

server.connection();

before((done) => {

    server.register({
        register: require('../lib'),
        options: {
            app_id: 'secret-app-id'
        }
    }, (err) => {

        expect(err).to.not.exist();

        expect(server.methods.km.trackIdentifiedEvent).to
            .exist();
        expect(server.methods.km.setUserProperty).to.exist();
        expect(server.methods.km.increaseUserProperty)
            .to.exist();
        expect(server.methods.km.decreaseUserProperty)
            .to.exist();

        done();
    });

});


after((done) => {

    server = null;
    done();

});


it('throws with options not set', (done) => {

    try {

        server.methods.km.trackIdentifiedEvent();
        throw ('this should not happen');

    } catch (err) {

        expect(err).to.exist();
        done();

    }

});

it('throws with options.user_id not set', (done) => {

    try {

        server.methods.km.trackIdentifiedEvent({
            some_id: 'abcd1234'
        });
        throw ('this should not happen');

    } catch (err) {

        expect(err).to.exist();
        done();

    }

});

it('tracks an event with callback', (done) => {

    nock('http://events.kilometer.io')
        .post('/events', {
            user_id: 'larry_potter',
            event_name: 'a_test_event',
            event_properties: {
                event_property: 'value'
            }
        })
        .reply(200, 'ok');

    server.methods.km.trackIdentifiedEvent({
        user_id: 'larry_potter',
        event_name: 'a_test_event',
        event_properties: {
            event_property: 'value'
        }
    }, (err, res) => {
        expect(err).to.not.exist();
        expect(res.statusCode).to.equal(200);

        done();
    });

});

it('tracks an event without callback', (done) => {

    nock('http://events.kilometer.io')
        .post('/events', {
            user_id: 'larry_potter',
            event_name: 'a_test_event',
            event_properties: {
                event_property: 'value'
            }
        })
        .reply(200, 'ok');

    server.methods.km.trackIdentifiedEvent({
        user_id: 'larry_potter',
        event_name: 'a_test_event',
        event_properties: {
            event_property: 'value'
        }
    });

    done();

});

it('sets a user property', (done) => {

    nock('http://events.kilometer.io')
        .put('/users/larry_potter/properties', {
            test_amount: '42'
        })
        .reply(200, 'ok');

    server.methods.km.setUserProperty({
        user_id: 'larry_potter',
        properties: {
            test_amount: '42'
        }
    }, (err, res) => {
        expect(err).to.not.exist();
        expect(res.statusCode).to.equal(200);

        done();
    });

});

it('sets a user property without a callback', (done) => {

    nock('http://events.kilometer.io')
        .put('/users/larry_potter/properties', {
            test_amount: '42'
        })
        .reply(200, 'ok');

    server.methods.km.setUserProperty({
        user_id: 'larry_potter',
        properties: {
            test_amount: '42'
        }
    });

    done();

});

it('increases a user property', (done) => {

    nock('http://events.kilometer.io')
        .post('/users/larry_potter/properties/test_amount/increase/11')
        .reply(200, 'ok');

    server.methods.km.increaseUserProperty({
        user_id: 'larry_potter',
        property: 'test_amount',
        value: '11'
    }, (err, res) => {
        expect(err).to.not.exist();
        expect(res.statusCode).to.equal(200);

        done();
    });

});

it('increases a user property without a callback', (done) => {

    nock('http://events.kilometer.io')
        .post('/users/larry_potter/properties/test_amount/increase/1')
        .reply(200, 'ok');

    server.methods.km.increaseUserProperty({
        user_id: 'larry_potter',
        property: 'test_amount',
        value: '1'
    });

    done();

});

it('decreases a user property', (done) => {

    nock('http://events.kilometer.io')
        .post('/users/larry_potter/properties/test_amount/decrease/1')
        .reply(200, 'ok');

    server.methods.km.decreaseUserProperty({
        user_id: 'larry_potter',
        property: 'test_amount',
        value: '1'
    }, (err, res) => {
        expect(err).to.not.exist();
        expect(res.statusCode).to.equal(200);

        done();
    });

});

it('decreases a user property without a callback', (done) => {

    nock('http://events.kilometer.io')
        .post('/users/larry_potter/properties/test_amount/decrease/1')
        .reply(200, 'ok');

    server.methods.km.decreaseUserProperty({
        user_id: 'larry_potter',
        property: 'test_amount',
        value: '1'
    });

    done();

});
