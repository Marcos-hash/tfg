module.exports = {
	globDirectory: './src/main/resources/static/',
	globPatterns: [
		'**/*.{txt,html,jpg,png,js,json,css}'
	],
	swDest: 'src/main/resources/static/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};