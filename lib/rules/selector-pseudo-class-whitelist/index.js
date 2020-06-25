// @ts-nocheck

'use strict';

const replacementRule = require('../selector-pseudo-class-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'selector-pseudo-class-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-class "${selector}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
