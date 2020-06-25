// @ts-nocheck

'use strict';

const replacementRule = require('../declaration-property-value-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'declaration-property-value-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
