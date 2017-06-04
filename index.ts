import { debts, users, debtsLists } from './data/debts';
import * as express from 'express';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql'
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

const User = new GraphQLObjectType({
    name: "User",
    description: "This represents a user",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        authId: { type: new GraphQLNonNull(GraphQLString) },
        photoUrl: { type: new GraphQLNonNull(GraphQLString) }
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
            resolve: () => {
                return debtsLists.map(debtsList => {
                    let totalAmount = debtsList.debts.reduce((a, b) => {
                        return a + b.amount;
                    }, 0);
                    let timestamps = debtsList.debts.map(debt => {
                        return debt.timestamp;
                    });
                    let lastTimestamp = Math.max(...timestamps);
                    return {
                        _id: debtsList._id,
                        members: debtsList.members,
                        debts: debtsList.debts,
                        totalAmount: totalAmount,
                        lastTimestamp: lastTimestamp
                    };
                });
            }
        },
        debts: {
            type: new GraphQLList(Debt),
            resolve: () => {
                return debts;
            }
        },
        users: {
            type: new GraphQLList(User),
            resolve: () => {
                return debts;
            }
        },
        me: {
            type: User,
            resolve: () => {
                return users[0];
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
app.use('/graphql', graphqlHTTP({
    schema: Schema,
    graphiql: true
}));
app.listen(4001, () => console.log('Running a GraphQL API server at localhost:4001/graphql'));