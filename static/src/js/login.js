// bounce down animate
$(function () {
  $('#login').addClass('animated swing');
});

// controller
var app = angular.module('loginModule', []);

app.controller('loginController', function ($scope) {

  // checked
  $scope.remember = true;

  $scope.login = function () {
    $scope.processing = true;
    service.login($scope.email, $scope.password, $scope.remember).then(function (res) {
      $scope.$emit('$initialize');
    }, function (rej) {
      $scope.error = true;
    })['finally'](function () {
      $scope.processing = false;
    });
  };

});

// bootstrap
angular.element(document).ready(function () {
  angular.bootstrap(document, ['loginModule']);
});