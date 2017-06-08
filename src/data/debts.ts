const user1 = {
    _id: "123",
    firstName: "Manuel",
    lastName: "Pras",
    authId: "123",
    photoUrl: "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400"
}

const user2 = {
    _id: "321",
    firstName: "Christiane",
    lastName: "Reinhard",
    authId: "123",
    photoUrl: "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400"
}

const debt = {
    _id: "123",
    debtor: user1,
    creditor: user2,
    amount: 13,
    timestamp: 1496515381663,
    reason: "Some demo reason bla bla here..."
}

export const debts = [debt, debt];

export const users = [user1, user2];

export const debtsLists = [{
    _id: "123",
    members: users,
    debts: debts
}];