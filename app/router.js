import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend(
{
    location : config.locationType
} );

export default Router.map( function()
{
    this.route( 'favorites' );
    this.route( 'login' );
    this.route( 'dialog' );
    this.route( 'payment' );
} );
