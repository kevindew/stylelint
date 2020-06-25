// @ts-nocheck

'use strict';

const replacementRule = require('../media-feature-name-value-allowlist');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'media-feature-name-value-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (name, value) => `Unexpected value "${value}" for name "${name}"`,
});

const rule = replacementRule.ruleFactory(ruleName, messages);

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
