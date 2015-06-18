import oauth2orize from 'oauth2orize';
import passport from 'passport';
import login from 'connect-ensure-login';

import { clients, users, accessTokens, authorizationCodes } from './db';
import { uid } from './utils';

const server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient( ( client, done ) => done( null, client.id ) );

server.deserializeClient( ( id, done ) =>
{
    clients.find( id, ( err, client ) =>
    {
        if ( err )
        {
            return done( err );
        }

        return done( null, client );
    } );
} );

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` ( which is used as a verifier in the
// subsequent exchange ), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant( oauth2orize.grant.code( ( client, redirectURI, user, ares, done ) =>
{
    var code = uid( 16 );

    authorizationCodes.save( code, client.id, redirectURI, user.id, err =>
    {
        if ( err )
        {
            return done( err );
        }

        done( null, code );
    } );
} ) );

// Grant implicit authorization.  The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a token, which is bound to these
// values.

server.grant( oauth2orize.grant.token( ( client, user, ares, done ) =>
{
    var token = uid( 256 );

    accessTokens.save( token, user.id, client.clientId, err =>
    {
        if ( err )
        {
            return done( err );
        }

        done( null, token );
    } );
} ) );

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange( oauth2orize.exchange.code( ( client, code, redirectURI, done ) =>
{
    authorizationCodes.find( code, ( err, authCode ) =>
    {
        if ( err )
        {
            return done( err );
        }
        if ( client.id !== authCode.clientID )
        {
            return done( null, false );
        }
        if ( redirectURI !== authCode.redirectURI )
        {
            return done( null, false );
        }

        var token = uid( 256 );
        accessTokens.save( token, authCode.userID, authCode.clientID, err =>
        {
            if ( err )
            {
                return done( err );
            }

            done( null, token );
        } );
    } );
} ) );

// Exchange user id and password for access tokens.  The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

server.exchange( oauth2orize.exchange.password( ( client, username, password, scope, done ) =>
{

    //Validate the client
    clients.findByClientId( client.clientId, ( err, localClient ) =>
    {
        if ( err )
        {
            return done( err );
        }
        if ( localClient == null )
        {
            return done( null, false );
        }
        if ( localClient.clientSecret !== client.clientSecret )
        {
            return done( null, false );
        }
        //Validate the user
        users.findByUsername( username, ( err, user ) =>
        {
            if ( err )
            {
                return done( err );
            }
            if ( user === null )
            {
                return done( null, false );
            }
            if ( password !== user.password )
            {
                return done( null, false );
            }
            //Everything validated, return the token
            var token = uid( 256 );
            accessTokens.save( token, user.id, client.clientId, err =>
            {
                if ( err )
                {
                    return done( err );
                }
                done( null, token );
            } );
        } );
    } );
} ));

// Exchange the client id and password/secret for an access token.  The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.

server.exchange( oauth2orize.exchange.clientCredentials( ( client, scope, done ) =>
{
    //Validate the client
    clients.findByClientId( client.clientId, ( err, localClient ) =>
    {
        if ( err )
        {
            return done( err );
        }
        if ( localClient === null )
        {
            return done( null, false );
        }
        if ( localClient.clientSecret !== client.clientSecret )
        {
            return done( null, false );
        }
        var token = uid( 256 );
        //Pass in a null for user id since there is no user with this grant type
        accessTokens.save( token, null, client.clientId, err =>
        {
            if ( err )
            {
                return done( err );
            }
            done( null, token );
        } );
    } );
} ));

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectURI` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectURI` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval ( displaying details about the client requesting
// authorization ).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.

export const authorization = [
    login.ensureLoggedIn(),
    server.authorization( ( clientID, redirectURI, done ) =>
    {
        clients.findByClientId( clientID, ( err, client ) =>
        {
            if ( err )
            {
                return done( err );
            }
            // WARNING: For security purposes, it is highly advisable to check that
            //          redirectURI provided by the client matches one registered with
            //          the server.  For simplicity, this example does not.  You have
            //          been warned.
            return done( null, client, redirectURI );
        } );
    } ),
    ( req, res )=>
    {
        res.render( 'dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client } );
    }
];

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

export const decision = [
    login.ensureLoggedIn(),
    server.decision()
];


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

export const token = [
    passport.authenticate( ['basic', 'oauth2-client-password'], { session: false } ),
    server.token(),
    server.errorHandler()
];
