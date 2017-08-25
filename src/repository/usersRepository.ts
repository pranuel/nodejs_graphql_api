import { IUser } from './../model';
import { BaseRepository, IRepository } from "./repository";

export interface IUsersRepository extends IRepository<IUser> {
    getMe(sub: string): Promise<IUser>;
}

export class UsersRepository extends BaseRepository<IUser> {

    getAll(): Promise<IUser[]> {
        return this.database.all("SELECT * FROM Users");
    }

    get(id: string): Promise<IUser> {
        return this.database.get("SELECT * FROM Users WHERE _id = ?", id);
    }

    getMe(sub: string): Promise<IUser> {
        return this.database.get("SELECT * FROM Users WHERE sub = ?", sub);
    }

    update(id: string, data: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    add(data: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}