import { DebtEntity } from './../entities';
import { IDebt } from './../model';
import { IRepository, BaseRepository } from './repository';

export interface IDebtsRepository extends IRepository<IDebt> { }

export class DebtsRepository extends BaseRepository<IDebt> {

    private get baseQuery() {
        return `
        SELECT
        D._id, D.amount, D.timestamp, D.reason,
        U1._id as creditor_id, U1.firstName as creditor_firstName, U1.lastName as creditor_lastName, U1.photoUrl as creditor_photoUrl, U1.sub as creditor_sub,
        U2._id as debtor_id, U2.firstName as debtor_firstName, U2.lastName as debtor_lastName, U2.photoUrl as debtor_photoUrl, U2.sub as debtor_sub
        FROM Debts AS D
        JOIN Users AS U1
        ON creditorId = U1._id
        JOIN Users AS U2
        ON debtorId = U2._id
        `;
    }

    async getAll(): Promise<IDebt[]> {
        let debtEntities = await this.database.all(this.baseQuery) as DebtEntity[];
        return debtEntities.map(debtEntity => {
            return this.mapEntity(debtEntity);
        });
    }

    async get(id: string): Promise<IDebt> {
        let debtEntity = await this.database.get(this.baseQuery + "WHERE D._id = ?", id) as DebtEntity;
        return this.mapEntity(debtEntity);
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

    private mapEntity(debtEntity: DebtEntity): IDebt {
        return {
            _id: debtEntity._id,
            debtor: {
                _id: debtEntity.debtor_id,
                firstName: debtEntity.debtor_firstName,
                lastName: debtEntity.debtor_lastName,
                photoUrl: debtEntity.debtor_photoUrl,
                sub: debtEntity.debtor_sub
            },
            creditor: {
                _id: debtEntity.creditor_id,
                firstName: debtEntity.creditor_firstName,
                lastName: debtEntity.creditor_lastName,
                photoUrl: debtEntity.creditor_photoUrl,
                sub: debtEntity.creditor_sub
            },
            amount: debtEntity.amount,
            timestamp: debtEntity.timestamp,
            reason: debtEntity.reason
        };
    }

}