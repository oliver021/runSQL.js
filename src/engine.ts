import { Parser, Option, Select } from "node-sql-parser";
import { Environment } from './environment';

export class Engine {
    private parser: Parser;;

    constructor(public enviorenment: Environment, public options: Option = {}) {
        this.parser = new Parser();
    }

    public run(sql: string): Iterable<any> {
        const ast = this.parser.parse(sql, this.options);
        return this.process(ast);
    }

    private process(ast: any): Iterable<any> {
        switch (ast.type) {
            case 'select':
                return this.processSelect(ast);
            case 'insert':
            case 'replace':
                return this.processInsert(ast);
            case 'update':
                return this.processUpdate(ast);
            case 'delete':
                return this.processDelete(ast);
            case 'alter':
                throw new Error('Not supported');
            case 'create':
                 throw new Error('Not supported');
            case 'use':
                return this.processUse(ast);

            default:
                throw new Error('Not supported');
        }
    }
    processUpdate(ast: any): Iterable<any> {
        throw new Error("Method not implemented.");
    }
    processDelete(ast: any): Iterable<any> {
        throw new Error("Method not implemented.");
    }
    processUse(ast: any): Iterable<any> {
        throw new Error("Method not implemented.");
    }

    private processSelect(ast: Select): Iterable<any> {
        throw new Error("Method not implemented.");
    }

    private processInsert(ast: any): Iterable<any> {
        throw new Error("Method not implemented.");
    }
}

