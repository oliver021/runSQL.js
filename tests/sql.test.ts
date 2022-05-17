import { expect } from 'chai';
import { tokenize, buildExpression, ExpressionContainer } from '../src/sql';
import { TokensIteration } from '../src/TokensIteration';
import { inspect } from  'util'


describe("Test sql lexer", () => {
    it("should tokenize the sql statement", () => {
        let sql = "select * from table where id = 1";
        let tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["select", "*", "from", "table", "where", "id", "=", "1"]);

        sql = "select * from table where id = 1 and name = 'test'";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["select", "*", "from", "table", "where", "id", "=", "1", "and", "name", "=", "'test'"]);
        
        // next example with grouping
        sql = "select * from table where (id = 1 and name = 'test') or (id = 2 and name = 'test2')";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["select", "*", "from", "table", "where", "(", "id", "=", "1", "and", "name", "=", "'test'", ")", "or", "(", "id", "=", "2", "and", "name", "=", "'test2'", ")"]);

        // next example with order by
        sql = "select * from table where id = 1 order by id";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["select", "*", "from", "table", "where", "id", "=", "1", "order", "by", "id"]);

        // next example with order by and grouping
        sql = "select * from table where (id = 1 and name = 'test') or (id = 2 and name = 'test2') order by id";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["select", "*", "from", "table", "where", "(", "id", "=", "1", "and", "name", "=", "'test'", ")", "or", "(", "id", "=", "2", "and", "name", "=", "'test2'", ")", "order", "by", "id"]);

        // simple literals
        sql = "SELECT 1 + 1";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "1", "+", "1"]);

        // select strings
        sql = "SELECT 'test'";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "'test'"]);

        // select strings with backtick quotes
        sql = "SELECT `test`";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "`test`"]);

        // select strings with backtick quotes and backslash
        sql = "SELECT `test\\`";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "`test\\`"]);

        sql = "SELECT test.query";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "test", ".", "query"]);

        sql = "SELECT db.test.query";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "db", ".", "test", "." ,"query"]);

        sql = "SELECT db.test.query.test <> 1";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "db", ".", "test", ".", "query", ".", "test", "<>", "1"]);

        sql = "SELECT ((1 + 1) * 2)";
        tokens = tokenize(sql);
        expect(tokens).to.deep.equal(["SELECT", "(", "(", "1", "+", "1", ")", "*", "2", ")"]);
    });
});

describe("Test sql syntaxt parser", () => {
    it("should parse the sql statement", () => {
        var tokens = tokenize("SELECT data");
        // make sure we have a valid token list
        // convert into Iterable
        var iter = new TokensIteration(tokens);
        // build the expression
        var root = new ExpressionContainer();
        buildExpression(iter, root, []);
        console.log(root);
        // expr should be principal keywords
        expect(root.type).to.equal("RootClosure");
        expect(root.getPrincipalKeyword()).to.equal("SELECT");

        /* never mind these stuffs
        var tokens = tokenize("SELECT data FROM table");
        // make sure we have a valid token list
        // convert into Iterable
        var iter = new TokensIteration(tokens);
        // build the expression
        var root = new ExpressionContainer();
        buildExpression(iter, root, []);
        console.log(root);
        buildExpression(iter, root, []);
        console.log(root);
        */

        let showOptions = {showHidden: false, depth: null, colors: true};
        var tokens = tokenize("SELECT ((amount1 + amount2) * rate) - discount");
        console.log(inspect(tokens, showOptions))

        // make sure we have a valid token list
        // convert into Iterable
        var iter = new TokensIteration(tokens);
        // build the expression
        var root = new ExpressionContainer();
        buildExpression(iter, root, []);
        console.log(inspect(root, showOptions))

    });
});