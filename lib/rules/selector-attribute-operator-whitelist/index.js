// @ts-nocheck

'use strict';

const replacementRule = require('../selector-attribute-operator-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'selector-attribute-operator-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (operator) => `Unexpected operator "${operator}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
