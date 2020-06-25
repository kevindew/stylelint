// @ts-nocheck

'use strict';

const _ = require('lodash');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const mediaParser = require('postcss-media-query-parser').default;
const postcss = require('postcss');
const rangeContextNodeParser = require('../rangeContextNodeParser');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-name-value-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (name, value) => `Unexpected value "${value}" for name "${name}"`,
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

			root.walkAtRules(/^media$/i, (atRule) => {
				mediaParser(atRule.params).walk(/^media-feature-expression$/i, (node) => {
					const mediaFeatureRangeContext = isRangeContextMediaFeature(node.parent.value);

					// Ignore boolean
					if (!node.value.includes(':') && !mediaFeatureRangeContext) {
						return;
					}

					const mediaFeatureNode = _.find(node.nodes, { type: 'media-feature' });

					let mediaFeatureName;
					let values = [];

					if (mediaFeatureRangeContext) {
						const parsedRangeContext = rangeContextNodeParser(mediaFeatureNode);

						mediaFeatureName = parsedRangeContext.name.value;
						values = parsedRangeContext.values;
					} else {
						mediaFeatureName = mediaFeatureNode.value;
						values.push(_.find(node.nodes, { type: 'value' }));
					}

					for (let i = 0; i < values.length; i++) {
						const valueNode = values[i];
						const value = valueNode.value;
						const unprefixedMediaFeatureName = postcss.vendor.unprefixed(mediaFeatureName);

						const featureallowlist = _.find(allowlist, (v, allowlistFeatureName) =>
							matchesStringOrRegExp(unprefixedMediaFeatureName, allowlistFeatureName),
						);

						if (featureallowlist === undefined) {
							return;
						}

						if (matchesStringOrRegExp(value, featureallowlist)) {
							return;
						}

						report({
							index: atRuleParamIndex(atRule) + valueNode.sourceIndex,
							message: givenMessages.rejected(mediaFeatureName, value),
							node: atRule,
							givenRuleName,
							result,
						});
					}
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
