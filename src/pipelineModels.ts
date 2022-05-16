import { Option, Select } from "node-sql-parser";
import { Environment } from "./environment";
import { SelectClosure } from "./expressions";
import { Pipeline, ProcessState } from "./queryPipeline";

/* define for every type of query one pipeline model */

export class QueryInsertPipeline extends Pipeline {
    // in this context, the pipeline is responsible for executing the query
    // in this constructor we going to add the pipe to the pipeline
    constructor(public query: Select, environment: Environment, public options: Option = {}) 
    {
        super(environment);
    }

    /**
     * @method run
     * @description run the pipeline
     * @param {Iterable<any>} source
     * @param {ProcessState} state
     * @returns {Iterable<any>}
     * @public
     */
    execute(source: Iterable<any>): Iterable<any> {
        let payload: SelectClosure = {} as SelectClosure;

        let columns = this.query.columns;

        if(columns === "*"){
            payload.allColumns = true;
        }else{
            
        }

        return super.run(source, this.initState(payload));
    }

    initState(payload: SelectClosure): ProcessState {
        return this.initState(payload);
    }
}