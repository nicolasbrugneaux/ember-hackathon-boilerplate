import passport from 'passport';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import session from 'express-session';
import compress from 'compression';
import cookieParser from 'cookie-parser';
// import path from 'path';

import { info as userInfo } from './user';
import { info as clientInfo } from './client';
import recipes from './recipe';
import { braintreeToken, braintreePaymentMethod } from './third-party-apis';
import { authorization, decision, token } from './oauth2';

import './auth';

export default app =>
{
    app.use( cookieParser() );
    app.use( bodyParser.urlencoded(
    {
        extended: true
    } ) );
    app.use( bodyParser.json() );
    app.use( compress() );
    // app.use( csrf( { cookie: true } ) );
    app.use( session(
    {
        secret : 'keyboard cat',
        saveUninitialized : true,
        resave : true
    } ) );
    app.use( passport.initialize() );
    app.use( passport.session() );
    // app.use( express.static( path.join( __dirname, 'public' ) ) );


    app.get( '/dialog/authorize', authorization );
    app.post( '/dialog/authorize/decision', decision );
    app.post( '/oauth/token', token );

    app.post( '/oauth/braintree/token', braintreeToken );
    app.post( '/payment-methods/braintree', braintreePaymentMethod );

    app.get( '/api/userinfo', userInfo );
    app.get( '/api/clientinfo', clientInfo );

    app.get( '/api/recipes', recipes.findAll );
    app.get( '/api/recipes/:id', recipes.find );


};
