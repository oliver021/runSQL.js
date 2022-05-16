/*// contains revelevant information about the select query
// that will be taken from SQL parser through the Select class
// the props are:
// columns: Array<ColumnSpecification>
// from: Array<TableSpecification>
// joins: Array<{target: string, type: string, on: Array<FilterExpression>}>
// where: Array<FilterExpression>
// groupBy: keySpecification
// having: Array<FilterExpression>
// orderBy: {key: string, desc: true|false} keySpecification and sortType (asc/desc)
// limit: number
// offset: number
export interface SelectClosure{
    allColumns: boolean;
    columns: Array<ColumnSpecification>;
    from: Array<TableSpecification>;
    joins: Array<{target: string, type: string, on: Array<FilterExpression>}>;
    where: Array<FilterExpression>;
    groupBy: string;
    having: Array<FilterExpression>;
    orderBy: {key: string, desc: boolean};
    limit: number;
    offset: number;
}

// contains the information about the columns
export interface ColumnSpecification{
    name: string;
    alias: string;
    table: string;
    type: string;
}

// contains the information about the tables
export interface TableSpecification{
    name: string;
    alias: string;
}

// contains the information about the filter expressions
export interface JoinSpecification{
    target: string;
    type: string;
    on: Array<FilterExpression>;
}

// contains the information about the filter expressions
export interface FilterExpression{
    type: ExpressionType; // expression type can be: enum ExpressionType
    left: FilterExpression;
    right?: FilterExpression;
    operator: OperatorType; // can be 
    values?: Array<any>;
    query?: SelectClosure;
}

// this enuemrable contains all the possible types of expressions
export enum ExpressionType{
    number,
    string,
    single_quote_string,
    backticks_quote_string,
    "bool",
    "function",
    binary_expr,
    unary_expr,
    function_expr,
    in_expr,
    between_expr,
    like_expr,
    is_expr,
    null_comparison_expr,
    column_ref,
    subquery,
    case_expr,
    exists_expr,
    scalar_subquery,
    row_subquery,
    expr_list, // is like 'a, b, c' in sql
 }
 */