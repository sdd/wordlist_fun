var	_            = require('lodash-contrib'),
	readWordList = require('./readWordList'),
	siblingGraph = require('./siblingGraph'),
	longest = require('./algorithms/longest/leastSiblingsFirst');

var longestChain = { chain: ['NOTHING'] };

var search = function(index) {
	readWordList('en.txt', 4).then(siblingGraph.create).then(function(words) {

		words = _.sortBy(words, function(word) { return 0 - word.siblings.length; });
		var wordsLength = words.length;
		var currWord = words[index].word;

		var result = longest([words[index]]);

		process.stdout.write('\rWord: ' + currWord + ' (' + index + ') ' + ' chain: ' + result.chain.length + '. Longest so far is ' + longestChain.chain[0] + ' with ' + longestChain.chain.length + '\n\r');

		if (result.chain.length > longestChain.chain.length) { longestChain = _.cloneDeep(result); }

		if (++index >= wordsLength) {
			finalReport();
			return longestChain;
		}

		search(index);
	});
};

var finalReport = function() {
	console.log('\n\rLongest chain: ' + longestChain.chain.length + '\n\r');
	console.log(longestChain.chain.join(', '));
	console.log('REMAINDER: ' + longestChain.remainder.length);
	console.log(longestChain.remainder.join(', '));
	process.exit();
};
process.on('SIGINT', finalReport);

search(0);
