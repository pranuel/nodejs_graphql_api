export interface IRequest {
    user: {
        sub: string,
        scope: string,
        iss: string
    }
}

export interface IUser {
    _id?: number,
    firstName: string,
    lastName: string,
    photoUrl: string,
    sub: string
}

export interface IDebt {
    _id?: number,
    debtor: IUser,
    creditor: IUser,
    amount: number,
    timestamp: number,
    reason: string
}