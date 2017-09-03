import { IUsersRepository, UsersRepository } from './../../src/repository/usersRepository';
import { DebtInputEntity } from './../../src/entities';
import { IDebt, IUser } from './../../src/model';
import { DatabaseProvider } from './../../src/databaseProvider';
import { DebtsRepository, IDebtsRepository } from './../../src/repository/debtsRepository';
import { TestDatabaseProvider } from "../testDatabaseProvider";
import { expect } from 'chai';

describe('The debts repository', () => {

    let sut: IDebtsRepository;
    const testDebt: DebtInputEntity = {
        debtorId: 1,
        creditorId: 2,
        amount: 10,
        timestamp: Date.now(),
        reason: "It's a Test"

    };
    const testDebt2 = Object.assign({}, testDebt);
    testDebt2.creditorId = testDebt.debtorId;
    testDebt2.debtorId = testDebt.creditorId;

    beforeEach(async () => {
        const dbProvider = new TestDatabaseProvider();
        await dbProvider.initDatabase();
        sut = new DebtsRepository(dbProvider);
    });

    it('should add a debt', async () => {
        const result = await sut.add(testDebt);
        expect(result.timestamp).to.equal(testDebt.timestamp);
    });

    it('should only return debts summaries of other users', async () => {
        // arrange
        await sut.add(testDebt);
        await sut.add(testDebt2);

        // act
        const result = await sut.getAllGroupedByUser(1);

        // assert
        expect(result.map(d => d.user._id)).not.to.contain(1);
    });
    
        it('should calculate the debts difference of a debts summary correctly', async () => {
            // arrange
            await sut.add(testDebt);
            await sut.add(testDebt);
            await sut.add(testDebt2);

            // act
            const result = await sut.getAllGroupedByUser(1);

            // assert
            const expectedDiff = testDebt2.amount - (testDebt.amount + testDebt.amount);
            expect(result[0].debtDifference).to.equal(expectedDiff);
        });

    it('should return a debts summary for Christiane', async () => {
        // arrange
        await sut.add(testDebt);
        await sut.add(testDebt2);

        // act
        const result = await sut.getAllGroupedByUser(1);

        // assert
        expect(result.map(d => d.user.firstName)).to.contain("Christiane");
    });
});