angular.module('oath',
  ['ionic',
  'oath.progressCtrl',
  'oath.rootCtrl',
  'oath.paymentCtrl',
  'oath.endConditionCtrls',
  'oath.reportCtrls',
  'oath.goalCtrls',
  'oath.tabCtrl',
  'oath.userFactory',
  'oath.goalFactory',
  'oath.paymentFactory',
  'chart.js',
  'tc.chartjs'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true); //we added this to try to stop auto-scroll on payment page. this likely might not do the trick and we might need to remove it
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('root', {
    url: '/',
    cache: false,
    controller: 'RootCtrl',
    templateUrl: 'templates/loading.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  .state('localLogin', {
    url: '/locallogin',
    templateUrl: 'templates/localLogin.html'
  })

  .state('localSigup', {
    url: '/localsignup',
    templateUrl: 'templates/localsignup.html'
  })

  .state('goaltype', {
    cache: false,
    url: '/goaltype',
    templateUrl: 'templates/goaltype.html',
    controller: 'GoalCtrl',
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html'
  })
  .state('comingsoon', {
    url: '/comingsoon',
    templateUrl: 'templates/comingsoon.html'
  })

  .state('deviceAuth', {
    url: '/deviceauth',
    templateUrl: 'templates/deviceAuth.html',
    controller: 'GoalCtrl'
  })

  .state('goaldetails', {
    cache: false,
    url: '/goaldetails',
    templateUrl: 'templates/goaldetails.html',
    controller: 'GoalDetailCtrl'
  })

  .state('goalsuccess', {
    cache: false,
    url: '/goalsuccess',
    templateUrl: 'templates/goalsuccess.html',
    controller: 'GoalSuccessCtrl'
  })

  .state('goalfailure', {
    cache: false,
    url: '/goalfailure',
    templateUrl: 'templates/goalfailure.html',
    controller: 'GoalFailureCtrl'
  })

  .state('payment', {
    url: '/payment',
    templateUrl: 'templates/payment.html',
    controller: 'PaymentCtrl',
    cache: false
  })

  .state('progress', {
    cache: false,
    url: '/progress',
    templateUrl: 'templates/progress.html',
    controller: 'ProgressCtrl'
  })

  .state('successreport', {
    url: '/successreport',
    templateUrl: 'templates/success.html',
    controller: 'SuccessReportCtrl'
  })

  .state('failurereport', {
    url: '/failurereport',
    templateUrl: 'templates/failure.html',
    controller: 'FailureReportCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

  $urlRouterProvider.otherwise('/');
});
