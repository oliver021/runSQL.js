import { ProcessState } from "./queryPipeline";

// sql closure constants
export const GROUP_BY_CLOSURE = 'groupBy';
export const ORDER_BY_CLOSURE = 'orderBy';
export const LIMIT_CLOSURE = 'limit';
export const OFFSET_CLOSURE = 'offset';
export const SELECT_CLOSURE = 'select';
export const FROM_CLOSURE = 'from';
export const WHERE_CLOSURE = 'where';
export const JOIN_CLOSURE = 'join';
export const HAVING_CLOSURE = 'having';

/* group of functions that implement Pipeline */
// the functions are exportables
// the shloud be added to one pipeline
// the pipeline is the main object that is used to run the pipeline
// these next functions represent the basic pipes

/**
 * @function groupBy
 * @description A pipe that groups the records by a given column
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 */
export function groupBy(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {

    // find the given key in parameters
    const key = state.getParameter(GROUP_BY_CLOSURE, null);

    if (key === null) {
        throw new Error('The key is not defined');
    }
    
    // convert iterable to array
    let srcArray = Array.from(source);

    // find distinct values from the source using the key column
    const distinctValues = srcArray.reduce((acc, curr) => {
        if (!acc.includes(curr[key])) {
            acc.push(curr[key]);
        }
        return acc;
    }, []);

    // get HAVING clause function from parameters
    const having = state.getParameter(HAVING_CLOSURE, null);

    // track that the pipeline was in this pipe
    state.setState("_track" + GROUP_BY_CLOSURE, true);

    let result = distinctValues.map((value: any) => {
        return {
            [key]: value,
            data: srcArray.filter(item => item[key] === value)
            .map(item => __excludeColumns(item,key))
        };
    });

    // if there is a HAVING clause then apply it
    if (having !== null) {
        result = result.filter(having);
    }

    // finally return the grouped records
    return next(result);

    // given any object, exclude the given column by passed key
    function __excludeColumns(source: any, key: string): any {
        const newSource: any = {};
        for (const prop in source) {
            if (prop !== key) {
                newSource[prop] = source[prop];
            }
        }
        return newSource;
    }
}

/**
 * @function orderBy
 * @description A pipe that orders the records by a given column
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 */
export function orderBy(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
    
        // find the given key in parameters
        const key = state.getParameter(ORDER_BY_CLOSURE, null);
    
        if (key === null) {
            throw new Error('The key is not defined');
        }
    
        // convert iterable to array
        let srcArray = Array.from(source);
    
        // order by
        return next(srcArray.sort((a, b) => {
            if (a[key] < b[key]) {
                return -1;
            }

            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        }));
}

/**
 * @function limit
 * @description A pipe that limits the records
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function limit(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
      // find the given key in parameters
      const limit = state.getParameter(LIMIT_CLOSURE, null);
        
      if (limit === null) {
          throw new Error('The limit is not defined');
      }
  
      // convert iterable to array
      let srcArray = Array.from(source);
  
      // limit
      return next(srcArray.slice(0, limit));
}

/**
 * @function offset
 * @description A pipe that offsets the records
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function offset(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
     // find the given key in parameters
     const offset = state.getParameter(OFFSET_CLOSURE, null);
            
     if (offset === null) {
         throw new Error('The offset is not defined');
     }
 
     // convert iterable to array
     let srcArray = Array.from(source);
 
     // offset
     return next(srcArray.slice(offset));
}

/**
 * @function select
 * @description A pipe that selects the records
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function select(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
    // find the given key in parameters
    const select = state.getParameter(SELECT_CLOSURE, null);
                
    if (select === null) {
        throw new Error('The select is not defined');
    }

    // convert iterable to array
    let srcArray = Array.from(source);

    // select
    return next(srcArray.map(item => {
        let newItem: {[key: string]:any} = {};
        select.forEach((key: string | number) => {
            newItem[key] = item[key];
        });
        return newItem;
    }));
}

/**
 * @function from
 * @description A pipe that selects the source
 * @param {Iterable<any>} _source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function from(_source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
    // find the given key in parameters
    const from = state.getParameter(FROM_CLOSURE, null);
                
    if (from === null) {
        throw new Error('The from is not defined');
    }

    // verify if the from is a string
    if (typeof from !== 'string') {
        throw new Error('The from is not a string');
    }

    // verify if the from is exist in environment
    if (!state.environment.hasSource(from)) {
        throw new Error('The source is not exist in environment');
    }

    return next(state.environment.getSource(from) as Iterable<any>);
}

/**
 * @function where
 * @description A pipe that filters the records
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function where(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
    // find the given key in parameters
    const where = state.getParameter(WHERE_CLOSURE, null);
                
    if (where === null) {
        throw new Error('The where is not defined');
    }

    // verify if the where is a function
    if (typeof where !== 'function') {
        throw new Error('The where is not a function');
    }

    // convert iterable to array
    let srcArray = Array.from(source);

    // where
    return next(srcArray.filter(where));
}

/**
 * @function join
 * @description A pipe that joins the records
 * @param {Iterable<any>} source
 * @param {ProcessState} state
 * @param {Pipe} next
 * @returns {Iterable<any>}
 * @throws {Error}
 */
export function join(source: Iterable<any>, state: ProcessState, next: (source: Iterable<any>) => Iterable<any>): Iterable<any> {
    // find the given key in parameters
    const join = state.getParameter(JOIN_CLOSURE, null);
                
    if (join === null) {
        throw new Error('The join is not defined');
    }

    // join should be an array
    // join: [{target: string, type: string, on: Function}]
    if (!Array.isArray(join)) {
        throw new Error('The join is not an array');
    }

    return next(__join());

    // join the records with the given join specification
    // join: [{target: string, type: string, on: Function}]
    function __join(): Iterable<any> {
        // convert iterable to array
        let result: any[] = [];
        let prevSource = Array.from(source);

        for(let i = 0; i < join.length; i++) {
            const item = join[i];
            const target = item.target;
            const type = item.type;
            const on = item.on;

            // verify if the target is a string
            if (typeof target !== 'string') {
                throw new Error('The target is not a string');
            }

            // verify if the type is a string
            if (typeof type !== 'string') {
                throw new Error('The type is not a string');
            }

            // verify if the on is a function
            if (typeof on !== 'function') {
                throw new Error('The on is not a function');
            }

            // verify if the target is exist in environment
            if (!state.environment.hasSource(target)) {
                throw new Error('The target is not exist in environment');
            }

            // get the target source
            const targetSource = Array.from(state.environment.getSource(target) as Iterable<any>);

            // join types: left, right, inner
            // yield news source rows base on join type like SQL
            switch(type) {
                case 'inner':
                    for (let j = 0; j < prevSource.length; j++) {
                        const prevItem = prevSource[j];
                        for (let k = 0; k < targetSource.length; k++) {
                            const targetItem = targetSource[k];
                            if (on(prevItem, targetItem)) {
                                result.push(Object.assign({}, prevItem, targetItem));
                            }
                        }
                    }
                break;
                case 'left':
                    for (let j = 0; j < prevSource.length; j++) {
                        const prevItem = prevSource[j];
                        for (let k = 0; k < targetSource.length; k++) {
                            const targetItem = targetSource[k];
                            if (on(prevItem, targetItem)) {
                                result.push(Object.assign({}, prevItem, targetItem));
                            }else{
                                result.push(Object.assign({}, prevItem));
                            }
                        }
                    }
                break;
                case 'right':
                    for (let j = 0; j < prevSource.length; j++) {
                        const prevItem = prevSource[j];
                        for (let k = 0; k < targetSource.length; k++) {
                            const targetItem = targetSource[k];
                            if (on(prevItem, targetItem)) {
                                result.push(Object.assign({}, targetItem, prevItem));
                            }else{
                                result.push(Object.assign({}, targetItem));
                            }
                        }
                    }
                break;
                default:
                    throw new Error('The type is not supported');
            }

            // set the prev source
            prevSource = result;
        }

        // in the end, return the result is equal to the last source through variable prevSource
        // but the result is better
        return result;
    }
}
