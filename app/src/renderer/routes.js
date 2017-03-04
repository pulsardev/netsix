export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView'),
    children: [
      {
        path: '',
        component: require('components/Main')
      },
      {
        path: 'about',
        component: require('components/About')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
