const { GraphQLError } = require('graphql');

const ensureUserIsLogged = (context) => {
    if (!context.user) {
        throw new GraphQLError("Unauthorized");
    }
}

module.exports = ensureUserIsLogged;