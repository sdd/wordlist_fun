var	_            = require('lodash'),
	Promise      = require('bluebird'),
	fs           = Promise.promisifyAll(require('fs')),
	circularJSON = require('circular-json'),
	readWordList = require('./readWordList'),
	siblingGraph = require('./siblingGraph');
require('colors');

var longest = require('./algorithms/longest/alternatingMostLeastSiblings');

var filename = {
	wordList: 'en.txt',
	siblingGraph: 'siblingGraph.json'
};

// Try to load a pre-prepared sibling graph
fs.existsAsync(filename.siblingGraph).then(function(exists) {
	if (exists) {
		return fs.readFileAsync(filename.siblingGraph, 'utf8')
			.then(circularJSON.parse);
	} else {
		return readWordList(filename.wordList, 4)
			.then(siblingGraph.create)
			.catch(function(err) { console.log('Error in sibling create: ' + err) });
	}
}).then(function(words) {

	words = _.sortBy(words, function(word) { return 0 - word.siblings.length; });
	var wordmap = {};
	_.each(words, function(word) { wordmap[word.word] = word; });

	var superChain = longest([wordmap.amok]);

	process.stdout.write('\n\rLongest chain: ' + superChain.length + '\n\r');
	_.each(superChain, function(entry) { process.stdout.write(entry.word + ', '); });

}).catch(function(err) {
	process.stdout.write('\r\n');
	console.log('Error: ' + err);
});
