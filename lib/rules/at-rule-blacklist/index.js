// @ts-nocheck

'use strict';

const replacementRule = require('../at-rule-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'at-rule-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected at-rule "${name}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
