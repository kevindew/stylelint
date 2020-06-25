// @ts-nocheck

'use strict';

const replacementRule = require('../selector-combinator-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'selector-combinator-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (combinator) => `Unexpected combinator "${combinator}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
