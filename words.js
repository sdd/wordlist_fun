var	_            = require('lodash'),
	readWordList = require('./readWordList'),
	siblingGraph = require('./siblingGraph'),
	longest = require('./algorithms/longest/leastSiblingsFirst');

readWordList('en.txt', 4).then(siblingGraph.create).then(function(words) {

	words = _.sortBy(words, function(word) { return 0 - word.siblings.length; });
	var wordmap = {};
	_.each(words, function(word) { wordmap[word.word] = word; });

	var superChain = longest([wordmap.test]);

	process.stdout.write('\n\rLongest chain: ' + superChain.chain.length + '\n\r');
	console.log(superChain.chain.join(', '));
	console.log('REMAINDER: ' + superChain.remainder.length);
	console.log(superChain.remainder.join(', '));
});
