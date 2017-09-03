import { IUsersRepository, UsersRepository } from './../../src/repository/usersRepository';
import { IUser } from './../../src/model';
import { DatabaseProvider } from './../../src/databaseProvider';
import { TestDatabaseProvider } from "../testDatabaseProvider";
import { expect } from 'chai';

describe('The users repository', () => {

    let sut: IUsersRepository;

    beforeEach(async () => {
        const dbProvider = new TestDatabaseProvider();
        await dbProvider.initDatabase();
        sut = new UsersRepository(dbProvider);
    });

    it('should return me when providing my sub', async () => {
        const sub = "facebook|1080925881970593";
        let me = await sut.getMe(sub);
        expect(me.firstName).to.equal("Manuel");
    });
});