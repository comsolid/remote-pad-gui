export default [
    {
        path: '/',
        name: 'home-page',
        component: require('pages/HomePage')
    },
    {
        path: '*',
        redirect: '/'
    }
]
