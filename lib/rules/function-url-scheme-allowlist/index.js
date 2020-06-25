// @ts-nocheck

'use strict';

const _ = require('lodash');
const functionArgumentsSearch = require('../../utils/functionArgumentsSearch');
const getSchemeFromUrl = require('../../utils/getSchemeFromUrl');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'function-url-scheme-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (scheme) => `Unexpected URL scheme "${scheme}:"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(allowlist) {
		return (root, result) => {
			const validOptions = validateOptions(result, givenRuleName, {
				actual: allowlist,
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

			root.walkDecls((decl) => {
				functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
					const unspacedUrlString = _.trim(args, ' ');

					if (!isStandardSyntaxUrl(unspacedUrlString)) {
						return;
					}

					const urlString = _.trim(unspacedUrlString, '\'"');
					const scheme = getSchemeFromUrl(urlString);

					if (scheme === null) {
						return;
					}

					if (matchesStringOrRegExp(scheme, allowlist)) {
						return;
					}

					report({
						message: givenMessages.rejected(scheme),
						node: decl,
						ruleName: givenRuleName,
						index,
						result,
					});
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
