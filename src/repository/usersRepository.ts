import { IUser } from './../model';
import { BaseRepository, IRepository } from "./repository";

export interface IUsersRepository extends IRepository<IUser> {
    getMe(sub: string): Promise<IUser>;
}

export class UsersRepository extends BaseRepository<IUser> {

    getAll(): Promise<IUser[]> {
        return this.database.all("SELECT * FROM Users");
    }

    async get(id: number): Promise<IUser> {
        let user = this.database.get("SELECT * FROM Users WHERE _id = ?", id);
        return user;
    }

    getMe(sub: string): Promise<IUser> {
        return this.database.get("SELECT * FROM Users WHERE sub = ?", sub);
    }

    update(id: string, data: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    async add(data: IUser): Promise<IUser> {
        let stmt = await this.database.run("INSERT INTO Users (firstName, lastName, photoUrl, sub) VALUES (?, ?, ?, ?)", data.firstName, data.lastName, data.photoUrl, data.sub);
        let user = await this.get(stmt.lastID);
        return user;
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}