/**
 *
 * 4space -
 * Created By: scotty
 * Date: 14/01/2015 22:52
 *
 */
var _ = require('lodash-contrib');

var longest = function(chain) {

	process.stdout.write('Chain Length: ' + chain.length + '\r');

	var last = _.last(chain);
	var chainWords = _.pluck(chain, 'word');

	last.siblings = _.sortBy(
		_.reject(last.siblings, function(sibling) { return _.contains(chainWords, sibling.word); }),
		function(sibling) { return -sibling.siblings.length; }
	);

	if (last.siblings.length === 0) { return _.done(chain); }
	return function () { return longest(chain.concat(last.siblings[0])); };
};

module.exports = _.partial(_.trampoline, longest);
