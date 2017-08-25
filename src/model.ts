export interface IRequest {
    user: {
        sub: string,
        scope: string,
        iss: string
    }
}

export interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    photoUrl: string,
    sub: string
}

export interface IDebt {
    _id: string,
    debtorId: string,
    creditorId: string,
    amount: number,
    timestamp: number,
    reason: string
}