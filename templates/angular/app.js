var app = angular.module('<%= slugify(appName) %>', ['ui.bootstrap', 'ngRoute', 'ngCookies']);
app.config(function ($routeProvider, $httpProvider, $locationProvider) {

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push(function($q, $location) { return { response: function(response) { 
      return response; 
    }, 
    responseError: function(response) { 
      if (response.status === 401) {
        $location.url('/login');
      }
      return $q.reject(response); 
      } 
    }; 
  });

  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer(); 
    $http.get('/users/loggedin').then(function(response) { 
      deferred.resolve();
    }, function (errorRespone) {
      $rootScope.message = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }); 

    return deferred.promise; 
  };

  $routeProvider
    .when('/', {templateUrl: 'partials/index.html'})
    .when('/login', {
    	templateUrl: 'partials/login.html',
    	controller: 'LoginCtrl'
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/logout', {
      controller: 'LogoutCtrl',
      template: ''
    })
    .otherwise({redirectTo: '/'});
});