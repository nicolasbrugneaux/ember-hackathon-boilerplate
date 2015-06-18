const recipes =
[
    {
        id : '1',
        name : 'recipe 1',
        ingredients :
        [
            'tomatoes',
            'mushrooms',
            'beef'
        ],
        rating : 5
    },
    {
        id : '2',
        name : 'recipe 2',
        ingredients :
        [
            'zucchinis',
            'mozarella',
            'peppers'
        ],
        rating : 6
    },
    {
        id : '3',
        name : 'recipe 3',
        ingredients :
        [
            'potatoes',
            'ketchup'
        ],
        rating : 1
    }
];


export const find = ( id, done ) =>
{
    console.log( id, done );
    for ( let i = 0, len = recipes.length; i < len; i++ )
    {
        const recipe = recipes[i];

        if ( recipe.id === id )
        {
            return done( null, recipe );
        }
    }
    return done( new Error( `Recipe with id: ${ id }, not found` ), null );
};

export const findByRecipeName = ( recipeName, done ) =>
{
    for ( let i = 0, len = recipes.length; i < len; i++ )
    {
        const user = recipes[i];

        if ( user.recipeName === recipeName )
        {
            return done( null, user );
        }
    }

    return done( new Error( `Recipe with recipeName: ${ recipeName }, not found` ), null );
};

export const findAll = ( done ) => done( null, recipes );


export default
{
    find,
    findByRecipeName,
    findAll
};
