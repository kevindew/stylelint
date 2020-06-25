// @ts-nocheck

'use strict';

const replacementRule = require('../unit-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'unit-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
