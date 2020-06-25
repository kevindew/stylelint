// @ts-nocheck

'use strict';

const replacementRule = require('../unit-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'unit-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
