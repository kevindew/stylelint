// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-attribute-operator-denylist';

const messages = ruleMessages(ruleName, {
	rejected: (operator) => `Unexpected operator "${operator}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(denylistInput) {
		const denylist = [].concat(denylistInput);

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

				if (!rule.selector.includes('[') || !rule.selector.includes('=')) {
					return;
				}

				parseSelector(rule.selector, result, rule, (selectorTree) => {
					selectorTree.walkAttributes((attributeNode) => {
						const operator = attributeNode.operator;

						if (!operator || (operator && !denylist.includes(operator))) {
							return;
						}

						report({
							message: givenMessages.rejected(operator),
							node: rule,
							index: attributeNode.sourceIndex + attributeNode.offsetOf('operator'),
							ruleName: givenRuleName,
							result,
						});
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
