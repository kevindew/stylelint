// @ts-nocheck

'use strict';

const replacementRule = require('../selector-pseudo-element-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'selector-pseudo-element-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
