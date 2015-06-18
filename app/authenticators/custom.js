import Base from 'simple-auth/authenticators/base';

export default Base.extend(
{
    restore( data )
    {

    },
    authenticate()
    {
        var data = this.getProperties( 'identification', 'password' );
        return this.get( 'session' )
            .authenticate( 'simple-auth-authenticator:oauth2-password-grant', data );
    },
    invalidate( data )
    {

    },
} );
