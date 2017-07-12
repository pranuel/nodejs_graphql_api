-- Up 

CREATE TABLE IF NOT EXISTS DebtsLists
(
    _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title TEXT
);

CREATE TABLE IF NOT EXISTS Debts
(
    _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    debtorId INTEGER,
    creditorId INTEGER,
    debtsListId INTEGER,
    amount INTEGER,
    timestamp INTEGER,
    reason TEXT,
    CONSTRAINT Debt_fk_debtsListId FOREIGN KEY (debtsListId)
        REFERENCES DebtsLists (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT Debt_fk_creditorId FOREIGN KEY (creditorId)
        REFERENCES Users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT Debt_fk_debtorId FOREIGN KEY (debtorId)
        REFERENCES Users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Users
(
    _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    firstName TEXT,
    lastName TEXT,
    photoUrl TEXT,
    sub TEXT
);

CREATE TABLE IF NOT EXISTS DebtsListsMemberships
(
    userId INTEGER,
    debtsListId INTEGER,
    CONSTRAINT PK_DebtsListsMembership PRIMARY KEY (userId,debtsListId),
    CONSTRAINT DebtsListsMembership_fk_userId FOREIGN KEY (userId)
        REFERENCES Users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT DebtsListsMembership_fk_debtsListId FOREIGN KEY (debtsListId)
        REFERENCES Debts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO Users (_id, firstName, lastName, photoUrl, sub) VALUES (1, "Manuel", "Pras", "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400", "facebook|1080925881970593");
INSERT INTO Users (_id, firstName, lastName, photoUrl, sub) VALUES (2, "Christiane", "Reinhard", "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400", "facebook|1080925881970592");
INSERT INTO DebtsLists (_id, title) VALUES (1, "Test Debtslist");
INSERT INTO DebtsListsMemberships (userId, debtsListId) VALUES (1, 1);
INSERT INTO DebtsListsMemberships (userId, debtsListId) VALUES (2, 1);

-- Down 
DROP TABLE IF EXISTS DebtsListsMemberships;
DROP TABLE IF EXISTS Debts;
DROP TABLE IF EXISTS DebtsLists;
DROP TABLE IF EXISTS Users;