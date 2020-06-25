// @ts-nocheck

'use strict';

const _ = require('lodash');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'unit-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(allowlistInput, options) {
		const allowlist = [].concat(allowlistInput);

		return (root, result) => {
			const validOptions = validateOptions(
				result,
				givenRuleName,
				{
					actual: allowlist,
					possible: [_.isString],
				},
				{
					optional: true,
					actual: options,
					possible: {
						ignoreProperties: validateObjectWithArrayProps([_.isString, _.isRegExp]),
					},
				},
			);

			if (!validOptions) {
				return;
			}

			if (givenRuleName !== ruleName) {
				result.warn(`'${givenRuleName}' has been deprecated. Instead use '${ruleName}'.`, {
					stylelintType: 'deprecation',
					stylelintReference: `https://stylelint.io/user-guide/rules/${givenRuleName}/`,
				});
			}

			function check(node, value, getIndex) {
				// make sure multiplication operations (*) are divided - not handled
				// by postcss-value-parser
				value = value.replace(/\*/g, ',');
				valueParser(value).walk((valueNode) => {
					// Ignore wrong units within `url` function
					if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
						return false;
					}

					const unit = getUnitFromValueNode(valueNode);

					if (!unit || (unit && allowlist.includes(unit.toLowerCase()))) {
						return;
					}

					if (options && optionsMatches(options.ignoreProperties, unit.toLowerCase(), node.prop)) {
						return;
					}

					report({
						index: getIndex(node) + valueNode.sourceIndex,
						message: givenMessages.rejected(unit),
						ruleName: givenRuleName,
						node,
						result,
					});
				});
			}

			root.walkAtRules(/^media$/i, (atRule) => check(atRule, atRule.params, atRuleParamIndex));
			root.walkDecls((decl) => check(decl, decl.value, declarationValueIndex));
		};
	};
}

const rule = ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.messages = messages;
rule.ruleFactory = ruleFactory;
rule.ruleName = ruleName;
module.exports = rule;
