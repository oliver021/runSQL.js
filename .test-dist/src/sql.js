"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
function tokenize(sql) {
    let regex = /'([^']*)'|`([^`]*)`|"([^"]*)"|\b(?:[A-Za-z0-9_]+)\b|[^\s\w]+/g;
    let tokens = [];
    let match;
    while (match = regex.exec(sql)) {
        tokens.push(match[0]);
    }
    return tokens;
}
exports.tokenize = tokenize;
