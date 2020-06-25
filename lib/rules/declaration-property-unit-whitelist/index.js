// @ts-nocheck

'use strict';

const replacementRule = require('../declaration-property-unit-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'declaration-property-unit-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
