export interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    photoUrl: string
}

export interface IDebt {
    _id: string,
    debtor: IUser,
    creditor: IUser,
    amount: number,
    timestamp: number,
    reason: string
}

export interface IDebtsList {
    _id: string,
    title: string,
    members: IUser[],
    debts: IDebt[],
    totalAmount: number,
    lastTimestamp: number
}