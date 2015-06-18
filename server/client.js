import passport from 'passport';

export const info = [
    passport.authenticate( 'bearer', { session: false } ),
    ( req, res ) =>
    {
        const client_id = req.user.id;
        const name = req.user.name;
        const scope = req.authInfo.scope;

        res.json( { client_id, name, scope } );
    }
];
