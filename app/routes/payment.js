import Ember from 'ember';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import braintree from 'npm:braintree-web';

export default Ember.Route.extend( AuthenticatedRouteMixin,
{
    model()
    {
        $.post( '/oauth/braintree/token' ).then( token =>
        {
            braintree.setup( token, "dropin" );
        } );
    }
} );
