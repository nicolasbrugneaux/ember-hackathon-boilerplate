const users =
[
    { id: '1', username: 'letme', password: 'in', name: 'Strawberry' },
    { id: '2', username: 'nicolas', password: 'password', name: 'Nicolas Brugneaux' }
];


export const find = ( id, done ) =>
{
    for ( let i = 0, len = users.length; i < len; i++ )
    {
        const user = users[i];

        if ( user.id === id )
        {
            return done( null, user );
        }
    }
    return done( new Error( `User with id: ${ id }, not found` ), null );
};

export const findByUsername = ( username, done ) =>
{
    for ( let i = 0, len = users.length; i < len; i++ )
    {
        const user = users[i];

        if ( user.username.toLowerCase() === username.toLowerCase() )
        {
            return done( null, user );
        }
    }

    return done( new Error( `User with username: ${ username }, not found` ), null );
};

export default
{
    find,
    findByUsername
};
