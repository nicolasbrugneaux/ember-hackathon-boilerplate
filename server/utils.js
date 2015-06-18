export const uid = len =>
{
    let buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for ( let i = 0; i < len; ++i )
    {
        const index = Math.floor( Math.random() * ( charlen ) );
        buf.push( chars[index] );
    }

    return buf.join( '' );
};
