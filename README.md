# glenlivet-fetch

Insert the results of HTTP requests into [Glenlivet](https://github.com/prolificeric/glenlivet) processing workflows.

## Installation

	npm install glenlivet-fetch

## Usage

```javascript
var glenlivet = require('glenlivet');
var Bottle = glenlivet.Bottle;

glenlivet.plugin.register(require('glenlivet-fetch'));

var getProlificHome = new Bottle({
	fetch: {
		uri: 'http://www.prolificinteractive.com'
	}
});

getProlificHome.hooks.after('fetch', function (result) {
	result.fetch.nmrChars = result.fetch.body.length;
});

getProlificHome.fetch(function (result) {
	//Use the result somehow
});
```

## HTTP Methods

You can specify GET, POST, PUT, and DELETE methods.

Example:

```javascript
var bottle = new Bottle({
	fetch: {
		method: 'POST',
		bodyType: 'form', //"form" or "json". Defaults to "form".
		uri: 'http://www.prolificinteractive.com/form'
	}
}
})
```

For PUT and POST requests, `bodyType` will specify if the body is serialized as json or form data.

## Request Parameters

You can specify various request parameters, which will automatically get mapped to the request.

Example:

```javascript
var bottle = new Bottle({
	fetch: {
		method: 'POST',
		uri: 'http://www.prolificinteractive.com/forms/:form',
		params: {
			form: {
				type: 'uri',
				default: 'contact'
			},
			message: {
				type: 'body'
			},
			callback_url: {
				type: 'query'
			},
			referer: {
				type: 'header',
				default: 'http://www.prolificinteractive.com/form'
			}
		}
	}
});
```