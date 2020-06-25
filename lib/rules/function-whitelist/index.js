// @ts-nocheck

'use strict';

const replacementRule = require('../function-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'function-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected function "${name}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
