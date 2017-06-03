import { debts, users } from './data/debts';
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

const User: GraphQLObjectType = new GraphQLObjectType({
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

const Debt: GraphQLObjectType = new GraphQLObjectType({
    name: "Debt",
    description: "This represents a debt. A debt always contains a debtor and a creditor (both are users)",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        debtor: { type: new GraphQLNonNull(User) },
        creditor: { type: new GraphQLNonNull(User) }
    })
});

const Query: GraphQLObjectType = new GraphQLObjectType({
    name: 'RootQueries',
    fields: () => ({
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

const DebtInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'DebtInput',
    fields: {
        debtorId: { type: new GraphQLNonNull(GraphQLString) },
        creditorId: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const Mutation: GraphQLObjectType = new GraphQLObjectType({
    name: "DebtsMutation",
    description: "Mutations of debts",
    fields: () => ({
        createDebt: {
            type: Debt,
            args: {
                debtInput: { type: DebtInput }
            },
            resolve: (source, { debtorId, creditorId }) => {
                let debt = {
                    _id: Math.round(Math.random() * 1000000000).toString(),
                    debtor: users[0],
                    creditor: users[0]
                };

                debts.push(debt);

                return debt;
            }
        }
    })
});

const Schema: GraphQLSchema = new GraphQLSchema({
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