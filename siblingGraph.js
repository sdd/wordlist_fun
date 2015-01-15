/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 21:19
 *
 */
var _ = require('lodash'),
	Promise = require('bluebird'),
	fs = Promise.promisifyAll(require("fs")),
	circularJSON = require('circular-json');

	require('colors');

module.exports = {

	create: function(words) {
		_.each(words, function(word1, idx1) {
			_.each(words, function(word2, idx2) {
				if (idx2 <= idx1) return;

				var letterMatches = 0;
				_.each([0, 1, 2, 3], function(idx) {
					if (word1.word[idx] === word2.word[idx]) letterMatches++;
				});

				if (letterMatches === 3) {
					word1.siblings.push(word2);
					word2.siblings.push(word1);
				}
			});

			process.stdout.write(
				'Creating sibling graph: '.white
				+ (Math.floor(100 * idx1 / words.length)
				+ '% done\r').yellow
			);
		});
		console.log('Sibling graph created.          '.green);

		return words;
	},

	save: function(filename, words) {
		console.log(filename + ': ' + words.length + ' words');

		return fs.writeFileAsync(filename, circularJSON.stringify(words))
			.then(function() {
				console.log('saved');
				return words;
			}).catch(function(err) {
				console.log('Problem saving sibling graph to ' + filename);
			});
	}
};
