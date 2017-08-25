import { IDebt } from './../model';
import { IRepository, BaseRepository } from './repository';

export interface IDebtsRepository extends IRepository<IDebt> { }

export class DebtsRepository extends BaseRepository<IDebt> {

    getAll(): Promise<IDebt[]> {
        return this.database.all("SELECT * FROM Debts");
    }

    get(id: string): Promise<IDebt> {
        throw new Error("Method not implemented.");
    }

    update(id: string, data: IDebt): Promise<IDebt> {
        throw new Error("Method not implemented.");
    }

    add(data: IDebt): Promise<IDebt> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}