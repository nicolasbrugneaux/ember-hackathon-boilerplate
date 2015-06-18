const clients =
[
    { id: '1', name: 'Samplr', clientId: 'letme', clientSecret: 'in' },
    { id: '2', name: 'Samplr2', clientId: 'xyz123', clientSecret: 'ssh-password' }
];


export const find = ( id, done ) =>
{
    for ( let i = 0, len = clients.length; i < len; i++ )
    {
        const user = clients[i];

        if ( user.id === id )
        {
            return done( null, user );
        }
    }
    return done( new Error( `Client with id: ${ id }, not found` ), null );
};

export const findByClientId = ( clientId, done ) =>
{
    for ( let i = 0, len = clients.length; i < len; i++ )
    {
        const user = clients[i];

        if ( user.clientId === clientId )
        {
            return done( null, user );
        }
    }

    return done( new Error( `Client with clientId: ${ clientId }, not found` ), null );
};

export default
{
    find,
    findByClientId
};
