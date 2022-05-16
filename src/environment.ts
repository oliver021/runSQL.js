/**
 * @class Environment
 * @description This class is used to store the environment sources
 * @author Oliver Valiente
 * @export Environment
 */
export class Environment 
{
    private sources: Map<string, Iterable<any>> = new Map();
   
    /**
     * @method addSource
     * @description This method is used to add a source to the environment
     * @returns void
     */
    public addSource(name: string, source: Iterable<any>): void
    {
        this.sources.set(name, source);
    }
    
    /**
     * @method getSource
     * @description This method is used to get a source from the environment 
     * @returns {Iterable<any>}
     */
    public getSource(name: string): Iterable<any> | undefined
    {
        return this.sources.get(name);
    }

    /**
     * @method getSources
     * @description This method is used to get all sources from the environment
     * @returns {Iterable<any>}
     */
    public getSources(): Iterable<[string, Iterable<any>]>
    {
        return this.sources;
    }

    /**
     * @method hasSource
     * @description This method is used to check if a source exists in the environment
     * @param {string} name
     * @returns {boolean}
     */
    public hasSource(name: string): boolean
    {
        return this.sources.has(name);
    }

    /**
     * @method removeSource
     * @description This method is used to remove a source from the environment
     * @returns void
     */
    public removeSource(name: string): void
    {
        this.sources.delete(name);
    }

    /**
     * @method getSourceNames
     * @description This method is used to get the sources names
     * @returns {string[]} The sources names
     */
    public getSourcesNames(): string[]
    {
        return Array.from(this.sources.keys());
    }

    /**
     * @method getSourceRow
     * @description This method is used to count the number of rows in a source
     * @param name The source name
     * @returns {number} the source elements or -1 if the source does not exist
     */
    public countSourceRow(name: string): number
    {
        let source = this.getSource(name);
        if(source)
        {
            // iterate through the source and count the number of rows
            let row = 0;
            for(let {} of source)
            {
                row++;
            }
            return row;
        }else{
            return -1;
        }
    }
}