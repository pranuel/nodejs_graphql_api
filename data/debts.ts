const user = {
    _id: "123",
    firstName: "Manuel",
    lastName: "Pras",
    authId: "123",
    photoUrl: "bla.com/bla.jpg"
}

const debt = {
    _id: "123",
    debtor: user,
    creditor: user
}

export const debts = [debt];

export const users = [user];