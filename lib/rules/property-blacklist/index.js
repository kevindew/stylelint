// @ts-nocheck

'use strict';

const replacementRule = require('../property-denylist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'property-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected property "${property}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
