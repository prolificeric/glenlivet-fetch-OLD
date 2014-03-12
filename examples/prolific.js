var glenlivet = require('glenlivet');
var prolific = glenlivet.createBarrel({});
var fetch = require('../lib/fetch');

prolific.plugins.register(fetch);

prolific.createBottle('instancesOf', {
	fetch: {
		uri: 'http://www.prolificinteractive.com:page'
	}
}).plugin(function () {
	this.hooks.after('fetch', function (result) {
		var body = result.fetch.response.body;
		var instances = (body && body.match(new RegExp(result.word, 'gi'))) || [];
		result.count = instances.length;
	});
});

prolific.bottles.instancesOf.fetch({
	word: 'prolific',
	fetch: { page: '/about' }
}, function (result) {
	console.log(
		'Instances of "%s" within %s: %s', 
		result.word,
		result.fetch.requestOptions.uri,
		result.count
	);
});