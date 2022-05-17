"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExpression = exports.ExpressionContainer = exports.getOperatorName = exports.OperatorType = exports.OperatorSource = exports.analyzeToken = exports.TokenType = exports.isKeyword = exports.RootClosure = exports.PRINCIPAL_KEYWORDS = exports.DeleteClosure = exports.InsertClosure = exports.UpdateClosure = exports.JoinType = exports.JoinClosure = exports.FromClosure = exports.SelectClosure = exports.LiteralExpression = exports.StatementType = exports.DataType = exports.ListExpression = exports.BinaryExpression = exports.UnaryExpression = exports.FunctionExpression = exports.ExpressionClosure = exports.SQLQueryType = exports.tokenize = void 0;
function tokenize(sql) {
    let regex = /'([^']*)'|`([^`]*)`|"([^"]*)"|\b(?:[A-Za-z0-9_]+)\b|[^\s\w]+/g;
    let tokens = [];
    let match;
    while (match = regex.exec(sql)) {
        tokens.push(match[0]);
    }
    return tokens.reduce((acc, token) => {
        if (/^\({2}|\){2}.*/.test(token)) {
            token.split('').forEach(parenthesis => {
                acc.push(parenthesis);
            });
        }
        else {
            acc.push(token);
        }
        return acc;
    }, []);
}
exports.tokenize = tokenize;
var SQLQueryType;
(function (SQLQueryType) {
    SQLQueryType[SQLQueryType["select"] = 0] = "select";
    SQLQueryType[SQLQueryType["insert"] = 1] = "insert";
    SQLQueryType[SQLQueryType["update"] = 2] = "update";
    SQLQueryType[SQLQueryType["delete"] = 3] = "delete";
    SQLQueryType[SQLQueryType["union"] = 4] = "union";
    SQLQueryType[SQLQueryType["intersect"] = 5] = "intersect";
    SQLQueryType[SQLQueryType["except"] = 6] = "except";
})(SQLQueryType = exports.SQLQueryType || (exports.SQLQueryType = {}));
class ExpressionClosure {
    constructor(expressionType, expression) {
        this.expressionType = expressionType;
        this.expression = expression;
    }
}
exports.ExpressionClosure = ExpressionClosure;
class FunctionExpression {
    constructor(functionName, _arguments) {
        this.arguments = [];
        this.functionName = functionName;
        this.arguments = _arguments;
    }
}
exports.FunctionExpression = FunctionExpression;
class UnaryExpression {
    constructor(operator, _argument) {
        this.operator = operator;
        this.argument = _argument;
    }
}
exports.UnaryExpression = UnaryExpression;
class BinaryExpression {
    constructor(operator, _left, _right) {
        this.operator = operator;
        this.left = _left;
        this.right = _right;
    }
}
exports.BinaryExpression = BinaryExpression;
class ListExpression {
    constructor(_elements) {
        this.elements = [];
        this.isInmultable = false;
        this.elements = _elements;
    }
}
exports.ListExpression = ListExpression;
var DataType;
(function (DataType) {
    DataType[DataType["INT"] = 0] = "INT";
    DataType[DataType["BIGINT"] = 1] = "BIGINT";
    DataType[DataType["SMALLINT"] = 2] = "SMALLINT";
    DataType[DataType["TINYINT"] = 3] = "TINYINT";
    DataType[DataType["DECIMAL"] = 4] = "DECIMAL";
    DataType[DataType["NUMERIC"] = 5] = "NUMERIC";
    DataType[DataType["FLOAT"] = 6] = "FLOAT";
    DataType[DataType["DOUBLE"] = 7] = "DOUBLE";
    DataType[DataType["REAL"] = 8] = "REAL";
    DataType[DataType["BOOLEAN"] = 9] = "BOOLEAN";
    DataType[DataType["CHAR"] = 10] = "CHAR";
    DataType[DataType["VARCHAR"] = 11] = "VARCHAR";
    DataType[DataType["TEXT"] = 12] = "TEXT";
    DataType[DataType["BLOB"] = 13] = "BLOB";
    DataType[DataType["DATE"] = 14] = "DATE";
    DataType[DataType["DATETIME"] = 15] = "DATETIME";
    DataType[DataType["TIMESTAMP"] = 16] = "TIMESTAMP";
    DataType[DataType["TIME"] = 17] = "TIME";
    DataType[DataType["YEAR"] = 18] = "YEAR";
    DataType[DataType["INTERVAL"] = 19] = "INTERVAL";
    DataType[DataType["BIT"] = 20] = "BIT";
    DataType[DataType["BIT_VARYING"] = 21] = "BIT_VARYING";
    DataType[DataType["JSON"] = 22] = "JSON";
    DataType[DataType["JSONB"] = 23] = "JSONB";
    DataType[DataType["UUID"] = 24] = "UUID";
    DataType[DataType["ENUM"] = 25] = "ENUM";
    DataType[DataType["SET"] = 26] = "SET";
    DataType[DataType["GEOMETRY"] = 27] = "GEOMETRY";
    DataType[DataType["POINT"] = 28] = "POINT";
    DataType[DataType["LINESTRING"] = 29] = "LINESTRING";
    DataType[DataType["POLYGON"] = 30] = "POLYGON";
    DataType[DataType["MULTIPOINT"] = 31] = "MULTIPOINT";
    DataType[DataType["MULTILINESTRING"] = 32] = "MULTILINESTRING";
    DataType[DataType["MULTIPOLYGON"] = 33] = "MULTIPOLYGON";
    DataType[DataType["GEOMETRYCOLLECTION"] = 34] = "GEOMETRYCOLLECTION";
    DataType[DataType["NULL"] = 35] = "NULL";
})(DataType = exports.DataType || (exports.DataType = {}));
;
var StatementType;
(function (StatementType) {
    StatementType[StatementType["SELECT"] = 0] = "SELECT";
    StatementType[StatementType["FROM"] = 1] = "FROM";
    StatementType[StatementType["WHERE"] = 2] = "WHERE";
    StatementType[StatementType["GROUP_BY"] = 3] = "GROUP_BY";
    StatementType[StatementType["HAVING"] = 4] = "HAVING";
    StatementType[StatementType["ORDER_BY"] = 5] = "ORDER_BY";
    StatementType[StatementType["LIMIT"] = 6] = "LIMIT";
    StatementType[StatementType["OFFSET"] = 7] = "OFFSET";
    StatementType[StatementType["UNION"] = 8] = "UNION";
    StatementType[StatementType["INTERSECT"] = 9] = "INTERSECT";
    StatementType[StatementType["EXCEPT"] = 10] = "EXCEPT";
    StatementType[StatementType["SET"] = 11] = "SET";
    StatementType[StatementType["INSERT"] = 12] = "INSERT";
    StatementType[StatementType["UPDATE"] = 13] = "UPDATE";
    StatementType[StatementType["DELETE"] = 14] = "DELETE";
    StatementType[StatementType["CREATE"] = 15] = "CREATE";
    StatementType[StatementType["DROP"] = 16] = "DROP";
    StatementType[StatementType["ALTER"] = 17] = "ALTER";
})(StatementType = exports.StatementType || (exports.StatementType = {}));
class LiteralExpression {
    constructor(value, _type) {
        this.value = value;
        this.type = _type;
    }
}
exports.LiteralExpression = LiteralExpression;
class SelectClosure {
    constructor(_hasDistinct, _hasAll, _columns, _distinctIndexes) {
        this.hasDistinct = false;
        this.hasAll = false;
        this.columns = [];
        this.distinctIndexes = [];
        this.from = null;
        this.where = null;
        this.groupBy = null;
        this.having = null;
        this.orderBy = null;
        this.limit = null;
        this.offset = null;
        this.hasDistinct = _hasDistinct;
        this.hasAll = _hasAll;
        this.columns = _columns;
        this.distinctIndexes = _distinctIndexes;
    }
}
exports.SelectClosure = SelectClosure;
class FromClosure {
    constructor() {
        this.tables = [];
        this.joins = [];
    }
}
exports.FromClosure = FromClosure;
class JoinClosure {
    constructor(_joinType, _table, _conditions) {
        this.joinType = 0;
        this.joinType = _joinType;
        this.table = _table;
        this.conditions = _conditions;
    }
}
exports.JoinClosure = JoinClosure;
var JoinType;
(function (JoinType) {
    JoinType[JoinType["INNER"] = 0] = "INNER";
    JoinType[JoinType["LEFT"] = 1] = "LEFT";
    JoinType[JoinType["RIGHT"] = 2] = "RIGHT";
    JoinType[JoinType["FULL"] = 3] = "FULL";
    JoinType[JoinType["CROSS"] = 4] = "CROSS";
    JoinType[JoinType["NATURAL"] = 5] = "NATURAL";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
class UpdateClosure {
    constructor(table, _columns, _values, _where) {
        this.columns = [];
        this.values = [];
        this.table = table;
        this.columns = _columns;
        this.values = _values;
        this.where = _where;
    }
    ;
}
exports.UpdateClosure = UpdateClosure;
class InsertClosure {
    constructor(table) {
        this.columns = [];
        this.values = [];
        this.useSQLStatement = false;
        this.sqlStatement = null;
        this.table = table;
    }
    setSqlStatement(sqlStatement) {
        this.sqlStatement = sqlStatement;
        this.useSQLStatement = true;
    }
    setValues(values) {
        this.values = values;
    }
    setColumns(columns) {
        this.columns = columns;
    }
}
exports.InsertClosure = InsertClosure;
class DeleteClosure {
    constructor(table) {
        this.where = null;
        this.table = table;
    }
    get dangerDelete() {
        return this.where == null;
    }
}
exports.DeleteClosure = DeleteClosure;
var PRINCIPAL_KEYWORDS;
(function (PRINCIPAL_KEYWORDS) {
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["SELECT"] = 0] = "SELECT";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["FROM"] = 1] = "FROM";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["JOIN"] = 2] = "JOIN";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["ON"] = 3] = "ON";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["WHERE"] = 4] = "WHERE";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["GROUP_BY"] = 5] = "GROUP_BY";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["HAVING"] = 6] = "HAVING";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["ORDER_BY"] = 7] = "ORDER_BY";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["LIMIT"] = 8] = "LIMIT";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["OFFSET"] = 9] = "OFFSET";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["UNION"] = 10] = "UNION";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["INTERSECT"] = 11] = "INTERSECT";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["EXCEPT"] = 12] = "EXCEPT";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["SET"] = 13] = "SET";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["INSERT"] = 14] = "INSERT";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["UPDATE"] = 15] = "UPDATE";
    PRINCIPAL_KEYWORDS[PRINCIPAL_KEYWORDS["DELETE"] = 16] = "DELETE";
})(PRINCIPAL_KEYWORDS = exports.PRINCIPAL_KEYWORDS || (exports.PRINCIPAL_KEYWORDS = {}));
const keywordInstance = Object.values(PRINCIPAL_KEYWORDS);
function isPrincipalKeyword(keyword) {
    return keywordInstance.includes(keyword.toUpperCase());
}
class RootClosure {
    constructor(_PRINCIPAL_KEYWORDS, _ROOT_EXPRESSION) {
        this.PRINCIPAL_KEYWORDS = _PRINCIPAL_KEYWORDS;
        this.ROOT_EXPRESSION = _ROOT_EXPRESSION;
    }
}
exports.RootClosure = RootClosure;
var KEYWORDS;
(function (KEYWORDS) {
    KEYWORDS[KEYWORDS["SELECT"] = 0] = "SELECT";
    KEYWORDS[KEYWORDS["FROM"] = 1] = "FROM";
    KEYWORDS[KEYWORDS["JOIN"] = 2] = "JOIN";
    KEYWORDS[KEYWORDS["ON"] = 3] = "ON";
    KEYWORDS[KEYWORDS["WHERE"] = 4] = "WHERE";
    KEYWORDS[KEYWORDS["GROUP_BY"] = 5] = "GROUP_BY";
    KEYWORDS[KEYWORDS["HAVING"] = 6] = "HAVING";
    KEYWORDS[KEYWORDS["ORDER_BY"] = 7] = "ORDER_BY";
    KEYWORDS[KEYWORDS["LIMIT"] = 8] = "LIMIT";
    KEYWORDS[KEYWORDS["OFFSET"] = 9] = "OFFSET";
    KEYWORDS[KEYWORDS["UNION"] = 10] = "UNION";
    KEYWORDS[KEYWORDS["INTERSECT"] = 11] = "INTERSECT";
    KEYWORDS[KEYWORDS["EXCEPT"] = 12] = "EXCEPT";
    KEYWORDS[KEYWORDS["SET"] = 13] = "SET";
    KEYWORDS[KEYWORDS["INSERT"] = 14] = "INSERT";
    KEYWORDS[KEYWORDS["UPDATE"] = 15] = "UPDATE";
    KEYWORDS[KEYWORDS["DELETE"] = 16] = "DELETE";
    KEYWORDS[KEYWORDS["DISTINCT"] = 17] = "DISTINCT";
    KEYWORDS[KEYWORDS["ALL"] = 18] = "ALL";
    KEYWORDS[KEYWORDS["AS"] = 19] = "AS";
    KEYWORDS[KEYWORDS["ASC"] = 20] = "ASC";
    KEYWORDS[KEYWORDS["DESC"] = 21] = "DESC";
    KEYWORDS[KEYWORDS["INTO"] = 22] = "INTO";
    KEYWORDS[KEYWORDS["VALUES"] = 23] = "VALUES";
})(KEYWORDS || (KEYWORDS = {}));
const ALL_KEYWORDS = Object.values(KEYWORDS);
function isKeyword(keyword) {
    return ALL_KEYWORDS.includes(keyword);
}
exports.isKeyword = isKeyword;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["KEYWORD"] = 0] = "KEYWORD";
    TokenType[TokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    TokenType[TokenType["NUMBER"] = 2] = "NUMBER";
    TokenType[TokenType["STRING"] = 3] = "STRING";
    TokenType[TokenType["OPERATOR"] = 4] = "OPERATOR";
    TokenType[TokenType["PARENTHESIS"] = 5] = "PARENTHESIS";
    TokenType[TokenType["COMMA"] = 6] = "COMMA";
    TokenType[TokenType["SEMICOLON"] = 7] = "SEMICOLON";
    TokenType[TokenType["EOF"] = 8] = "EOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
function analyzeToken(token) {
    if (isKeyword(token)) {
        return TokenType.KEYWORD;
    }
    if (isIdentifier(token)) {
        return TokenType.IDENTIFIER;
    }
    if (isNumber(token)) {
        return TokenType.NUMBER;
    }
    if (isString(token)) {
        return TokenType.STRING;
    }
    if (isOperator(token)) {
        return TokenType.OPERATOR;
    }
    if (isParenthesis(token)) {
        return TokenType.PARENTHESIS;
    }
    if (isComma(token)) {
        return TokenType.COMMA;
    }
    if (isSemicolon(token)) {
        return TokenType.SEMICOLON;
    }
    return TokenType.EOF;
}
exports.analyzeToken = analyzeToken;
function isIdentifier(token) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
}
function isNumber(token) {
    return /^[0-9]+$/.test(token);
}
function isString(token) {
    return /^".*"$/.test(token);
}
function isOperator(token) {
    return OPERATOR_SOURCES.includes(token);
}
function isParenthesis(token) {
    return /^[()]$/.test(token);
}
function isOpenParenthesis(token) {
    return token == "(";
}
function isComma(token) {
    return token == ",";
}
function isSemicolon(token) {
    return /^[;]$/.test(token);
}
var OperatorSource;
(function (OperatorSource) {
    OperatorSource[OperatorSource["="] = 0] = "=";
    OperatorSource[OperatorSource["<"] = 1] = "<";
    OperatorSource[OperatorSource[">"] = 2] = ">";
    OperatorSource[OperatorSource["<="] = 3] = "<=";
    OperatorSource[OperatorSource[">="] = 4] = ">=";
    OperatorSource[OperatorSource["<>"] = 5] = "<>";
    OperatorSource[OperatorSource["!="] = 6] = "!=";
    OperatorSource[OperatorSource["LIKE"] = 7] = "LIKE";
    OperatorSource[OperatorSource["NOT LIKE"] = 8] = "NOT LIKE";
    OperatorSource[OperatorSource["IN"] = 9] = "IN";
    OperatorSource[OperatorSource["NOT IN"] = 10] = "NOT IN";
    OperatorSource[OperatorSource["BETWEEN"] = 11] = "BETWEEN";
    OperatorSource[OperatorSource["NOT BETWEEN"] = 12] = "NOT BETWEEN";
    OperatorSource[OperatorSource["IS"] = 13] = "IS";
    OperatorSource[OperatorSource["IS NOT"] = 14] = "IS NOT";
    OperatorSource[OperatorSource["REGEXP"] = 15] = "REGEXP";
    OperatorSource[OperatorSource["NOT REGEXP"] = 16] = "NOT REGEXP";
    OperatorSource[OperatorSource["AND"] = 17] = "AND";
    OperatorSource[OperatorSource["OR"] = 18] = "OR";
    OperatorSource[OperatorSource["XOR"] = 19] = "XOR";
    OperatorSource[OperatorSource["||"] = 20] = "||";
    OperatorSource[OperatorSource["+"] = 21] = "+";
    OperatorSource[OperatorSource["-"] = 22] = "-";
    OperatorSource[OperatorSource["*"] = 23] = "*";
    OperatorSource[OperatorSource["/"] = 24] = "/";
    OperatorSource[OperatorSource["%"] = 25] = "%";
    OperatorSource[OperatorSource["^"] = 26] = "^";
    OperatorSource[OperatorSource["&"] = 27] = "&";
    OperatorSource[OperatorSource["AS"] = 28] = "AS";
})(OperatorSource = exports.OperatorSource || (exports.OperatorSource = {}));
;
const OPERATOR_SOURCES = Object.values(OperatorSource);
var OperatorType;
(function (OperatorType) {
    OperatorType[OperatorType["PLUS"] = 0] = "PLUS";
    OperatorType[OperatorType["MINUS"] = 1] = "MINUS";
    OperatorType[OperatorType["MULTIPLY"] = 2] = "MULTIPLY";
    OperatorType[OperatorType["DIVIDE"] = 3] = "DIVIDE";
    OperatorType[OperatorType["MODULO"] = 4] = "MODULO";
    OperatorType[OperatorType["POWER"] = 5] = "POWER";
    OperatorType[OperatorType["AND"] = 6] = "AND";
    OperatorType[OperatorType["OR"] = 7] = "OR";
    OperatorType[OperatorType["XOR"] = 8] = "XOR";
    OperatorType[OperatorType["CONCAT"] = 9] = "CONCAT";
    OperatorType[OperatorType["EQUAL"] = 10] = "EQUAL";
    OperatorType[OperatorType["LESS"] = 11] = "LESS";
    OperatorType[OperatorType["GREATER"] = 12] = "GREATER";
    OperatorType[OperatorType["LESS_EQUAL"] = 13] = "LESS_EQUAL";
    OperatorType[OperatorType["GREATER_EQUAL"] = 14] = "GREATER_EQUAL";
    OperatorType[OperatorType["NOT_EQUAL"] = 15] = "NOT_EQUAL";
    OperatorType[OperatorType["LIKE"] = 16] = "LIKE";
    OperatorType[OperatorType["NOT_LIKE"] = 17] = "NOT_LIKE";
    OperatorType[OperatorType["IN"] = 18] = "IN";
    OperatorType[OperatorType["NOT_IN"] = 19] = "NOT_IN";
    OperatorType[OperatorType["BETWEEN"] = 20] = "BETWEEN";
    OperatorType[OperatorType["NOT_BETWEEN"] = 21] = "NOT_BETWEEN";
    OperatorType[OperatorType["IS"] = 22] = "IS";
    OperatorType[OperatorType["IS_NOT"] = 23] = "IS_NOT";
    OperatorType[OperatorType["REGEXP"] = 24] = "REGEXP";
    OperatorType[OperatorType["NOT_REGEXP"] = 25] = "NOT_REGEXP";
    OperatorType[OperatorType["BITWISE_AND"] = 26] = "BITWISE_AND";
    OperatorType[OperatorType["BITWISE_OR"] = 27] = "BITWISE_OR";
    OperatorType[OperatorType["BITWISE_XOR"] = 28] = "BITWISE_XOR";
})(OperatorType = exports.OperatorType || (exports.OperatorType = {}));
function getOperatorName(token) {
    switch (token) {
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
exports.getOperatorName = getOperatorName;
class ExpressionContainer {
    constructor(type = "UNKNOWN") {
        this.info = {};
        this.type = type;
    }
    get(key, defaultVal = null) {
        return this.info[key] || defaultVal;
    }
    set(key, value) {
        this.info[key] = value;
    }
    setLeftNode(node) {
        if (!(node instanceof ExpressionContainer)) {
            throw new Error('Left node must be an ExpressionContainer');
        }
        this.set('LEFT_NODE', node);
    }
    setRightNode(node) {
        if (!(node instanceof ExpressionContainer)) {
            throw new Error('Right node must be an ExpressionContainer');
        }
        this.set('RIGHT_NODE', node);
    }
    setOperator(operator) {
        if (!OPERATOR_SOURCES.includes(operator)) {
            throw new Error('Operator must be an OperatorSource');
        }
        this.set('OPERATOR', operator);
    }
    setName(name) {
        this.set('NAME', name);
    }
    getName() {
        return this.get('NAME');
    }
    setList(list) {
        if (!(list instanceof Array)) {
            list = new Array(list);
        }
        this.set('LIST', list);
    }
    setAppendKeywords(keywords) {
        if (!(keywords instanceof Array)) {
            throw new Error('Keywords must be an Array');
        }
        this.set('APPEND_KEYWORDS', keywords);
    }
    setPrincipalKeyword(keyword) {
        if (typeof keyword !== 'string') {
            throw new Error('Keyword must be a string');
        }
        this.set('PRINCIPAL_KEYWORD', keyword);
    }
    getLeftNode() {
        return this.get('LEFT_NODE');
    }
    getRightNode() {
        return this.get('RIGHT_NODE');
    }
    getOperator() {
        return this.get('OPERATOR');
    }
    getList() {
        return this.get('LIST') || [];
    }
    getAppendKeywords() {
        return this.get('APPEND_KEYWORDS') || [];
    }
    getPrincipalKeyword() {
        return this.get('PRINCIPAL_KEYWORD');
    }
    isLiteral() {
        return this.type === "Literal";
    }
    isFunction() {
        return this.type === "FunctionExpression";
    }
    isBinaryExpression() {
        return this.type === "BinaryExpression";
    }
    isUnaryExpression() {
        return this.type === "UnaryExpression";
    }
    isIdentifier() {
        return this.type === "IdentifierExpression";
    }
}
exports.ExpressionContainer = ExpressionContainer;
function buildExpression(tokens, belong, state) {
    let current = tokens.peekAndNext();
    console.log(current.value);
    switch (current.type) {
        case TokenType.KEYWORD:
            if (isPrincipalKeyword(current.value)) {
                if (state.length > 0 && state[state.length - 1] !== 'PRINCIPAL_KEYWORD') {
                    throw new Error('Unexpected keyword ' + current.value);
                }
                state.push('PRINCIAPAL_KEYWORD');
                belong.setPrincipalKeyword(current.value);
                belong.type = "RootClosure";
                let expr = new ExpressionContainer();
                buildExpression(tokens, expr, state);
                belong.set("expr", expr);
                state.pop();
            }
            else {
                if (state.length === 0) {
                    throw new Error(`Invalid expression: ${current.value}`);
                }
                belong.setAppendKeywords(tokens.takeUntil(x => ALL_KEYWORDS.includes(x.value))
                    .map(x => x.value));
            }
            break;
        case TokenType.IDENTIFIER:
            var identifierName = current.value;
            if (state.length === 0) {
                throw new Error(`Invalid expression: ${current.value}`);
            }
            if (!tokens.hasNext()) {
                belong.type = 'IdentifierExpression';
                belong.setName(identifierName);
                break;
            }
            let peekToken = tokens.peek();
            if (peekToken.value === ',' || peekToken.value === ';'
                || peekToken.value === 'EOF'
                || peekToken.value === ")"
                || isPrincipalKeyword(peekToken.value)) {
                belong.type = 'IdentifierExpression';
                belong.setName(identifierName);
                break;
            }
            current = tokens.peekAndNext();
            if (current.type === TokenType.OPERATOR) {
                var left = new ExpressionContainer("IdentifierExpression");
                left.setName(identifierName);
                belong.type = ("BinaryExpression");
                var right = new ExpressionContainer();
                buildExpression(tokens, right, state);
                belong.setOperator(current.value);
                belong.setLeftNode(left);
                belong.setRightNode(right);
            }
            else if (isOpenParenthesis(current.value)) {
                belong.type = ("FunctionExpression");
                state.push('FUNCTION_SCOPE');
                belong.setName(identifierName);
                let argExpression = new ExpressionContainer();
                buildExpression(tokens, argExpression, state);
                belong.setList(argExpression);
                if (tokens.nextEqualToCloseParenthesis()) {
                    state.pop();
                }
                else {
                    throw new Error(`Invalid expression: ${current.value}`);
                }
            }
            break;
        case TokenType.NUMBER:
        case TokenType.STRING:
            break;
        case TokenType.OPERATOR:
            if (state.length === 0) {
                throw new Error(`Invalid expression: ${current.value}`);
            }
            let peek = tokens.peek();
            if (peek.type === TokenType.OPERATOR ||
                peek.value === ")" ||
                peek.type === TokenType.COMMA ||
                peek.type === TokenType.SEMICOLON ||
                peek.type === TokenType.EOF) {
                throw new Error(`Invalid expression: ${current.value}`);
            }
            belong.setOperator(current.value);
            belong.type = ("UnaryExpression");
            let rightNode = new ExpressionContainer();
            buildExpression(tokens, rightNode, state);
            belong.setRightNode(rightNode);
            break;
        case TokenType.PARENTHESIS:
            if (isOpenParenthesis(current.value)) {
                var expr = new ExpressionContainer();
                state.push('EXPRESSION_SCOPE');
                buildExpression(tokens, expr, state);
                if (tokens.nextEqualToCloseParenthesis()) {
                    tokens.incrementIndex();
                    state.pop();
                }
                else {
                    throw new Error(`Invalid expression: ${current.value}`);
                }
                current = tokens.peekAndNext();
                if (current.type === TokenType.OPERATOR) {
                    belong.type = ("BinaryExpression");
                    belong.setOperator(current.value);
                    belong.setLeftNode(expr);
                    let rightNode = new ExpressionContainer();
                    belong.setRightNode(rightNode);
                    buildExpression(tokens, rightNode, state);
                }
            }
            else {
                if (tokens.nextEqualToCloseParenthesis()) {
                    state.pop();
                }
                else {
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
}
exports.buildExpression = buildExpression;
