// @ts-nocheck

'use strict';

const _ = require('lodash');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const mediaParser = require('postcss-media-query-parser').default;
const rangeContextNodeParser = require('../rangeContextNodeParser');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-name-allowlist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
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

			root.walkAtRules(/^media$/i, (atRule) => {
				mediaParser(atRule.params).walk(/^media-feature$/i, (mediaFeatureNode) => {
					const parent = mediaFeatureNode.parent;
					const mediaFeatureRangeContext = isRangeContextMediaFeature(parent.value);

					let value;
					let sourceIndex;

					if (mediaFeatureRangeContext) {
						const parsedRangeContext = rangeContextNodeParser(mediaFeatureNode);

						value = parsedRangeContext.name.value;
						sourceIndex = parsedRangeContext.name.sourceIndex;
					} else {
						value = mediaFeatureNode.value;
						sourceIndex = mediaFeatureNode.sourceIndex;
					}

					if (!isStandardSyntaxMediaFeatureName(value) || isCustomMediaQuery(value)) {
						return;
					}

					if (matchesStringOrRegExp(value, allowlist)) {
						return;
					}

					report({
						index: atRuleParamIndex(atRule) + sourceIndex,
						message: givenMessages.rejected(value),
						node: atRule,
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
