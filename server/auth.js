import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { users, clients, accessTokens } from './db/';


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use( new LocalStrategy( ( username, password, done ) =>
{
    users.findByUsername( username, (err, user) =>
    {
        if ( err )
        {
            return done( err );
        }

        if ( !user )
        {
            return done( null, false );
        }

        if ( user.password !== password )
        {
            return done( null, false );
        }

        return done(null, user);
    } );
} ) );


passport.serializeUser( ( user, done ) => done( null, user.id ) );

passport.deserializeUser( ( id, done ) =>
{
    users.find( id, ( err, user ) => done( err, user ) );
} );


/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use( new BasicStrategy( ( username, password, done ) =>
{
    clients.findByClientId( username, ( err, client ) =>
    {
        if ( err )
        {
            return done( err );
        }

        if ( !client )
        {
            return done( null, false );
        }

        if ( client.clientSecret !== password )
        {
            return done( null, false );
        }

        return done( null, client );
    } );
} ) );

passport.use( new ClientPasswordStrategy( ( clientId, clientSecret, done ) =>
{
    clients.findByClientId( clientId, ( err, client ) =>
    {
        if ( err )
        {
            return done( err );
        }

        if ( !client )
        {
            return done( null, false );
        }

        if ( client.clientSecret !== clientSecret )
        {
            return done( null, false );
        }

        return done( null, client );
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use( new BearerStrategy( ( accessToken, done ) =>
{
    accessTokens.find( accessToken, ( err, token ) =>
    {
        if ( err )
        {
            return done( err);
        }

        if ( !token )
        {
            return done( null, false );
        }

        if ( token.userID != null )
        {
            users.find( token.userID, ( err, user ) =>
            {
                if ( err )
                {
                    return done( err );
                }

                if ( !user )
                {
                    return done( null, false );
                }

                const info = { scope: '*' };
                done( null, user, info );
            });
        }
        else
        {
            //The request came from a client only since userID is null
            //therefore the client is passed back instead of a user
            clients.findByClientId( token.clientID, ( err, client ) =>
            {
                if ( err )
                {
                    return done( err );
                }

                if ( !client )
                {
                    return done( null, false );
                }

                const info = { scope: '*' };
                done( null, client, info );
            });
      }
    });
  }
));
