import { Token, analyzeToken, TokenType } from "./sql";


// a class that represent tokens
export class TokensIteration {

    /**
     * @property {Token[]} tokens
     * @description the tokens array
     * @public
     */
    public tokens: Token[];

    /**
     * @property {number} index
     * @description the index of the token
     * @public
     * @default 0
     */
    private index: number = 0;

    // the constructor to initialize the tokens
    constructor(tokensSrc: string[]) {
        this.tokens = tokensSrc.map(x => ({ type: analyzeToken(x), value: x }));
    }

    /**
     * @function next
     * @description get the next token
     * @returns {Token}
     * @example next() // {type: TokenType.KEYWORD, value: "SELECT"}
     */
    public peekAndNext(): Token {
        return this.tokens[this.index++];
    }

    /**
     * @function peek
     * @description get the next token without incrementing the index
     * @returns {Token}
     */
    public peek(): Token {
        // if the index is out of range, return the last token
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        return this.tokens[this.index];
    }

    /**
     * @function peek
     * @description get the next token without incrementing the index
     * @returns {Token}
     */
     public peekTo(index: number): Token {
        // if the index is out of range, return the last token
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        return this.tokens[this.index + index];
    }

    /**
     * @function takeFrom
     * @description get tokens from the current index to the passed index
     * @param {number} index
     * @returns {Token[]}
     * @example take(2) // [{type: TokenType.KEYWORD, value: "SELECT"}, {type: TokenType.IDENTIFIER, value: "table1"}]
     * @throws {Error} if the index is out of range
     */
    public takeFrom(index: number): Token[] {
        if (index < 0 || index > this.tokens.length) {
            throw new Error("index out of range");
        }
        return this.tokens.slice(this.index, index);
    }

    /**
     * @function takeUntil
     * @description get tokens from the current index to the passed fucntion evaluation
     * @param {(token: Token) => boolean} predicate
     * @param throwAtEnd {boolean} if true, throw an error if the predicate is not met, otherwise return an rest of the tokens
     * @returns {Token[]}
     * @example takeUntil(token => token.type === TokenType.EOF) // [{type: TokenType.KEYWORD, value: "SELECT"}, {type: TokenType.IDENTIFIER, value: "table1"}]
     * @throws {Error} if the index is out of range
     * @throws {Error} if the predicate is not a function
     */
    public takeUntil(predicate: (token: Token) => boolean, throwAtEnd: boolean = false): Token[] {
        if (typeof predicate !== "function") {
            throw new Error("predicate is not a function");
        }

        let index = this.tokens.findIndex(predicate);

        if (index === -1 && throwAtEnd) {
            throw new Error("predicate not found");
        } else if (throwAtEnd === false) {
            // then return the rest of the tokens
            index = this.tokens.length;
            return this.tokens.slice(this.index, index);
        }

        return this.takeFrom(index);
    }

    /**
     * @function hasNext
     * @description check if there is a next token
     * @returns {boolean}
     */
    public hasNext(): boolean {
        return this.index < this.tokens.length;
    }

    /**
     * @function seek
     * @description set the index to the given value
     * @param {number} index
     * @returns {void}
     * @example seek(2) // the index is now 2
     */
    public seek(index: number): void {
        this.index = index;
    }

    /**
     * @function getIndex
     * @description get the index of the token
     * @returns {number}
     * @example getIndex() // 2
     */
    public getIndex(): number {
        return this.index;
    }

    /**
     * @function incrementIndex
     * @description increment the index by 1
     * @returns {void}
     * @example incrementIndex() // the index is now 3
     */
    public incrementIndex(): void {
        this.index++;
    }

    /**
     * @function nextShouldBe
     * @description check if the next token is the given type
     * @param {TokenType} type
     * @returns {boolean}
     * @example nextShouldBe(TokenType.KEYWORD) // true
     * @example nextShouldBe(TokenType.IDENTIFIER) // false
     * @throws {Error} if the index is out of range
     */
    public isNext(type: TokenType): boolean {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        if (this.peek().type !== type) {
            return false;
        }
        return true;
    }

    /**
     * @function nextShouldBeOneOf
     * @description check if the next token is one of the given types
     * @param {TokenType[]} types
     * @returns {boolean}
     * @example nextShouldBeOneOf([TokenType.KEYWORD, TokenType.IDENTIFIER]) // true
     * @example nextShouldBeOneOf([TokenType.KEYWORD, TokenType.IDENTIFIER]) // false
     * @throws {Error} if the index is out of range
     * @throws {Error} if the types is not an array
     * @throws {Error} if the types is empty
     */
    public nextShouldBeOneOf(types: TokenType[]): boolean {
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

    /**
     * @function nextEqualTo
     * @description check if the next token is equal to the given token
     * @param {string} tokenValue
     * @returns {boolean}
     * @example nextEqualTo("SELECT") // true
     * @example nextEqualTo("211") // false
     * @throws {Error} if the index is out of range
     */
    public nextEqualTo(tokenValue: string): boolean {
        if (!this.hasNext()) {
            throw new Error("index out of range");
        }
        if (this.peek().value !== tokenValue) {
            return false;
        }
        return true;
    }

    /**
     * @function checkNextTokenByTag
     * @description Recive an object key-value pair, and check if the next token 
     * is equal to the value of the key
     * then return the key or string "other"
     * @param {[key:string]} tag
     * @returns {void}
     */
    public checkNextTokenByTag(tag: {[key:string]: string}): string {
        for (let key in tag) {
            if (this.nextEqualTo(tag[key])) {
                return key;
            }
        }
        return "other";
    }

    /**
     * @function nextEqualToOpenParenthesis
     * @description check if the next token is an open parenthesis
     * @returns {boolean}
     * @example nextShouldBeOpenParenthesis() // true
     * @example nextShouldBeOpenParenthesis() // false
     * @throws {Error} if the index is out of range
     */
    public nextEqualToOpenParenthesis(): boolean {
        return this.nextEqualTo("(");
    }

    /**
     * @function nextEqualToCloseParenthesis
     * @description check if the next token is an close parenthesis
     */
    public nextEqualToCloseParenthesis(): boolean {
        return this.nextEqualTo(")");
    }

    /**
     * @function nextEqualToComma
     * @description check if the next token is a comma
     * @returns {boolean}
     * @example nextShouldBeComma() // true
     * @example nextShouldBeComma() // false
     * @throws {Error} if the index is out of range
     */
    public nextEqualToComma(): boolean {
        return this.nextEqualTo(",");
    }
}
