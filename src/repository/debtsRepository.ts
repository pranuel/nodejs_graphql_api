import { DebtOutputEntity, DebtInputEntity } from './../entities';
import { IDebt, IDebtsSummaryByUser } from './../model';
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
        let debtEntities = await this.database.all(this.baseQuery) as DebtOutputEntity[];
        return debtEntities.map(debtEntity => {
            return this.mapEntity(debtEntity);
        });
    }

    async get(id: number): Promise<IDebt> {
        let debtEntity = await this.database.get(this.baseQuery + "WHERE D._id = ?", id) as DebtOutputEntity;
        return this.mapEntity(debtEntity);
    }

    async getAllGroupedByUser(ownUserId: string): Promise<IDebtsSummaryByUser[]> {
        let debtsSummaryByUser = await this.database.get(`
        SELECT
        SUM(D.amount) as totalAmount, U.*
        FROM Debts AS D
        JOIN Users AS U
        ON creditorId = U._id OR debtorId = U._id
        WHERE NOT U._id = ?
        GROUP BY U._id
        `, ownUserId);
        return debtsSummaryByUser;
    }

    update(id: string, data: IDebt): Promise<IDebt> {
        throw new Error("Method not implemented.");
    }

    async add(data: DebtInputEntity): Promise<IDebt> {
        let stmt = await this.database.run("INSERT INTO Debts (debtorId, creditorId, amount, timestamp, reason) VALUES (?, ?, ?, ?, ?);", data.debtorId, data.creditorId, data.amount, data.timestamp, data.reason);
        let debt = await this.get(stmt.lastID);
        return debt;
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private mapEntity(debtEntity: DebtOutputEntity): IDebt {
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