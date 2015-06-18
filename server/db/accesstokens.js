let tokens = {};

export const find = ( key, done ) => done( null, tokens[key] );

export const save = ( token, userID, clientID, done ) =>
{
    tokens[token] = { userID, clientID };
    done( null );
};

export default
{
    find,
    save
};
