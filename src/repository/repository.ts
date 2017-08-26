import { DatabaseProvider } from './../databaseProvider';
import { Database } from 'sqlite';

export interface IRepository<T> {

    getAll(): Promise<T[]>;

    get(id: number): Promise<T>;

    update(id: string, data: T): Promise<T>;

    add(data: T): Promise<T>;

    delete(id: string): Promise<void>;

}

export abstract class BaseRepository<T> implements IRepository<T> {

    constructor(private databaseProvider: DatabaseProvider) { }

    protected get database(): Database {
        return this.databaseProvider.database;
    }

    abstract getAll(): Promise<T[]>;

    abstract get(id: number): Promise<T>;

    abstract update(id: string, data: T): Promise<T>;

    abstract add(data: T): Promise<T>;

    abstract delete(id: string): Promise<void>;

}