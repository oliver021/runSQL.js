/** 
 * @function
 * @description Tokenize the SQL statement.
 * @param {string} sql
 * @returns {string[]}
*/
export function tokenize(sql: string): string[] {
    // base on the sql statement, tokenize it by SQL standard rules
    // and return the tokens
    // from the rules in the SQL standard, we can get the following rules:
    // 1. A string is a sequence of characters surrounded by single quotes.
    // 2. A number is a sequence of digits.
    // 3. A keyword is a sequence of letters, digits, or underscores.
    // 4. A symbol is a single character that is not a letter, digit, or underscore.
    // 5. A whitespace is a sequence of one or more spaces, tabs, or newlines.
    // 6. A comment is a sequence of characters starting with a # and extending to the end of the line.
    // 7. A delimiter is a single character that is not a letter, digit, or underscore.
    // 8. A word is a sequence of letters, digits, or underscores.
    // 9. A string literal is a sequence of characters surrounded by single quotes.
    // 10. A number literal is a sequence of digits.
    // 11. A boolean literal is a sequence of the letters TRUE or FALSE.
    // 12. A null literal is a sequence of the letters NULL.
    // 13. A function is a sequence of letters, digits, or underscores.
    // 14. A column name is a sequence of letters, digits, or underscores.
    // 15. A table name is a sequence of letters, digits, or underscores.
    // 16. A column alias is a sequence of letters, digits, or underscores.
    // 17. Keywords are case-insensitive.
    // 18. A string literal is case-insensitive.
    // 19. A column name is case-insensitive.
    // 20. A table name is case-insensitive.
    // 21. A column alias is case-insensitive.
    // 22. Tokens are being returned in the order they appear in the statement.
    // 23. A token is a sequence of characters that is not a whitespace, comment, or delimiter.

    let regex = /'([^']*)'|`([^`]*)`|"([^"]*)"|\b(?:[A-Za-z0-9_]+)\b|[^\s\w]+/g;
    let tokens = [];
    let match;
    while (match = regex.exec(sql)) {
        tokens.push(match[0]);
    }
    return tokens;
}

// define a enum with cardinality sql query types
export enum SQLQueryType {
    select,
    insert,
    update,
    delete,
    union,
    intersect,
    except,
}

// define the SQL parser result
// this is the result of the parser
// it contains the information about the query
export interface SQLParserResult {
    queryType: SQLQueryType;
    select?: SelectClosure;
    insert?: InsertClosure;
    update?: UpdateClosure;
    delete?: DeleteClosure;
    union: {
        // the union and similar queries
        type: "union" | "intersect" | "except";
        queries: Array<SelectClosure>;
    }
}

// the expression instance types
export type ExpressionType = "FunctionExpression"| "IndentifierExpression" | "UnaryExpression" 
|"BinaryExpression"|"ListExpression"| "Literal" | "UNKNOWN";

// define the class ExpressionClosure
// expression closure is a set of rules to parse the expression
export class ExpressionClosure {
    public expressionType: ExpressionType;
    public expression: FunctionExpression | IdentifierExpression | UnaryExpression|
     BinaryExpression| ListExpression| LiteralExpression | SelectClosure;

    // constructor
    constructor(expressionType: ExpressionType, expression: FunctionExpression | IdentifierExpression | UnaryExpression|
        BinaryExpression| ListExpression| LiteralExpression){
        this.expressionType = expressionType;
        this.expression = expression;
    }
}

// define the class FunctionExpression
// function expression is a set of rules to parse the function
export class FunctionExpression {
    public functionName: string;
    public arguments: Array<ExpressionClosure> = [];

    // constructor to initialize the function name and arguments
    constructor(functionName: string, _arguments: Array<ExpressionClosure>){
        this.functionName = functionName;
        this.arguments = _arguments;
    }
}

// define the class IdentifierExpression
// identifier expression is a set of rules to parse the identifier
export type IdentifierExpression = string;

// define the class UnaryExpression
// unary expression is a set of rules to parse the unary expression
export class UnaryExpression {
    public operator: string;
    public argument: ExpressionClosure;

    // constructor to initialize the operator and argument
    constructor(operator: string, _argument: ExpressionClosure){
        this.operator = operator;
        this.argument = _argument;
    }
}

// the binary expression is two expressions joined by an operator
// the operator is can be any of the following in enum: OperatorSource
export class BinaryExpression {
    public operator: OperatorSource;
    public left: ExpressionClosure;
    public right: ExpressionClosure;

    // constructor to initialize the operator, left and right
    constructor(operator: OperatorSource, _left: ExpressionClosure, _right: ExpressionClosure){
        this.operator = operator;
        this.left = _left;
        this.right = _right;
    }
}

// define the class ListExpression
// list expression is a set of rules to parse the list expression
export class ListExpression {
    public elements: Array<ExpressionClosure> = [];
    public isInmultable: boolean = false;

    // constructor to initialize the elements
    constructor(_elements: Array<ExpressionClosure>){
        this.elements = _elements;
    }
}

// define the enum with SQL stadard data types
export enum DataType {
    INT,
    BIGINT,
    SMALLINT,
    TINYINT,
    DECIMAL,
    NUMERIC,
    FLOAT,
    DOUBLE,
    REAL,
    BOOLEAN,
    CHAR,
    VARCHAR,
    TEXT,
    BLOB,
    DATE,
    DATETIME,
    TIMESTAMP,
    TIME,
    YEAR,
    INTERVAL,
    BIT,
    BIT_VARYING,
    JSON,
    JSONB,
    UUID,
    ENUM,
    SET,
    GEOMETRY,
    POINT,
    LINESTRING,
    POLYGON,
    MULTIPOINT,
    MULTILINESTRING,
    MULTIPOLYGON,
    GEOMETRYCOLLECTION,
    NULL
};

// define a enum with SQL standard types found in statements
export enum StatementType {
    SELECT,
    FROM,
    WHERE,
    GROUP_BY,
    HAVING,
    ORDER_BY,
    LIMIT,
    OFFSET,
    UNION,
    INTERSECT,
    EXCEPT,
    SET,
    INSERT,
    UPDATE,
    DELETE,
    CREATE,
    DROP,
    ALTER,
    // enoungh to show the show statement
}

// define the class LiteralExpression
// literal expression is a set of rules to parse the literal expression
export class LiteralExpression {
    public value: string;
    public type: "number" | "string" | "boolean" | "null";

    // constructor to initialize the value and type
    constructor(value: string, _type: "number" | "string" | "boolean" | "null"){
        this.value = value;
        this.type = _type;
    }
}

// the select clause define a series of columns to be selected and expressions to be evaluated
export class SelectClosure{
    public hasDistinct: boolean = false;
    public hasAll: boolean = false;
    public columns: ExpressionClosure[] = [];
    public distinctIndexes: number[] = [];
    
    // the append closures are:
    // 1. where
    // 2. group by
    // 3. having
    // 4. order by
    // 5. limit
    // 6. offset
    public from: FromClosure | null = null;
    public where: WhereClosure | null = null;
    public groupBy: GroupByClosure | null = null;
    public having: HavingClosure | null = null;
    public orderBy: OrderByClosure | null = null;
    public limit: LimitClosure | null = null;
    public offset: OffsetClosure | null = null;


    // constructor to initialize the hasDistinct, hasAll, columns and distinctIndexes
    constructor(_hasDistinct: boolean, _hasAll: boolean, _columns: ExpressionClosure[], _distinctIndexes: number[]){
        this.hasDistinct = _hasDistinct;
        this.hasAll = _hasAll;
        this.columns = _columns;
        this.distinctIndexes = _distinctIndexes;
    }
}

// the from clause define a series of tables to be selected with a series of joins
export class FromClosure{
    public tables: Array<TableClosure> = [];
    public joins: Array<JoinClosure> = [];
}

// the TableClosure define a table name
export type TableClosure = string;

// the JoinClosure define a join type and a table name and a series of conditions to be evaluated
// the series of conditions are like WHERE clause
export class JoinClosure{
    public joinType: JoinType = 0;
    public table: TableClosure;
    public conditions: ExpressionClosure;

    // constructor to initialize the joinType, table and conditions
    constructor(_joinType: JoinType, _table: TableClosure, _conditions: ExpressionClosure){
        this.joinType = _joinType;
        this.table = _table;
        this.conditions = _conditions;
    }
}

// the enum with SQL standard join types
export enum JoinType {
    INNER,
    LEFT,
    RIGHT,
    FULL,
    CROSS,
    NATURAL
}

// the where clause define a series of expressions to be evaluated
export type WhereClosure = ExpressionClosure;

// the group by clause define a series of columns to be grouped
export type GroupByClosure = ExpressionClosure;

// the having clause define a series of expressions to be evaluated
export type HavingClosure = ExpressionClosure;

// the order by clause define a series of columns to be ordered
export type OrderByClosure = ExpressionClosure;

// the limit clause define a number of rows to be selected
export type LimitClosure = number;

// the offset clause define a number of rows to be skipped
export type OffsetClosure = number;

// the union clause define a two or more select statements to be unioned
export type UnionClosure = SelectClosure[];

// the intersect clause define a two or more select statements to be intersected
export type IntersectClosure = SelectClosure[];

// the except clause define a two or more select statements to be excepted
export type ExceptClosure = SelectClosure[];

// the update clause define a series of columns to be updated
// is class with complex ast tree to SQL
export class UpdateClosure{
    public columns: ExpressionClosure[] = [];
    public values: ExpressionClosure[] = [];
    public table: string;
    public where: WhereClosure;;

    // the constructor to initialize the table
    constructor(table: string, _columns: ExpressionClosure[], _values: ExpressionClosure[], _where: WhereClosure){
        this.table = table;
        this.columns = _columns;
        this.values = _values;
        this.where = _where;
    }
}

// the insert clause define a series of columns to be inserted
// is class with complex ast tree to SQL
export class InsertClosure{
    public columns: ExpressionClosure[] = [];
    public values: ExpressionClosure[] = [];
    public table: string;
    public useSQLStatement: boolean = false;
    public sqlStatement: SelectClosure | null = null;

    // the constructor to initialize the table
    constructor(table: string){
        this.table = table;
    }

    // the method to set the sql statement
    public setSqlStatement(sqlStatement: SelectClosure){
        this.sqlStatement = sqlStatement;
        this.useSQLStatement = true;
    }

    // the method to set the values
    public setValues(values: ExpressionClosure[]){
        this.values = values;
    }

    // the method to set the columns
    public setColumns(columns: ExpressionClosure[]){
        this.columns = columns;
    }
}

// the delete clause define a series of columns to be deleted
// is class with complex ast tree to SQL
export class DeleteClosure{
    public table: string;
    public where: WhereClosure | null = null;

    // access property to information about the delete clause
    // the next property is true if the delete clause does not have a where clause
    public get dangerDelete(): boolean{
        return this.where == null;
    }

    // the constructor to initialize the table
    constructor(table: string){
        this.table = table;
    }
}

// these next are the keywords of the SQL standard
// these are the PRINCIPAL keywords
export type KeywordClosure = "SELECT" | "FROM" 
| "JOIN"| "ON" | "WHERE" 
| "GROUP BY" | "HAVING" | "ORDER BY" 
| "LIMIT" | "OFFSET" | "UNION" 
| "INTERSECT" | "EXCEPT" | "SET"
| "INSERT" | "UPDATE" | "DELETE" /*| "CREATE" | "DROP" | "ALTER"*/;

// one enums with same keywords
export enum PRINCIPAL_KEYWORDS {
    SELECT,
    FROM,
    JOIN,
    ON,
    WHERE,
    GROUP_BY,
    HAVING,
    ORDER_BY,
    LIMIT,
    OFFSET,
    UNION,
    INTERSECT,
    EXCEPT,
    SET,
    INSERT,
    UPDATE,
    DELETE,
}

// the next function valid if given string is PRINCIAPL_KEYWORDS
// note: not case sensitive
const keywordInstance = Object.values(PRINCIPAL_KEYWORDS);
function isPrincipalKeyword(keyword: string): boolean
{
    return keywordInstance.includes(keyword.toUpperCase());
}

/**
 * @clas ASTSQL
 * @description the class ASTSQL is the root of the AST tree
 */
// the class ASTSQL contains one sequence of [PRINCIPAL_KEYWORDS: ROOT_EXPRESSION]
// example: SELECT * FROM table1 WHERE id = 1 -> [key:SELECT value:*] [key:FROM value:table1] [key:WHERE (alue:id = 1]

// PRINCIAPL_KEYWORDS: are a set of keywords that are used to define the type of the expression

// ROOT_EXPRESSION: is the root expression of the expression is instance of the class ExpressionClosure

// PRINCIPAL_KEYWORDS instance of the class KeywordClosure
// ROOT_EXPRESSION instance of the class ExpressionClosure

export class ASTSQL{
    public PRINCIPAL_KEYWORDS: KeywordClosure;
    public ROOT_EXPRESSION: ExpressionClosure;

    // the constructor to initialize the PRINCIPAL_KEYWORDS and ROOT_EXPRESSION
    constructor(_PRINCIPAL_KEYWORDS: KeywordClosure, _ROOT_EXPRESSION: ExpressionClosure){
        this.PRINCIPAL_KEYWORDS = _PRINCIPAL_KEYWORDS;
        this.ROOT_EXPRESSION = _ROOT_EXPRESSION;
    }
}

// this enum is used to define the all possible keywords of the SQL standard
enum KEYWORDS{
    SELECT,
    FROM,
    JOIN,
    ON,
    WHERE,
    GROUP_BY,
    HAVING,
    ORDER_BY,
    LIMIT,
    OFFSET,
    UNION,
    INTERSECT,
    EXCEPT,
    SET,
    INSERT,
    UPDATE,
    DELETE,
    DISTINCT,
    ALL,
    AS,
    ASC,
    DESC
}

/* parser functions */

/**
 * @function isKeyword
 * @description function to check if the string is a keyword
 * @param {string} keyword
 * @returns {boolean}
 * @example isKeyword("SELECT") // true
 * @example isKeyword("SELECT *") // false
 * @example isKeyword("FOLD") // false
 * @example isKeyword("") // false
 */
export function isKeyword(keyword: string): boolean{
    return Object.values(KEYWORDS).includes(keyword);
}

// the tokens types
export enum TokenType {
    KEYWORD,
    IDENTIFIER,
    NUMBER,
    STRING,
    OPERATOR,
    PARENTHESIS,
    COMMA,
    SEMICOLON,
    EOF
}

// structure of the token like class {type: TokenType, value: string}
export type Token = {
    type: TokenType,
    value: string
};

/**
 * @function analyzeToken
 * @description determine the type of the token
 * @param {string} tokens
 * @returns {ExpressionClosure}
 */
export function analyzeToken(token: string): TokenType{
    if(isKeyword(token)){
        return TokenType.KEYWORD;
    }
    if(isIdentifier(token)){
        return TokenType.IDENTIFIER;
    }
    if(isNumber(token)){
        return TokenType.NUMBER;
    }
    if(isString(token)){
        return TokenType.STRING;
    }
    if(isOperator(token)){
        return TokenType.OPERATOR;
    }
    if(isParenthesis(token)){
        return TokenType.PARENTHESIS;
    }
    if(isComma(token)){
        return TokenType.COMMA;
    }
    if(isSemicolon(token)){
        return TokenType.SEMICOLON;
    }
    return TokenType.EOF;
}

/* many helpers */
 // define function above
 function isIdentifier(token: string): boolean{
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
}

function isNumber(token: string): boolean{
    return /^[0-9]+$/.test(token);
}

function isString(token: string): boolean{
    return /^".*"$/.test(token);
}

// this function should check if the token is an operator using OperatorSource
function isOperator(token: string): boolean{
    return OPERATOR_SOURCES.includes(token);
}

function isParenthesis(token: string): boolean{
    return /^[()]$/.test(token);
}

function isOpenParenthesis(token: string): boolean{
    return token == "(";
}

function isLiteral(token: string): boolean{
    return isNumber(token) || isString(token);
}

function isComma(token: string): boolean{
    return token == ",";
}

function isSemicolon(token: string): boolean{
    return /^[;]$/.test(token);
}

// a class that represent tokens
class TokensIteration {

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
    constructor(tokensSrc: string[])
    {
        this.tokens = tokensSrc.map(x => ({ type: analyzeToken(x), value: x }));
    }

    /**
     * @function next
     * @description get the next token
     * @returns {Token}
     * @example next() // {type: TokenType.KEYWORD, value: "SELECT"}    
     */
    public next(): Token {
        return this.tokens[this.index++];
    }

    /**
     * @function peek
     * @description get the next token without incrementing the index
     * @returns {Token}
     */
    public peek(): Token {
        return this.tokens[this.index];
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
        if(index < 0 || index > this.tokens.length){
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
        if(typeof predicate !== "function"){
            throw new Error("predicate is not a function");
        }
     
        let index = this.tokens.findIndex(predicate);
     
        if(index === -1 && throwAtEnd){
            throw new Error("predicate not found");
        }else if(throwAtEnd === false){
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
}

// operators
// this enum contains all the possible operators
export enum OperatorSource{
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!=',
    'LIKE',
    'NOT LIKE',
    'IN',
    'NOT IN',
    'BETWEEN',
    'NOT BETWEEN',
    'IS',
    'IS NOT',
    'REGEXP',
    'NOT REGEXP',
    'AND',
    'OR',
    'XOR',
    '||',
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '&',
    'AS',
};

// define a constant array of operator sources from OperatorSource enum
const OPERATOR_SOURCES = Object.values(OperatorSource);

// define the operatorType enum is similar to the OperatorSource enum but with names
export enum OperatorType{
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    MODULO,
    POWER,
    AND,
    OR,
    XOR,
    CONCAT,
    EQUAL,
    LESS,
    GREATER,
    LESS_EQUAL,
    GREATER_EQUAL,
    NOT_EQUAL,
    LIKE,
    NOT_LIKE,
    IN,
    NOT_IN,
    BETWEEN,
    NOT_BETWEEN,
    IS,
    IS_NOT,
    REGEXP,
    NOT_REGEXP,
    BITWISE_AND,
    BITWISE_OR,
    BITWISE_XOR,
}

/**
 * @function getOperatorName
 * @description get the name of the operator
 * @param {OperatorType} operatorType
 * @returns {string}
 */
function getOperatorName(token: string): OperatorType{
    switch(token){
        case '=':
            return OperatorType.EQUAL;
        case '<':
            return OperatorType.LESS;
        case '>':
            return OperatorType.GREATER;
        case '<=':
            return OperatorType.LESS_EQUAL;
        case '>=':
            return OperatorType.GREATER_EQUAL;
        case '<>':
            return OperatorType.NOT_EQUAL;
        case 'LIKE':
            return OperatorType.LIKE;
        case 'NOT LIKE':
            return OperatorType.NOT_LIKE;
        case 'IN':
            return OperatorType.IN;
        case 'NOT IN':
            return OperatorType.NOT_IN;
        case 'BETWEEN':
            return OperatorType.BETWEEN;
        case 'NOT BETWEEN':
            return OperatorType.NOT_BETWEEN;
        case 'IS':
            return OperatorType.IS;
        case 'IS NOT':
            return OperatorType.IS_NOT;
        case 'REGEXP':
            return OperatorType.REGEXP;
        case 'NOT REGEXP':
            return OperatorType.NOT_REGEXP;
        case 'AND':
            return OperatorType.AND;
        case 'OR':
            return OperatorType.OR;
        case 'XOR':
            return OperatorType.XOR;
        case '||':
            return OperatorType.CONCAT;
        case '+':
            return OperatorType.PLUS;
        case '-':
            return OperatorType.MINUS;
        case '*':
            return OperatorType.MULTIPLY;
        case '/':
            return OperatorType.DIVIDE;
        case '%':
            return OperatorType.MODULO;
        case '^':
            return OperatorType.POWER;
        case '&':
            return OperatorType.BITWISE_AND;
        default:
            throw new Error('Unknown operator: ' + token);
    }
}

/**
 * @class ExpressionTree
 * @description the expression tree contains expressions information
 */
class ExpressionTree{
    public type: ExpressionType;
    public info: {[key:string]:any} = {};
    public left: ExpressionTree|null = null;
    public right: ExpressionTree|null = null;

    // the constructor initialize type
    constructor(type: ExpressionType = "UNKNOWN"){
        this.type = type;
    }
}

function processTokens(tokens: string[]): ASTSQL[] {
    var result: ASTSQL[] = [];
    var tokenIterator = new TokensIteration(tokens);
    // iterate for all tokens
    while(tokenIterator.hasNext()){
        // the next token should in an PRINCIPAL_KEYWORD
        let current = tokenIterator.peek();
        if(current.type === TokenType.KEYWORD  && isPrincipalKeyword(current.value)){
            // increment the iterator
            tokenIterator.incrementIndex();
            // the next tokens should are one ROOT_EXPRESSION
            result.push(new ASTSQL(current.value as KeywordClosure, processRootExpression(tokenIterator)));
        }else{
            throw new Error('Invalid expression: ' + current.value);
        }

    }

    return result;

    // function to process the root expression
    function processRootExpression(tokenIterator: TokensIteration): ExpressionClosure{
        // find all tokens until other PRINCIPAL_KEYWORD
        // use takeUntil to find the tokens
        let tokens = tokenIterator.takeUntil(token => token.type === TokenType.KEYWORD && isPrincipalKeyword(token.value));

    }
}

/**
 * @function buildExpressionTree
 * @description build the expression tree from the tokens
 * @param tokens the tokens to build the expression tree
 * @returns the expression tree
 * @throws Error if the tokens is invalid
 */
function buildExpressionTree(tokens: string[]): ExpressionTree{

}

// the usage of the expression tree
// the expression rules are:
// 1. 1+1*3 -> [1+1]*[3] -> 
// BinaryExpression(left: BinaryExpression(1, +, 1), operator:*, right:3)
// 1. 2+3 - (1+1) -> [2+3] - [1+1] -> 
// BinaryExpression(left:BinaryExpression(2, +, 3), operator:-, right:BinaryExpression(1, +, 1))
// 1. 2+3*(1+1) -> [2+3]*[1+1] ->
// BinaryExpression(left:BinaryExpression(2, +, 3), operator:*, right:BinaryExpression(1, +, 1))
// 1. (5^2) - 8 -> [5^2] - [8] ->
// BinaryExpression(left:BinaryExpression(5, ^, 2), operator:-, right:8)
// 2. !2 -> [!][2] ->
//  UnaryExpression(operator:!,expr:2)
// 2. ^2 -> [^][2] -> 
/// UnaryExpression(operator:^,expr:2)
// 1. 2^3 -> [2][^][3] ->
// BinaryExpression(left:2, operator:^, right:3)
// 1. 2^3^4 -> [2][^][3][^][4] ->
// BinaryExpression(left:BinaryExpression(left:2, operator:^, right:3), operator:^, right4)
// 2. !ELM -> [!][ELM] ->
//  UnaryExpression(operator:!,expr:IndentifierExpression(name:ELM))
// 2. !(ELM) -> [!][(ELM)] ->
//  UnaryExpression(operator:!,expr:IdentifierExpression(name:ELM))
// 3. elm.lenght -> ["elm.lenght"] ->
// IdentifierExpression(name:"elm.lenght")
// 5. COUNT(*) -> [COUNT, *] ->
//  FunctionExpression(name:IndentifierExpression("COUNT"), arg:LiteralExpression("*"))
// 5. COUNT(elm) -> [COUNT, elm] ->
//  FunctionExpression(IndentifierExpression("COUNT"), IndentifierExpression("elm"))
// 5. AVG(column, 1^7) -> [AVG, column, 1^7] ->
// FunctionExpression(IndentifierExpression("AVG"), IndentifierExpression("column"), BinaryExpression(1, ^, 7))
// 5. MAX(COUNT(data)) ->[MAX, [COUNT, data]] ->
// FunctionExpression(IndentifierExpression("MAX"), FunctionExpression(IndentifierExpression("COUNT"), IndentifierExpression("data")))
// 1. NUM("3") + ^2-> [NUM, "3"] + [^2] ->
// BinaryExpression(FunctionExpression(IndentifierExpression("NUM"), LiteralExpression("3")), +, UnaryExpression(^, 2))


/**
 * @function buildExpr
 * @description review a sequence of tokens to see if it is a valid expression
 * like the following:
 * 1. (Literal|Indentifier|Expression) (operator) (Literal|Indentifier|Expression)
 * 2. (operator) (Literal|Indentifier|Expression)
 * 3. (Literal|Indentifier|Expression),* recursive like expression list
 * not valid example:
 * 1. (Literal|Indentifier|Expression) (operator)
 * 2. (operator) (Literal|Indentifier|Expression) (operator)
 * 3. (Literal|Indentifier|Expression),(operator)
 * 4. (operator),(operator)
 * 5. (operator) (operator)
 * @param tokens the tokens to review
 * @returns the expression tree
 * @throws Error if the tokens is invalid
 * @throws Error if the tokens is not a valid expression
 */
function buildExpr(tokens: TokensIteration, belong: ExpressionTree, currentExcptection = "Expression"): void{
    
    // if not has more tokens and the exception is Expression or ListExpression then throw error
    if(!tokens.hasNext() && 
    (currentExcptection === "Expression" || currentExcptection === "ListExpression")){
        throw new Error('Invalid expression: ' + tokens.peek().value);
    }

    let currentToken = tokens.next();
    
    // evaluate current token by excpected expression
    switch(currentExcptection){
    // if the current token is a literal, operator, identifier or opening parenthesis
    case "Expression":
        // the first token should be a literal, identifier or expression
        let literal = isLiteral(currentToken.value),
        identifier = currentToken.type === TokenType.IDENTIFIER,
        openParenthesis = isOpenParenthesis(currentToken.value),
        operator = isOperator(currentToken.value);
        if(literal || identifier || openParenthesis || operator){
            // check if has more tokens
            if(tokens.hasNext()){

                // find the next token again
                currentToken = tokens.next();

                // base on the current token, decide the next expected expression
                if(literal){
                    // the literals only excepts the next token is a operator
                    // otherwise throw error
                    if(isOperator(currentToken.value)){
                        belong.type = "BinaryExpression";
                        belong.info['operator'] = currentToken.value;
                        belong.left = new ExpressionTree("Literal");
                        belong.left.info['type'] = currentToken.type;
                        belong.left.info['value'] = currentToken.value;
                        belong.right = new ExpressionTree();
                        buildExpr(tokens, belong.right, "Expression");
                    }else{
                        // crash with unexpected token
                        throw new Error('Invalid expression, unexcpected token: ' + currentToken);
                    }
                }else if(identifier){
                    // the next token should be a operator
                    currentToken = tokens.next();

                    // the identifier only excepts the next token is a operator or a opening parenthesis
                    // also can accept the next token is a sequence other keywords until the final expression
                    if(isOperator(currentToken.value)){
                        belong.type = "BinaryExpression";
                        belong.info['operator'] = currentToken.value;
                        belong.left = new ExpressionTree("IndentifierExpression");
                        belong.left.info['name'] = currentToken.value;
                        belong.right = new ExpressionTree();
                        buildExpr(tokens, belong.right, "Expression");
                    }else if(isOpenParenthesis(currentToken.value)){
                        // then exception is ListExpression because it's function
                        belong.type = "FunctionExpression";
                        belong.info['name'] = currentToken.value;
                        belong.left = new ExpressionTree("ListExpression");
                        buildExpr(tokens, belong.left, "ListExpression");
                    }else if(isComma(currentToken.value)){
                        
                    }else{
                    }
                } else if(openParenthesis){
                    // the next token should be a expression
                    buildExpr(tokens, belong, "Expression");
                } else if(operator){
                    // after the operator, the next token should be a indentifier or literal
                    // then the belong Expresion is UnaryExpression with left Expression
                    currentToken = tokens.peek();
                    if(isLiteral(currentToken.value) || currentToken.type == TokenType.IDENTIFIER || isOpenParenthesis(currentToken.value)){
                        belong.type = "UnaryExpression";
                        belong.info['operator'] = currentToken.value;
                        belong.left = new ExpressionTree();
                        buildExpr(tokens, belong.left, "Expression");
                    }
                }
            }else{
                // if not has more tokens, the current token is operator or open parenthesis
                // then throw error with msg: unexpected end of expression
                if(operator || openParenthesis){
                    throw new Error('Unexpected end of expression: ' + currentToken.value);
                }else if(literal){
                    belong.type = "Literal";
                    belong.info['type'] = currentToken.type;
                    belong.info['value'] = currentToken.value;
                }else if(identifier){
                    belong.type = "IndentifierExpression";
                    belong.info['name'] = currentToken.value;
                }                   
            }
        }else{
            throw new Error('Invalid expression, unexpected token: ' + currentToken.value);
        }
    break;
    case "ListExpression":
        // the first token should be a literal, identifier or expression
        ExcpectListExpression();
        break;
    default:
        throw new Error('Invalid expectation: ' + currentExcptection);
    }

    // this function treat the next tokens as a list expression
    function ExcpectListExpression() {
        let listExpression: ExpressionTree[] = [];
        do {
            let expression = new ExpressionTree();
            buildExpr(tokens, expression, "Expression");
            listExpression.push(expression);
            currentToken = tokens.peek();
        } while (isComma(currentToken.value) && tokens.incrementIndex());
        belong.type = "ListExpression";
        belong.info['list'] = listExpression;
    }
}