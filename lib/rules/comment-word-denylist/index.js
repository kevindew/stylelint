// @ts-nocheck

'use strict';

const _ = require('lodash');
const containsString = require('../../utils/containsString');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-word-denylist';

const messages = ruleMessages(ruleName, {
	rejected: (pattern) => `Unexpected word matching pattern "${pattern}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(denylist) {
		return (root, result) => {
			const validOptions = validateOptions(result, givenRuleName, {
				actual: denylist,
				possible: [_.isString, _.isRegExp],
			});

			if (!validOptions) {
				return;
			}

			if (givenRuleName !== ruleName) {
				result.warn(`'${givenRuleName}' has been deprecated. Instead use '${ruleName}'.`, {
					stylelintType: 'deprecation',
					stylelintReference: `https://stylelint.io/user-guide/rules/${givenRuleName}/`,
				});
			}

			root.walkComments((comment) => {
				const text = comment.text;
				const rawComment = comment.toString();
				const firstFourChars = rawComment.substr(0, 4);

				// Return early if sourcemap
				if (firstFourChars === '/*# ') {
					return;
				}

				const matchesWord = matchesStringOrRegExp(text, denylist) || containsString(text, denylist);

				if (!matchesWord) {
					return;
				}

				report({
					message: givenMessages.rejected(matchesWord.pattern),
					node: comment,
					ruleName: givenRuleName,
					result,
				});
			});
		};
	};
}

const rule = ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.messages = messages;
rule.ruleFactory = ruleFactory;
rule.ruleName = ruleName;
module.exports = rule;
