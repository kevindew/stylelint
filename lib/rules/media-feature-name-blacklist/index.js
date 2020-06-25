// @ts-nocheck

'use strict';

const replacementRule = require('../media-feature-name-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'media-feature-name-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
