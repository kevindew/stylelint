// @ts-nocheck

'use strict';

const _ = require('lodash');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'declaration-property-unit-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
});

// This factory is a temporary addition to allow this rule to be portable
// for use by a deprecated rule.
function ruleFactory(givenRuleName, givenMessages) {
	return function rule(allowlist) {
		return (root, result) => {
			const validOptions = validateOptions(result, givenRuleName, {
				actual: allowlist,
				possible: [_.isObject],
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
				const prop = decl.prop;
				const value = decl.value;

				const unprefixedProp = postcss.vendor.unprefixed(prop);

				const propallowlist = _.find(allowlist, (list, propIdentifier) =>
					matchesStringOrRegExp(unprefixedProp, propIdentifier),
				);

				if (!propallowlist) {
					return;
				}

				valueParser(value).walk((node) => {
					// Ignore wrong units within `url` function
					if (node.type === 'function' && node.value.toLowerCase() === 'url') {
						return false;
					}

					if (node.type === 'string') {
						return;
					}

					const unit = getUnitFromValueNode(node);

					if (!unit || (unit && propallowlist.indexOf(unit.toLowerCase())) !== -1) {
						return;
					}

					report({
						message: givenMessages.rejected(prop, unit),
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

rule.messages = messages;
rule.ruleFactory = ruleFactory;
rule.ruleName = ruleName;
module.exports = rule;
