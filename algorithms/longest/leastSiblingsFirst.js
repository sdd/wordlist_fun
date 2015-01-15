/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 22:52
 *
 */
var _ = require('lodash-contrib');

var longest = function(chain, blackList, maxChain) {

	blackList = blackList || [];
	maxChain = maxChain || [];

	process.stdout.write('Chain Length: ' + chain.length + ', Max Chain Length: ' + maxChain.length + '     \r');

	var last = _.last(chain);
	var chainWords = _.pluck(chain, 'word');

	last.siblings = _.sortBy(
		_.reject(last.siblings, function(s) { return _.contains(chainWords.concat(blackList), s.word); }),
		function(s) { return -s.siblings.length; }
	);

	// backtrack if we have hit a dead end.
	while (last && !last.siblings.length) {
		if (chainWords.length > maxChain.length) { maxChain = _.clone(chainWords); }
		_.times(2, function() { blackList.push(chain.pop().word); });
		last = _.last(chain);

		if (!last || chainWords.length < maxChain.length * 0.9) {
			blackList = _.difference(_.unique(blackList), maxChain);
			return _.done({ chain: maxChain, remainder: blackList });
		}
	}

	// for next word use sibling with least (but >1) siblings
	var nextItemIndex = last.siblings.length - 1;
	while (nextItemIndex > 0 && last.siblings[nextItemIndex].siblings.length <= 1) nextItemIndex--;
	return function() { return longest(chain.concat(last.siblings[nextItemIndex]), blackList, maxChain); };
};

module.exports = _.partial(_.trampoline, longest);
