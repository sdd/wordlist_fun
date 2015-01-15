/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 22:52
 *
 */
var _ = require('lodash-contrib');

// best with this so far is cape, 995

var longest = function(chain) {

	process.stdout.write('Chain Length: ' + chain.length + '\r');

	var last = _.last(chain);
	var chainWords = _.pluck(chain, 'word');

	last.siblings = _.sortBy(
		_.reject(last.siblings, function(sibling) { return _.contains(chainWords, sibling.word); }),
		function(sibling) { return -sibling.siblings.length; }
	);

	if (last.siblings.length === 0) { return _.done(chain); }

	// pre-trim siblings siblings
	_.each(last.siblings, function(sibling, index, col) {
		col[index].siblings = _.sortBy(
			_.reject(
				sibling.siblings,
				function(s) { return _.contains(chainWords, s.word); }
			),
			function(sibling) { return -sibling.siblings.length; }
		);
	});

	if (chain.length % 2 == 1) {

		//console.log('A: Appending ' + last.siblings[0].word + ': siblings ' + last.siblings[0].siblings.length + ' ' + _.map(last.siblings[0].siblings, function(s) { return s.word; }).join(', '));

		return function() { return longest(chain.concat(last.siblings[0])); };
	} else {
		var i = last.siblings.length - 1;
		while (i > 0 && last.siblings[i].siblings.length >= 1) i--;

		//console.log('B: Appending ' + last.siblings[i].word + ': siblings ' + last.siblings[i].siblings.length + ' ' + _.map(last.siblings[i].siblings, function(s) { return s.word; }).join(', ') );

		return function() { return longest(chain.concat(last.siblings[i])); };
	}
};

module.exports = _.partial(_.trampoline, longest);
