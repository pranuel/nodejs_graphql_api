import { IUsersRepository } from './../repository/usersRepository';
import { IDebtsRepository } from "../repository/debtsRepository";
import { IRequest, IUser } from './../model';
import { Debt, User, DebtsSummaryByUser } from './types';

import {
    GraphQLList,
    GraphQLObjectType
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
            },
            debtsSummariesByUsers: {
                type: new GraphQLList(DebtsSummaryByUser),
                resolve: async (parentValue, args, request: IRequest) => {
                    let me = await userRepo.getMe(request.user.sub);
                    let debtsSummaries = await debtRepo.getAllGroupedByUser(me._id);
                    return debtsSummaries;
                }
            }
        })
    });
    return rootQuery;
}