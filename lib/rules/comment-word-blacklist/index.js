// @ts-nocheck

'use strict';

const replacementRule = require('../comment-word-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'comment-word-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (pattern) => `Unexpected word matching pattern "${pattern}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
