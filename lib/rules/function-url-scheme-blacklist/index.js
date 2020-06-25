// @ts-nocheck

'use strict';

const replacementRule = require('../function-url-scheme-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'function-url-scheme-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (scheme) => `Unexpected URL scheme "${scheme}:"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
