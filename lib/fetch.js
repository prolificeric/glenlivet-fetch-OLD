var _ = require('lodash');
var request = require('request');

module.exports = fetch;

function fetch (context) {
    context.is('Bottle', function (bottle, fetchConfig) {
        _.defaults(fetchConfig, {
            params: {}
        });

        bottle.hooks.add({
            fetch: {
                request: {
                    method: {},
                    uri: {},
                    query: {},
                    body: {},
                    headers: {}
                }
            }
        });

        //Return a filtered map of params
        function getParamsByType (params, type) {
            var filtered = {};

            _.each(params, function (param, name) {
                if (param.type === type) {
                    filtered[name] = param;
                }
            });

            return filtered;
        }

        //Add requestOptions object if not directly passed
        bottle.hooks.before('fetch:request', function (decorator) {
            decorator.fetch.requestOptions = decorator.fetch.requestOptions || {};
        });

        //Pass requestOptions to request library and handle results
        bottle.hooks.when('fetch', function (decorator, next, done) {
            request(decorator.fetch.requestOptions, function (error, response, body) {
                decorator.fetch.error = error;
                decorator.fetch.response = response;
                decorator.fetch.body = body;

                if (error) {
                    bottle.emit('fetch:error', decorator, done);
                    return;
                }

                next();
            });
        });

        //Set the request method
        bottle.hooks.when('fetch:request:method', function (decorator) {
            decorator.fetch.requestOptions.method = fetchConfig.method || 'GET';
        });

        //Build the URI
        bottle.hooks.when('fetch:request:uri', function (decorator) {
            if (decorator.fetch.requestOptions.uri) return; //Allow override

            var requestOptions = decorator.fetch.requestOptions;
            var uri = fetchConfig.uri;
            var keys = uri.match(/:[a-zA-Z_]+/g) || [];
            var params = getParamsByType(fetchConfig.params, 'uri');

            _.each(keys, function (key) {
                var name = key.substr(1);
                var val;

                val = decorator.fetch[name] || (params[name] && params[name].default) || '';
                uri = uri.replace(new RegExp(key), val);
            });

            requestOptions.uri = uri;
        });

        //Build the query string
        bottle.hooks.when('fetch:request:uri', function (decorator) {
            var requestOptions = decorator.fetch.requestOptions;
            var params = getParamsByType(fetchConfig.params, 'query');
            var qs = requestOptions.qs = requestOptions.qs || {};

            _.each(params, function (param, key) {
                var val = decorator.fetch[key] || param.default || '';

                if (!qs[key]) {
                    qs[key] = val;
                }
            });
        });

        //Build the body; accepts both json and form bodies
        var hasBody = fetchConfig.method && ['POST', 'PUT', 'PATCH'].indexOf(fetchConfig.method.toUpperCase()) > -1;

        hasBody && bottle.hooks.when('fetch:request:body', function (decorator) {
            var bodyType = fetchConfig.bodyType || 'form';
            var requestOptions = decorator.fetch.requestOptions;
            var params = getParamsByType(fetchConfig.params, 'body');
            var body = requestOptions[bodyType] = requestOptions[bodyType] || {};

            _.each(params, function (param, key) {
                var val = decorator.fetch[key] || param.default || '';

                if (!body[key]) {
                    body[key] = val;
                }
            });
        });

        //Build the header
        bottle.hooks.when('fetch:request:headers', function (decorator) {
            var requestOptions = decorator.fetch.requestOptions;
            var params = getParamsByType(fetchConfig.params, 'header');
            var headers = requestOptions.headers = requestOptions.headers || {};

            _.each(params, function (param, key) {
                var val = decorator.fetch[key] || param.default || '';

                if (!headers[key]) {
                    headers[key] = val;
                }
            });
        });
    });
}