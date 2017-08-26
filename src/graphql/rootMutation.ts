import { IDebtsRepository } from "../repository/debtsRepository";
import { IUsersRepository } from "../repository/usersRepository";
import { Database } from 'sqlite';
import { IDebt, IRequest, IUser } from './../model';
import { Debt, User } from './types';

import {
    GraphQLFloat,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInputObjectType,
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

const MeInput = new GraphQLInputObjectType({
    name: 'MeInput',
    fields: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        photoUrl: { type: new GraphQLNonNull(GraphQLString) }
    }
})

export function createRootMutation(userRepo: IUsersRepository, debtRepo: IDebtsRepository) {
    const rootMutation = new GraphQLObjectType({
        name: "Mutations",
        description: "Mutations of debts and users",
        fields: () => ({
            addDebt: {
                type: Debt,
                args: {
                    debtInput: { type: DebtInput }
                },
                resolve: (source, args, request: IRequest) => {
                    const { debtorId, creditorId, timestamp, reason, amount } = args.debtInput;
                    let debt: IDebt = {
                        _id: Math.round(Math.random() * 1000000000),
                        debtor: null,
                        creditor: null,
                        timestamp: timestamp,
                        reason: reason,
                        amount: amount
                    };
    
                    return debt;
                }
            },
            addMe: {
                type: User,
                args: {
                    meInput: { type: MeInput }
                },
                resolve: (parentValue, args, request: IRequest) => {
                    const { firstName, lastName, photoUrl } = args.meInput;
                    let me: IUser = {
                        firstName: firstName,
                        lastName: lastName,
                        photoUrl: photoUrl,
                        sub: request.user.sub
                    };
                    return userRepo.add(me);
                }
            }
        })
    });
    return rootMutation;
}