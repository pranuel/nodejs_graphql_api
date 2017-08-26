export interface DebtEntity {
    _id: number,
    amount: number,
    timestamp: number,
    reason: string,
    creditor_id: number,
    creditor_firstName: string,
    creditor_lastName: string,
    creditor_photoUrl: string,
    creditor_sub: string,
    debtor_id: number,
    debtor_firstName: string,
    debtor_lastName: string,
    debtor_photoUrl: string,
    debtor_sub: string
}