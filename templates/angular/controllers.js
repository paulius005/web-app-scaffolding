angular.module('<%= slugify(appName) %>').controller('LoginCtrl',
  ['$scope', '$location', '$http',
  function ($scope, $location, $http) {
    $scope.user = {};

    $scope.loginUser = function () {
      $http.post('/users/login', {
        username: $scope.user.username,
        password: $scope.user.password,
        remember_me: $scope.user.remember_me,
      }).success(function (data, status) {
        $location.url('/profile');
      }).error(function (data) {
        $scope.error = true;
        $scope.errorMessage = "Invalid username and/or password";
      });
    };
}]);

angular.module('<%= slugify(appName) %>').controller('LogoutCtrl',
  ['$location', '$http',
  function ($location, $http) {
    $http.get('/users/logout').success(function (data, status) {
      $location.url('/login');
    }).error(function (data) {
      $location.url('/login');
    });
}]);

angular.module('<%= slugify(appName) %>').controller('RegisterCtrl',
  ['$scope', '$location', '$http',
  function ($scope, $location, $http) {
    $scope.user = {};

    $scope.registerUser = function () {
      $http.post('/users/register', {
        username: $scope.user.username,
        password: $scope.user.password,
      }).success(function (data, status) {
        $location.url('/profile');
      }).error(function (data) {
        $scope.error = true;
        $scope.errorMessage = "Username is taken";
      });
    };
}]);

angular.module('<%= slugify(appName) %>').controller('ProfileCtrl',
  ['$scope', '$location', '$http',
  function ($scope, $location, $http) {
    var profile = this;
    profile.info = {};

    $http.get('/users/user').success(function (data, status) {
      profile.info = data;
    }).error(function (data) {
      profileInfo = {};
    });
}]);

