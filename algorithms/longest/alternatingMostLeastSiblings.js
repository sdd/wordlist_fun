/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 22:52
 *
 */
var _ = require('lodash-contrib');

// best with this so far is amok, 1457

var longest = function(chain, blackList, maxChain) {

	blackList = blackList || [];
	maxChain = maxChain || [];

	process.stdout.write('Chain Length: ' + chain.length + ', Max Chain Length: ' + maxChain.length + ', Blacklist length ' + blackList.length + '        \r');

	// precalculate a couple of commonly used things
	var last = _.last(chain);
	var chainWords = _.pluck(chain, 'word');

	//
	last.siblings = _.sortBy(
		_.reject(last.siblings,
			function(s) { return _.contains(chainWords, s.word) || _.contains(blackList, s.word); }
		),
		function(s) { return -s.siblings.length; }
	);

	var backtrackCounter = 0;
	while(last && last.siblings.length === 0) {

		if (chainWords.length > maxChain.length) {
			maxChain = _.clone(chainWords);
		}
		_.times(2, function() { blackList.push(chain.pop().word); });
		blackList = _.unique(blackList);

		last = _.last(chain);

		if (++backtrackCounter > 10) {
			console.log('Backtrack limit reached');
			blackList = _.difference(blackList, maxChain);
			return _.done({chain: maxChain, remainder: blackList});
		}
	}

	if (!last) {
		blackList = _.difference(blackList, maxChain);
		return _.done({ chain: maxChain, remainder: blackList });
	}

	// pre-trim siblings' siblings
	_.each(last.siblings, function(sibling, index, col) {
		col[index].siblings = _.sortBy(
			_.reject(
				sibling.siblings,
				function(s) { return _.contains(chainWords, s.word) || _.contains(blackList, s.word); }
			),
			function(s) { return -s.siblings.length; }
		);
	});

	if (chain.length % 2 == 1) {
		return function() { return longest(chain.concat(last.siblings[0]), blackList, maxChain); };
	} else {
		var i = last.siblings.length - 1;
		while (i > 0 && last.siblings[i].siblings.length <= 1) i--;
		return function() { return longest(chain.concat(last.siblings[i]), blackList, maxChain); };
	}
};

module.exports = _.partial(_.trampoline, longest);
