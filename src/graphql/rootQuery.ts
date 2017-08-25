import { IUsersRepository } from './../repository/usersRepository';
import { IDebtsRepository } from "../repository/debtsRepository";
import { IRequest, IUser } from './../model';
import { Debt, User } from './types';

import {
    // These are the basic GraphQL types
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLEnumType,
    GraphQLNonNull
} from 'graphql';

export function createRootQuery(userRepo: IUsersRepository, debtRepo: IDebtsRepository) {
    const rootQuery = new GraphQLObjectType({
        name: 'RootQueries',
        fields: () => ({
            debts: {
                type: new GraphQLList(Debt),
                resolve: () => {
                    return debtRepo.getAll();
                }
            },
            users: {
                type: new GraphQLList(User),
                resolve: () => {
                    return userRepo.getAll();
                }
            },
            me: {
                type: User,
                resolve: (parentValue, args, request: IRequest) => {
                    return userRepo.getMe(request.user.sub);
                }
            }
        })
    });
    return rootQuery;
}