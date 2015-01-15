var readline = require('readline'),
	Promise = require('bluebird');
require('colors');

module.exports = function(fileName, length1, length2) {
	var minLength = length1,
		maxLength = length2 || length1,
		words = [],
		total = 0,
		lengthString = length2 ? (length1 + '-' + length2) : length1,
		deferred = Promise.pending();

	var onLine = function(line) {
		if (line.length >= minLength && line.length <= maxLength) {
			words.push({ word: line, siblings: [] });
		}
		total++;
	};

	var onClose = function() {
		console.log((['Processed', total, 'words. Extracted', words.length, lengthString, 'letter words.\r'].join(' ')).green);
		deferred.resolve(words);
	};

	try {
		var inStream = require('fs').createReadStream(fileName);
		var rl = readline.createInterface({ input: inStream, terminal: false });

		rl.on('line', onLine);
		rl.on('close', onClose);

	} catch(ex) {
		console.log('Error in readWordList:' + ex);
		deferred.reject(ex);
	}

	return deferred.promise;
};
