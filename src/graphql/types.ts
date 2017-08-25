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

export const User = new GraphQLObjectType({
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

export const Debt = new GraphQLObjectType({
    name: "Debt",
    description: "This represents a debt. A debt always contains a debtor and a creditor (both are users)",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        debtorId: { type: new GraphQLNonNull(GraphQLString) },
        creditorId: { type: new GraphQLNonNull(GraphQLString) },
        timestamp: { type: new GraphQLNonNull(GraphQLFloat) },
        reason: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) }
    })
});