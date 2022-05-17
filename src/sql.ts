import { TokensIteration } from "./TokensIteration";

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
    // 18. A string literal is case-insensitive include quotes.
    // 19. A column name is case-insensitive.
    // 20. A table name is case-insensitive.
    // 21. A column alias is case-insensitive.
    // 22. Tokens are being returned in the order they appear in the statement.
    // 23. A token is a sequence of characters that is not a whitespace, comment, or delimiter.
    // 24. seperate the parenthesis tokens from the other parenthesis tokens
    // 25. seperate the comma tokens from the other comma tokens
    // 26. seperate the semicolon tokens from the other semicolon tokens

 
    let regex = /'([^']*)'|`([^`]*)`|"([^"]*)"|\b(?:[A-Za-z0-9_]+)\b|[^\s\w]+/g; // decrapted
    let tokens = [];
    let match;
    while (match = regex.exec(sql)) {
        tokens.push(match[0]);
    }
    return tokens.reduce((acc: string[], token) => {
        // regex to detect a sequence of parenthesis
        if(/^\({2}|\){2}.*/.test(token)){
            token.split('').forEach(parenthesis => {
                acc.push(parenthesis);
            });
        }else{
            acc.push(token);
        }
        return acc;
    }, []);   
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
export type ExpressionType = "FunctionExpression"| "IdentifierExpression" | "UnaryExpression" 
|"BinaryExpression"|"ListExpression"| "Literal" | "UNKNOWN" | "RootClosure";

// define the class ExpressionClosure
// expression closure is a set of rules to parse the expression
export class ExpressionClosure {
    public expressionType: ExpressionType;
    public expression: FunctionExpression | IdentifierExpression | UnaryExpression|
     BinaryExpression| ListExpression| LiteralExpression | RootClosure;

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

export class RootClosure{
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
    DESC,
    INTO,
    VALUES,
}
const ALL_KEYWORDS = Object.values(KEYWORDS);
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
    return ALL_KEYWORDS.includes(keyword);
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

function isComma(token: string): boolean{
    return token == ",";
}

function isSemicolon(token: string): boolean{
    return /^[;]$/.test(token);
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
export function getOperatorName(token: string): OperatorType{
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
export class ExpressionContainer{
    public type: ExpressionType;
    public info: {[key:string]:any} = {};

    // the constructor initialize type
    constructor(type: ExpressionType = "UNKNOWN"){
        this.type = type;
    }

    // the function to get one key in info
    // if key not found, return default value
    public get(key: string, defaultVal: any = null): any{
        return this.info[key] || defaultVal;
    }

    // the function to set one key in info
    public set(key: string, value: any): void{
        this.info[key] = value;
    }

    // the function to set key 'LEFT_NODE' validate if is  ExpressionContainer
    public setLeftNode(node: ExpressionContainer): void{
        if(!(node instanceof ExpressionContainer)){
            throw new Error('Left node must be an ExpressionContainer');
        }
        this.set('LEFT_NODE', node);
    }

    // the function to set key 'RIGHT_NODE' validate if is  ExpressionContainer
    public setRightNode(node: ExpressionContainer): void{
        if(!(node instanceof ExpressionContainer)){
            throw new Error('Right node must be an ExpressionContainer');
        }
        this.set('RIGHT_NODE', node);
    }

    // the function to set key 'OPERATOR' validate if is  OperatorSource
    public setOperator(operator: string): void{
        if(!OPERATOR_SOURCES.includes(operator)){
            throw new Error('Operator must be an OperatorSource');
        }
        this.set('OPERATOR', operator);
    }

    // the function to set key 'NAME' in info
    public setName(name: string): void{
        this.set('NAME', name);
    }

    // get name
    public getName(): string{
        return this.get('NAME');
    }

    // the function to set key 'LIST' validate if is  ExpressionContainer[]
    public setList(list: ExpressionContainer[] | ExpressionContainer): void{
        if(!(list instanceof Array)){
            list = new Array(list);
        }
        this.set('LIST', list);
    }

    // the function to set key 'APPEND_KEYWORDS' validate if is  string
    public setAppendKeywords(keywords: string[]): void{
        if(!(keywords instanceof Array)){
            throw new Error('Keywords must be an Array');
        }
        this.set('APPEND_KEYWORDS', keywords);
    }

    // the function to set key 'PRINCIPAL_KEYWORD' validate if is  string
    public setPrincipalKeyword(keyword: string): void{
        if(typeof keyword !== 'string'){
            throw new Error('Keyword must be a string');
        }
        this.set('PRINCIPAL_KEYWORD', keyword);
    }

    // get left node
    public getLeftNode(): ExpressionContainer{
        return this.get('LEFT_NODE');
    }

    // get right node
    public getRightNode(): ExpressionContainer{
        return this.get('RIGHT_NODE');
    }

    // get operator
    public getOperator(): string{
        return this.get('OPERATOR');
    }

    // get list
    public getList(): ExpressionContainer[]{
        return this.get('LIST') || [];
    }

    // get append keywords
    public getAppendKeywords(): string[]{
        return this.get('APPEND_KEYWORDS') || [];
    }

    // get principal keyword
    public getPrincipalKeyword(): string{
        return this.get('PRINCIPAL_KEYWORD');
    }

    // the function to know if the expression is a literal
    public isLiteral(): boolean{
        return this.type === "Literal";
    }

    // the function to know if the expression is a function
    public isFunction(): boolean{
        return this.type === "FunctionExpression";
    }

    // the function to know if the expression is a binary expression
    public isBinaryExpression(): boolean{
        return this.type === "BinaryExpression";
    }

    // the function to know if the expression is a unary expression
    public isUnaryExpression(): boolean{
        return this.type === "UnaryExpression";
    }

    // the function to know if the expression is a identifier
    public isIdentifier(): boolean{
        return this.type === "IdentifierExpression";
    }
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
export function buildExpression(tokens: TokensIteration, belong: ExpressionContainer, state: string[]): void{
        
    let current = tokens.peekAndNext();
console.log(current.value);
        // switch for every token type
        // generate all token type cases
        switch(current.type){
            case TokenType.KEYWORD:
                if(isPrincipalKeyword(current.value)){
                    // verify that is not prev not principal keyword state scope
                    if(state.length > 0 && state[state.length - 1] !== 'PRINCIPAL_KEYWORD'){
                        throw new Error('Unexpected keyword ' + current.value);
                    }
                    // if the token is a principal keyword
                    // push 'PRINCIAPAL_KEYWORD' in the state
                    // set 'PRINCIPAL_KEYWORD' in the belong
                    state.push('PRINCIAPAL_KEYWORD');
                    belong.setPrincipalKeyword(current.value);
                    belong.type = "RootClosure";
                    let expr = new ExpressionContainer();
                    buildExpression(tokens, expr, state);
                    belong.set("expr", expr);
                    state.pop();
                }else{
                    // crash if state is empty
                    if(state.length === 0){
                        throw new Error(`Invalid expression: ${current.value}`);
                    }

                    // set append keywords
                    belong.setAppendKeywords(
                        tokens.takeUntil(x => ALL_KEYWORDS.includes(x.value))
                        .map(x => x.value)
                    );
                }
            break;

            case TokenType.IDENTIFIER:
                
                // get the identifier name
                var identifierName = current.value as string;
                
                // if state is empty then crash
                if(state.length === 0){
                    throw new Error(`Invalid expression: ${current.value}`);
                }

                // not has more tokens
                if(!tokens.hasNext()){
                    // set the expression as a identifier expression
                    belong.type = 'IdentifierExpression';
                    belong.setName(identifierName);
                    break;
                }

                let peekToken = tokens.peek();
                // if the token is a comma, semi-colon, EOF
                // then define the expression as a identifier expression
                if(peekToken.value === ',' || peekToken.value === ';' 
                || peekToken.value === 'EOF'
                || peekToken.value === ")"
                || isPrincipalKeyword(peekToken.value)){
                    // set the expression as a identifier expression
                    belong.type = 'IdentifierExpression';
                    belong.setName(identifierName);
                    break;
                }

                // if the next is a operator
                current = tokens.peekAndNext();

                if(current.type === TokenType.OPERATOR)
                {
                    // is a binary expression
                    // set new expression container on the left
                    var left = new ExpressionContainer("IdentifierExpression");
                    // set the name of the left expression
                    left.setName(identifierName);

                    // set belong expression as BinaryExpression
                    belong.type = ("BinaryExpression");

                    // set new expression container on the right
                    var right = new ExpressionContainer();
                    buildExpression(tokens, right, state);

                    // set the operator in belong expression
                    belong.setOperator(current.value as string);
                  
                    // set the left expression
                    belong.setLeftNode(left);
                    // set the right expression
                    belong.setRightNode(right);
                    
                }else if(isOpenParenthesis(current.value)){
                    // then is a function expression
                    // set belong expression as FunctionExpression
                    belong.type = ("FunctionExpression");
                    // add function scope in the state
                    state.push('FUNCTION_SCOPE');
                    // set the name of the function
                    belong.setName(identifierName);
                    // set the arguments of the function
                    // find arguments until the next close parenthesis
                    let argExpression = new ExpressionContainer();
                    buildExpression(tokens, argExpression, state);
                    belong.setList(argExpression);
                    // check if the next is a close parenthesis
                    if(tokens.nextEqualToCloseParenthesis()){
                        state.pop();
                    }else{
                        throw new Error(`Invalid expression: ${current.value}`);
                    }
                }
            break;

            case TokenType.NUMBER:
            case TokenType.STRING:
            break;

            case TokenType.OPERATOR:
                    // verify the state scope is not empty
                    // then crash with unexpected token
                    if(state.length === 0)
                    {
                        throw new Error(`Invalid expression: ${current.value}`);
                    }

                    // the peek token shouldn't be a close parenthesis,
                    // comma, semicolon,EOF or a operator
                    // if it is, then crash with unexpected token
                    let peek = tokens.peek();
                    if(peek.type === TokenType.OPERATOR ||
                        peek.value === ")" ||
                        peek.type === TokenType.COMMA ||
                        peek.type === TokenType.SEMICOLON ||
                        peek.type === TokenType.EOF){
                        throw new Error(`Invalid expression: ${current.value}`);
                    }

                    belong.setOperator(current.value as string);
                    // set unary expression
                    belong.type = ("UnaryExpression");
                    // build the expression on the right
                    let rightNode = new ExpressionContainer();
                    buildExpression(tokens, rightNode, state);
                    // set belong right expression
                    belong.setRightNode(rightNode);
            break;

            case TokenType.PARENTHESIS:
                // if the next is a open parenthesis
                if(isOpenParenthesis(current.value)){
                    // get expression container
                    var expr = new ExpressionContainer();
                    // add expression scope in the state
                    state.push('EXPRESSION_SCOPE');
                    // build the expression
                    buildExpression(tokens, expr, state);

                    // if is close parenthesis then remove the expression scope
                    if(tokens.nextEqualToCloseParenthesis()){
                        tokens.incrementIndex();
                        state.pop();
                    }else{
                        throw new Error(`Invalid expression: ${current.value}`);
                    }

                    // get next token
                    current = tokens.peekAndNext();
                    // verify if is a operator
                    if(current.type === TokenType.OPERATOR){
                        // then set binary expression
                        belong.type = ("BinaryExpression");
                        // set the operator in belong expression
                        belong.setOperator(current.value);
                        // set the left expression
                        belong.setLeftNode(expr);
                        // set the right expression
                        let rightNode = new ExpressionContainer();
                        belong.setRightNode(rightNode);
                        // build right expression
                        buildExpression(tokens, rightNode, state);
                    }
                }else{
                    // if is close parenthesis then remove the expression scope
                    if(tokens.nextEqualToCloseParenthesis()){
                        state.pop();
                    }else{
                        throw new Error(`Invalid expression: ${current.value}`);
                    }
                }
            break;

            case TokenType.COMMA:
            break;

            case TokenType.SEMICOLON:
            break;

            case TokenType.EOF:
            break;

        default:
            throw new Error('Invalid token type: ' + current.type);
        }

        // if the state is not empty
        /*if(state.length > 0){
            buildExpression(tokens, belong, state);
        }else{
            // if the iterator is not the end of the tokens
            // or has semi-colon or EOF
            // then crash
            if(!tokens.hasNext() 
            && !tokens.isNext(TokenType.SEMICOLON) 
            && !tokens.isNext(TokenType.EOF)){
                throw new Error('Unexcpected end: ' + current.value);
            }
        }*/
}