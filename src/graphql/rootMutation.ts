import { DatabaseProvider } from './../databaseProvider';
import { Database } from 'sqlite';
import { IDebt } from './../model';
import { Debt } from './types';

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

const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) }
    }
})

export function createRootMutation(databaseProvider: DatabaseProvider) {
    const rootMutation = new GraphQLObjectType({
        name: "Mutations",
        description: "Mutations of debts and users",
        fields: () => ({
            addDebt: {
                type: Debt,
                args: {
                    debtInput: { type: DebtInput }
                },
                resolve: (source, { debtorId, creditorId, timestamp, reason, amount }) => {
                    let debt: IDebt = {
                        _id: Math.round(Math.random() * 1000000000).toString(),
                        debtorId: "1",
                        creditorId: "2",
                        timestamp: timestamp,
                        reason: reason,
                        amount: amount
                    };
    
                    return debt;
                }
            }
        })
    });
    return rootMutation;
}