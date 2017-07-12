import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';
import { IDebtsList, IRequest, IDebt, IUser } from './model';
import { debts, users } from './data/debts';
import * as express from 'express';
import { Database, open } from 'sqlite';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import {
    // These are the basic GraphQL types
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLInputObjectType,
    graphql
} from 'graphql';

let database: Database = null;

const User = new GraphQLObjectType({
    name: "User",
    description: "This represents a user",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        authId: { type: new GraphQLNonNull(GraphQLString) },
        photoUrl: { type: new GraphQLNonNull(GraphQLString) },
        sub: { type: new GraphQLNonNull(GraphQLString) }
    })
});

const Debt = new GraphQLObjectType({
    name: "Debt",
    description: "This represents a debt. A debt always contains a debtor and a creditor (both are users)",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        debtor: { type: new GraphQLNonNull(User) },
        creditor: { type: new GraphQLNonNull(User) },
        timestamp: { type: new GraphQLNonNull(GraphQLFloat) },
        reason: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) }
    })
});

const DebtsList = new GraphQLObjectType({
    name: "DebtsList",
    description: "This represents a list of debts.",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        members: { type: new GraphQLNonNull(new GraphQLList(User)) },
        debts: { type: new GraphQLList(Debt) },
        totalAmount: { type: new GraphQLNonNull(GraphQLFloat) },
        lastTimestamp: { type: GraphQLFloat }
    })
})

const Query = new GraphQLObjectType({
    name: 'RootQueries',
    fields: () => ({
        debtsLists: {
            type: new GraphQLList(DebtsList),
            resolve: async (parentValue, args, request: IRequest) => {
                // TODO: database.all("SELECT * FROM DebtsLists");
                let debtsLists: IDebtsList[] = await database.all(`SELECT DebtsLists.*
                                                                    FROM DebtsLists
                                                                        JOIN DebtsListsMemberships
                                                                            ON DebtsLists._id = DebtsListsMemberships.debtsListId
                                                                        JOIN Users
                                                                            ON Users._id = DebtsListsMemberships.userId
                                                                    WHERE Users.sub = ?`, request.user.sub);

                return debtsLists.map(async (debtsList) => {
                    let debts: IDebt[] = await database.all(`SELECT *
                                                                FROM Debts
                                                                WHERE debtsListId = ?`, debtsList._id);
                    let members: IUser[] = await database.all(`SELECT Users.*
                                                                FROM Users
                                                                    JOIN DebtsListsMemberships
                                                                        ON Users._id = DebtsListsMemberships.userId
                                                                WHERE DebtsListsMemberships.debtsListId = ?`, debtsList._id)
                    let totalAmount = debts.reduce((a, b) => {
                        return a + b.amount;
                    }, 0);
                    let timestamps = debts.map(debt => {
                        return debt.timestamp;
                    });
                    let lastTimestamp = Math.max(...timestamps);
                    return {
                        _id: debtsList._id,
                        members: members,
                        debts: debts,
                        totalAmount: totalAmount,
                        lastTimestamp: lastTimestamp
                    };
                });

            }
        },
        debts: {
            type: new GraphQLList(Debt),
            resolve: () => {
                return database.all("SELECT * FROM Debts LIMIT 10");
            }
        },
        users: {
            type: new GraphQLList(User),
            resolve: () => {
                return database.all("SELECT * FROM Users LIMIT 10");
            }
        },
        me: {
            type: User,
            resolve: (parentValue, args, request: IRequest) => {
                return database.get("SELECT * FROM Users WHERE sub = ?", request.user.sub);
            }
        }
    })
});

const DebtInput = new GraphQLInputObjectType({
    name: 'DebtInput',
    fields: {
        debtorId: { type: new GraphQLNonNull(GraphQLString) },
        creditorId: { type: new GraphQLNonNull(GraphQLString) },
        timestamp: { type: new GraphQLNonNull(GraphQLFloat) },
        reason: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) }
    }
});

const Mutation = new GraphQLObjectType({
    name: "DebtsMutation",
    description: "Mutations of debts",
    fields: () => ({
        createDebt: {
            type: Debt,
            args: {
                debtInput: { type: DebtInput }
            },
            resolve: (source, { debtorId, creditorId, timestamp, reason, amount }) => {
                let debt = {
                    _id: Math.round(Math.random() * 1000000000).toString(),
                    debtor: users[0],
                    creditor: users[0],
                    timestamp: timestamp,
                    reason: reason,
                    amount: amount
                };

                debts.push(debt);

                return debt;
            }
        }
    })
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

var app: express.Application = express();
app.use(cors());
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://pranuel.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://iou.de',
    issuer: "https://pranuel.eu.auth0.com/",
    algorithms: ['RS256']
});

app.use(jwtCheck);
app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.use('/graphql', graphqlHTTP({
    schema: Schema,
    graphiql: true
}));

// First, try to open the database
open('./database.sqlite3')
    // Update db schema to the latest version using SQL-based migrations
    .then(db => db.migrate({ force: 'last' }))
    .then(db => database = db)
    // Display error message if something went wrong
    .catch((err) => console.error(err.stack))
    // Finally, launch the Node.js app
    .then(() => app.listen(4001, () => console.log('Running a GraphQL API server at localhost:4001/graphql')));