import passport from 'passport';
import { find, findAll } from './db/recipes';

export default
{
    findAll :
    [
        // passport.authenticate( 'bearer', { session: false } ),
        ( req, res ) =>
        {
            findAll( ( err, recipes ) =>
            {
                if ( err )
                {
                    // return done( err );
                }

                return res.json( { recipes } );
            } );
        }
    ],
    find :
    [
        // passport.authenticate( 'bearer', { session: false } ),
        ( req, res ) =>
        {
            find( req.params.id, ( err, recipe ) =>
            {
                console.log( recipe );
                if ( err )
                {
                    // return done( err );
                }

                return res.json( { recipe } );
            } );
        }
    ]
};
