(function () {
  // bounce down animate
  $(function () {
    var actions = ['swing', 'pulse', 'tada', 'fadeInDown', 'bounce', 'bounceIn', 'bounceInDown', 'flip', 'rollIn'];
    var action = actions[Math.floor(actions.length * Math.random(0, 1))];
    $('#login').addClass('animated').addClass(action);
  });

  // controller
  var app = angular.module('loginModule', []);

  app.controller('loginController', function ($scope) {

    $scope.remember = true;

    $scope.login = function () {

    };

  });

  // bootstrap
  angular.element(document).ready(function () {
    angular.bootstrap(document, ['loginModule']);
  });
})();