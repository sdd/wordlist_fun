var	_           = require('lodash'),
	colors      = require('colors'),
	fs          = require('fs'),
	readline    = require('readline'),
	stream      = require('stream');

var instream = fs.createReadStream('en.txt');

var words = [];
var total = 0;

var rl = readline.createInterface({
	input: instream,
	terminal: false
});

rl.on('line', function(line) {
	if (line.length === 4) {
		words.push({
			word    : line,
			siblings: []
		});
	}
	total++;
});

rl.on('close', function() {
	console.log('Processed ' + total + ' words. Extracted ' + words.length + '4 letter words.');

	// build sibling graph
	_.each(words, function(word1, idx1) {
		_.each(words, function(word2, idx2) {
			if (idx2 <= idx1) return;

			var letterMatches = 0;
			_.each([0,1,2,3], function(idx) {
				if (word1.word[idx] === word2.word[idx]) letterMatches++;
			});

			if (letterMatches === 3) {
				word1.siblings.push(word2);
				word2.siblings.push(word1);
			}
		});

		//console.log('' + (100*idx1/words.length) + '% done');
	});

	words = _.sortBy(words, function(word) { return 0 - word.siblings.length; });
	console.log('Sorted!');

	var wordmap = {};

	_.each(words, function (word) {
		wordmap[word.word] = word;
	});

	//var word = wordmap.dahl;
	//var loopDetect = {};
	//var chainLength = 0;
	//
	//while(word.siblings.length && !loopDetect[word.word]) {
	//	chainLength++;
	//	loopDetect[word.word] = true;
	//
	//	console.log(word.word + ': ' + word.siblings.length);
	//
	//	var counter = 0;
	//	while((counter < word.siblings.length - 1) &&
	//		(loopDetect[word.siblings[counter].word] || word.siblings[counter].siblings.length == 1)
	//		) { counter++; }
	//	if (counter <= word.siblings.length) {
	//		word = word.siblings[counter];
	//	}
	//}
	//console.log('Chain of ' + chainLength);

	var longest = function(chain, parentWord) {

		console.log('Chain Length: ' + chain.length);

		var best = [];

		_.each(parentWord.siblings, function(word) {
			if (_.contains(chain, word)) return;

			// bigger than this and you'll bust the stack.
			if (chain.length > 2640) {
				_.each(chain, function(entry) { console.log(entry.word); });
				process.exit();
			}

			var newChain = _.clone(chain);
			newChain.push(parentWord);
			result = longest(newChain, word);

			if (result.length > best.length) best = result;
		});

		return best;
	};

	var superChain = longest([], wordmap.test);

	_.each(superChain, function(entry) {
		console.log(entry.word);
	});
});
