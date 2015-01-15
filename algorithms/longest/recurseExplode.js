/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 20:51
 *
 */
var _ = require('lodash');

var longest = function(chain) {

	process.stdout.write('Chain Length: ' + chain.length + '\r');

	var best = [],
		last = _.last(chain);

	_.each(last.siblings, function(word) {
		if (_.contains(chain, word)) return;

		// bigger than this and you'll bust the stack.
		if (chain.length > 2440) {
			_.each(chain, function(entry) { process.stdout.write(entry.word + ' '); });
			process.exit();
		}

		var newChain = _.clone(chain);
		result = longest(newChain.concat(word));

		if (result.length > best.length) best = result;
	});

	return best;
};

module.exports = longest;
