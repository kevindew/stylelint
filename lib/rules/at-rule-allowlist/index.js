// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'at-rule-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected at-rule "${name}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(allowlistInput) {
		// To allow for just a string as a parameter (not only arrays of strings)
		const allowlist = [].concat(allowlistInput);

		return (root, result) => {
			const validOptions = validateOptions(result, givenRuleName, {
				actual: allowlist,
				possible: [_.isString],
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

			root.walkAtRules((atRule) => {
				const name = atRule.name;

				if (!isStandardSyntaxAtRule(atRule)) {
					return;
				}

				if (allowlist.includes(postcss.vendor.unprefixed(name).toLowerCase())) {
					return;
				}

				report({
					message: givenMessages.rejected(name),
					node: atRule,
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
