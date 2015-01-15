For each word:
1 remove words currently in the chain from its list of siblings
2 sort the words into order from most siblings to least
3 try the following methods:
	1 simply add the word with the most siblings to the chain
	2 alternate between the most siblings and the least (ignore words with 1 sibling unless there is only 1 word left, as they are obvs dead ends)
	3 alternate between a random word from the top 10% of words with most siblings, and a random word from bottom 10% of number of siblings (excl 1 sibling). Repeat, keeping best after each time

