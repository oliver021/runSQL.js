"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensIteration = void 0;
const sql_1 = require("./sql");
class TokensIteration {
    constructor(tokensSrc) {
        this.index = 0;
        this.tokens = tokensSrc.map(x => ({ type: (0, sql_1.analyzeToken)(x), value: x }));
    }
    peekAndNext() {
        return this.tokens[this.index++];
    }
    peek() {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        return this.tokens[this.index];
    }
    peekTo(index) {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        return this.tokens[this.index + index];
    }
    takeFrom(index) {
        if (index < 0 || index > this.tokens.length) {
            throw new Error("index out of range");
        }
        return this.tokens.slice(this.index, index);
    }
    takeUntil(predicate, throwAtEnd = false) {
        if (typeof predicate !== "function") {
            throw new Error("predicate is not a function");
        }
        let index = this.tokens.findIndex(predicate);
        if (index === -1 && throwAtEnd) {
            throw new Error("predicate not found");
        }
        else if (throwAtEnd === false) {
            index = this.tokens.length;
            return this.tokens.slice(this.index, index);
        }
        return this.takeFrom(index);
    }
    hasNext() {
        return this.index < this.tokens.length;
    }
    seek(index) {
        this.index = index;
    }
    getIndex() {
        return this.index;
    }
    incrementIndex() {
        this.index++;
    }
    isNext(type) {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        if (this.peek().type !== type) {
            return false;
        }
        return true;
    }
    nextShouldBeOneOf(types) {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        if (!Array.isArray(types)) {
            throw new Error("types is not an array");
        }
        if (types.length === 0) {
            throw new Error("types is empty");
        }
        if (types.indexOf(this.peek().type) === -1) {
            return false;
        }
        return true;
    }
    nextEqualTo(tokenValue) {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        if (this.peek().value !== tokenValue) {
            return false;
        }
        return true;
    }
    checkNextTokenByTag(tag) {
        for (let key in tag) {
            if (this.nextEqualTo(tag[key])) {
                return key;
            }
        }
        return "other";
    }
    nextEqualToOpenParenthesis() {
        return this.nextEqualTo("(");
    }
    nextEqualToCloseParenthesis() {
        return this.nextEqualTo(")");
    }
    nextEqualToComma() {
        return this.nextEqualTo(",");
    }
}
exports.TokensIteration = TokensIteration;
