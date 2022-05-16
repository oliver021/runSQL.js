import { Environment } from "./environment";

/**
 * @class Pipeline
 * @description The query pipeline is responsible for executing the query.
 * @param {Environment} environment The environment to use.
 * @param {Option} options The options to use.
 * @example
 * const pipeline = new Pipeline(environment, options);
 * const result = pipeline.run(objectIterable, state);
 */
export class Pipeline{
    pipes: Array<Pipe> = [];
    constructor(public environment: Environment){
    }

    /**
     * @method  add
     * @param {Pipe} pipe
     * @returns {Pipeline}
     * @public
     * @chainable
     * @example
     * pipeline.add(function(source, state, next){
     *     // do something
     *    return next(source, state);
     * });
     */
    add(pipe: Pipe): Pipeline{
        this.pipes.push(pipe);
        return this;
    }

    /**
     * @method run
     * @description run the pipeline
     * @param {Iterable<any>} source
     * @param {ProcessState} state
     * @returns {Iterable<any>}
     */
    run(source: Iterable<any>, state: ProcessState): Iterable<any>{
        // verify if the state is an instance of ProcessState
        if(!(state instanceof ProcessState)){
            throw new Error('The state is not an instance of ProcessState');
        }

        // verify if pipeline is empty
        if(this.pipes.length === 0){
            return source;
        }
        
        return this.pipes[0]
        .call(null, source, state, this._run.bind(this, source, state, 1));
    }

    /**
     * @method  _run
     * @param source
     * @param state
     * @param index
     * @returns {Iterable<any>}
     * @private
     */
    private _run(source: Iterable<any>, state: ProcessState, index: number): Iterable<any>{
        if(index >= this.pipes.length){
            return source;
        }
        return this.pipes[index].call(null, source, state, this._run.bind(this, source, state, index + 1));
    }
}
/**
 * @interface Pipe
 * @description This interface is used to define a pipe
 * @property {string} name
 * @property {ProcessState} state
 * @property {Pipe} next
 * @returns {Iterable<any>}
 */
export interface Pipe {
    (source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any>;
}


/**
 * @class Pipe
 * @description This class is used to define a pipe
 * @property {string[]} columns
 * @property { [key: string]: any } parameters
 * @export
 */
export class ProcessState{
    /**
     * @property columns
     * @description The columns to set in this state
     * @type {Array<string>}
     * @default []
     * @public
     * @readonly
     * @summary This property is readonly and contains the columns to set in this state
     * you can check if a column exists using the hasColumn method
     * The columns array is to know which columns are arguments of the pipeline
     */
    public readonly columns: Array<string>;

    /**
     * @property parameters
     * @description The parameters to set in this state
     * @type {Array<string>}
     * @default []
     * @public
     * @readonly
     */
    public readonly parameters: { [key: string]: any } = {};

    /**
     * @property {string[]} state
     * @description The state bag of the pipeline
     * @type {Array<string>}
     * @default []
     */
    public state: { [key: string]: any } = {};

    /**
     * @constructor
     * @description The constructor for the ProcessState class
     * @param {Array<string>} columns The columns to set in this state
     * @param {Array<string>} parameters The parameters to set in this state
     * @public
     * @returns {void}
     * @example
     * const state = new ProcessState(['id', 'name'], { id: 1, name: 'John' });
     * console.log(state.columns);
     * // ['id', 'name']
     * console.log(state.parameters);
     * // { id: 1, name: 'John' }
     * console.log(state.parameters.id);
     * // 1
     * console.log(state.parameters.name);
     * // 'John'
     * console.log(state.parameters.age);
     * // undefined
     */
    constructor(public environment: Environment, columns?: Array<string>, parameters?: { [key: string]: any }){
        this.columns = columns || [];
        this.parameters = parameters || {};
    }

    /**
     * @method hasColumn
     * @description This method is used to check if a column exists
     * @param {string} name The name of the column
     * @returns {boolean} True if the column exists, false otherwise
     * @public
     * @example
     * const state = new ProcessState(['id', 'name']);
     * console.log(state.hasColumn('id'));
     * // true
     * console.log(state.hasColumn('age'));
     * // false
     * console.log(state.hasColumn('name'));
     * // true
     */
    hasColumn(name: string): boolean {
        return this.columns.indexOf(name) !== -1;
    }

    /**
     * @method getColumns
     * @description This method is used to get the columns
     * @param {string} name The name of the parameter
     * @param {string} defaultValue The default value of the column
     * @returns {string} The value of the parameter
     * @public
     * @example
     * const state = new ProcessState(['id', 'name'], { id: 1, name: 'John' });
     * console.log(state.getParameter('id'));
     * // 1
     * console.log(state.getParameter('name', 'John Doe'));
     * // 'John Doe' if name parameter not found
     */
    getParameter(name: string, defaultValue: any = null): any {
        if (this.parameters.hasOwnProperty(name)) {
            return this.parameters[name];
        }
        return defaultValue;
    }

    /**
     * @method hasParameter
     * @description This method is used to check if a parameter exists
     * @param {string} name The name of the parameter
     * @returns {boolean} True if the parameter exists, false otherwise
     * @public
     */
    hasParameter(name: string): boolean {
        return this.parameters.hasOwnProperty(name);
    }

    /**
     * @method getState
     * @description This method is used to get the state bag
     * @param {string} name The name of the parameter
     * @param {any} defaultValue The default value of the column
     * @returns {any} The value of the parameter
     * @public
     */
    getState(name: string, defaultValue: any = null): any {
        if (this.state.hasOwnProperty(name)) {
            return this.state[name];
        }
        return defaultValue;
    }

    /**
     * @method setState
     * @description This method is used to set the state bag
     * @param {string} name The name of the parameter
     * @param {any} value The value of the parameter
     * @returns void
     * @public
     */ 
    setState(name: string, value: any): void {
        this.state[name] = value;
    }
}
