// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxCombinator = require('../../utils/isStandardSyntaxCombinator');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-combinator-denylist';

const messages = ruleMessages(ruleName, {
	rejected: (combinator) => `Unexpected combinator "${combinator}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(denylist) {
		return (root, result) => {
			const validOptions = validateOptions(result, givenRuleName, {
				actual: denylist,
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

			root.walkRules((rule) => {
				if (!isStandardSyntaxRule(rule)) {
					return;
				}

				const selector = rule.selector;

				parseSelector(selector, result, rule, (fullSelector) => {
					fullSelector.walkCombinators((combinatorNode) => {
						if (!isStandardSyntaxCombinator(combinatorNode)) {
							return;
						}

						const value = normalizeCombinator(combinatorNode.value);

						if (!denylist.includes(value)) {
							return;
						}

						report({
							result,
							ruleName: givenRuleName,
							message: givenMessages.rejected(value),
							node: rule,
							index: combinatorNode.sourceIndex,
						});
					});
				});
			});
		};
	};
}

function normalizeCombinator(value) {
	return value.replace(/\s+/g, ' ');
}

const rule = ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.messages = messages;
rule.ruleFactory = ruleFactory;
rule.ruleName = ruleName;
module.exports = rule;
