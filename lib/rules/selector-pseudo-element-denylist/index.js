// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const parseSelector = require('../../utils/parseSelector');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-pseudo-element-denylist';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
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

			root.walkRules((rule) => {
				if (!isStandardSyntaxRule(rule)) {
					return;
				}

				const selector = rule.selector;

				if (!selector.includes('::')) {
					return;
				}

				parseSelector(selector, result, rule, (selectorTree) => {
					selectorTree.walkPseudos((pseudoNode) => {
						const value = pseudoNode.value;

						// Ignore pseudo-classes
						if (value[1] !== ':') {
							return;
						}

						const name = value.slice(2);

						if (!matchesStringOrRegExp(postcss.vendor.unprefixed(name), denylist)) {
							return;
						}

						report({
							index: pseudoNode.sourceIndex,
							message: givenMessages.rejected(name),
							node: rule,
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
