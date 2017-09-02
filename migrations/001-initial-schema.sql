-- Up

CREATE TABLE IF NOT EXISTS Debts
(
    _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    debtorId INTEGER,
    creditorId INTEGER,
    amount INTEGER,
    timestamp INTEGER,
    reason TEXT,
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
    sub TEXT UNIQUE
);

INSERT INTO Users (_id, firstName, lastName, photoUrl, sub) VALUES (1, "Manuel", "Pras", "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400", "facebook|1080925881970593");
INSERT INTO Users (_id, firstName, lastName, photoUrl, sub) VALUES (2, "Christiane", "Reinhard", "https://avatars0.githubusercontent.com/u/1050461?v=3&u=b4c2487bbb40c032fb94a95e4af78c2760f48e75&s=400", "facebook|1080925881970592");
INSERT INTO Debts (_id, debtorId, creditorId, amount, timestamp, reason) VALUES (1, 1, 2, 10, 1499877083798, "Test Debt 1");
INSERT INTO Debts (_id, debtorId, creditorId, amount, timestamp, reason) VALUES (2, 2, 1, 100, 1499877083799, "Test Debt 2");

-- Down 
DROP TABLE IF EXISTS Debts;
DROP TABLE IF EXISTS Users;