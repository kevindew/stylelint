// @ts-nocheck

'use strict';

const _ = require('lodash');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'function-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected function "${name}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(allowlistInput) {
		const allowlist = [].concat(allowlistInput);

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
				const value = decl.value;

				valueParser(value).walk((node) => {
					if (node.type !== 'function') {
						return;
					}

					if (!isStandardSyntaxFunction(node)) {
						return;
					}

					if (matchesStringOrRegExp(postcss.vendor.unprefixed(node.value), allowlist)) {
						return;
					}

					report({
						message: givenMessages.rejected(node.value),
						node: decl,
						index: declarationValueIndex(decl) + node.sourceIndex,
						ruleName: givenRuleName,
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
