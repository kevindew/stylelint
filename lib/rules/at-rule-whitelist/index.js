// @ts-nocheck

'use strict';

const replacementRule = require('../at-rule-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'at-rule-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected at-rule "${name}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
