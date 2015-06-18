import Ember from 'ember';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend( AuthenticatedRouteMixin,
{
    model()
    {
        return $.get( '/api/recipes' ).then( response => response.recipes );
    }
} );
