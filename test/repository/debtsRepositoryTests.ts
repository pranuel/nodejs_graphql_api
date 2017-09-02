import { IUsersRepository, UsersRepository } from './../../src/repository/usersRepository';
import { DebtInputEntity } from './../../src/entities';
import { IDebt, IUser } from './../../src/model';
import { DatabaseProvider } from './../../src/databaseProvider';
import { DebtsRepository, IDebtsRepository } from './../../src/repository/debtsRepository';
import { TestDatabaseProvider } from "../testDatabaseProvider";
import { expect } from 'chai';

describe('The debts repository', () => {

    let sut: IDebtsRepository;

    beforeEach(async () => {
        const dbProvider = new TestDatabaseProvider();
        await dbProvider.initDatabase();
        sut = new DebtsRepository(dbProvider);
    });

    it('should add a debt', async () => {
        const debt: DebtInputEntity = {
            debtorId: 1,
            creditorId: 2,
            amount: 10,
            timestamp: Date.now(),
            reason: "It's a Test"

        };
        const result = await sut.add(debt);
        expect(result.timestamp).to.equal(debt.timestamp);
    });

    it('should only return debts summaries of other users', async () => {
        const result = await sut.getAllGroupedByUser(1);
        expect(result.map(d => d.user._id)).not.to.contain(1);
    });

    it('should return a debts summary for Christiane', async () => {
        const result = await sut.getAllGroupedByUser(1);
        expect(result.map(d => d.user.firstName)).to.contain("Christiane");
    });
});