import passport from 'passport';
import braintreeGateway from './config/braintree';

export const braintreeToken =
[
    passport.authenticate( ['basic', 'oauth2-client-password'], { session: false } ),
    ( req, res ) =>
    {
        braintreeGateway.clientToken.generate(
        {
            customerId : '56828306'
        }, ( err, response ) =>
        {
            res.send( response.clientToken );
        } );
    }
];

export const braintreePaymentMethod =
[
    passport.authenticate( ['basic', 'oauth2-client-password'], { session: false } ),
    ( req, res ) =>
    {
        // const nonce = req.body.payment_method_nonce;
        // Use payment method nonce here

        braintreeGateway.transaction.sale(
        {
            amount: '10.00',
            paymentMethodNonce: 'fake-valid-nonce',
        }, ( err, result ) =>
        {
            console.log( result );
            res.send( result );
        } );
    }
];
