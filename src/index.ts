import { DebtsRepository } from './repository/debtsRepository';
import { UsersRepository } from './repository/usersRepository';
import { DatabaseProvider } from './databaseProvider';
import { createRootMutation } from './graphql/rootMutation';
import { createRootQuery } from './graphql/rootQuery';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';
import { IRequest, IDebt, IUser } from './model';
import { debts, users } from './data/debts';
import * as express from 'express';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';

import {
    GraphQLSchema,
    graphql
} from 'graphql';

const databaseProvider = new DatabaseProvider();
const usersRepo = new UsersRepository(databaseProvider);
const debtsRepo = new DebtsRepository(databaseProvider);

const Schema = new GraphQLSchema({
    query: createRootQuery(usersRepo, debtsRepo),
    mutation: createRootMutation(databaseProvider)
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

databaseProvider.initDatabase()
    // Display error message if something went wrong
    .catch((err) => console.error(err.stack))
    // Finally, launch the Node.js app
    .then(() => app.listen(4001, () => console.log('Running a GraphQL API server at localhost:4001/graphql')));