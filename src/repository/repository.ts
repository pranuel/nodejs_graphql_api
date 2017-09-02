import { IDatabaseProvider } from './../databaseProvider';
import { Database } from 'sqlite';

export interface IRepository<T> {

    getAll(): Promise<T[]>;

    get(id: number): Promise<T>;

    delete(id: string): Promise<void>;

}

export abstract class BaseRepository<T> implements IRepository<T> {

    constructor(private databaseProvider: IDatabaseProvider) { }

    protected get database(): Database {
        return this.databaseProvider.database;
    }

    abstract getAll(): Promise<T[]>;

    abstract get(id: number): Promise<T>;

    abstract delete(id: string): Promise<void>;

}