describe("Unit Testing Examples", function () {

  beforeEach(module('starter'))

  var $scope;
  var $controller;

  beforeEach(inject(function($rootScope, _$controller_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
  }));

  describe('scopegrade', function() {
    it('HOPEFULLY THIS WORKS', function() {
      var $scope = {};
      var controller = $controller('GoalCtrl', { $scope: $scope });
    });
  });

  it("should be true", function() {
    expect(true).toBe(true);
  });

  it("should have a $scope variable", function() {
    console.log($scope.Go)
    expect($scope).toBeDefined();
  });
});


// describe('PasswordController', function() {
//   beforeEach(module('app'));

//   var $controller;

//   beforeEach(inject(function(_$controller_){
//     // The injector unwraps the underscores (_) from around the parameter names when matching
//     $controller = _$controller_;
//   }));

//   describe('$scope.grade', function() {
//     it('sets the strength to "strong" if the password length is >8 chars', function() {
//       var $scope = {};
//       var controller = $controller('PasswordController', { $scope: $scope });
//       $scope.password = 'longerthaneightchars';
//       $scope.grade();
//       expect($scope.strength).toEqual('strong');
//     });
//   });
// });