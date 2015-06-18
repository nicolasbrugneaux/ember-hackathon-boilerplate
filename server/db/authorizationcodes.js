let codes = {};

export const find = ( key, done ) => done( null, codes[key] );

export const save = ( code, userID, redirectURI, clientID, done ) =>
{
    codes[code] = { userID, clientID, redirectURI };
    done( null );
};

export default
{
    find,
    save
};
