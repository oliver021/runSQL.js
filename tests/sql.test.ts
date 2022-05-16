import { expect } from 'chai';
import { tokenize } from '../src/sql';

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
    });
});