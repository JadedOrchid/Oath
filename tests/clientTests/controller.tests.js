describe("Unit Testing Controllers", function () {
  beforeEach(module('starter'))
  beforeEach(module('starter.factories'))
  beforeEach(module('starter.controllers'))

  var $scope;
  var $controller;
  var GoalBuilder;
  var $log;
  var $state;

  beforeEach(inject(function($rootScope, _$controller_, _GoalBuilder_, _$log_, _$state_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
    GoalBuilder = _GoalBuilder_;
    $state = _$state_;
    spyOn($state, 'go');
  }));

  describe('GOAL DETAIL CONTROLLER', function(){
    it('Should update deets', function() {
      $scope = {};
      var controller = $controller('GoalDetailCtrl', { $scope: $scope } );
      $scope.goalType = 'Running';
      $scope.times = 'One Day';
      $scope.updateDeets();

      expect($scope.goalType).toBe('Running');
      expect($scope.times).toBe('One Day');
      expect(typeof $scope.updateDeets).toBe('function');
    });

    it('Should return and a goalType', function(){
      $scope = {};
      var controller = $controller('GoalDetailCtrl', { $scope: $scope } );
      $scope.times = 'Power walking!'
      expect(typeof $scope.times).toBe('string');
      expect($scope.times).toBe('Power walking!');
    })

    it('Should return and a time', function(){
      $scope = {};
      var controller = $controller('GoalDetailCtrl', { $scope: $scope } );
      $scope.times = 'FOREVER!'
      expect(typeof $scope.times).toBe('string');
      expect($scope.times).toBe('FOREVER!');
    })

    it('Should route to goal details', function(){
      $scope = {};
      var controller = $controller('GoalDetailCtrl', { $scope: $scope } );
      $scope.updateDeets();
      expect($state.go).toHaveBeenCalledWith('goalsuccess');
    });
  })

  describe('GOAL CONTROLLER', function(){
    it('Should have goals listed in an array of objects', function() {
      var goals = GoalBuilder.returnGoals();

      expect(Array.isArray(goals)).toBe(true);
      expect(typeof goals[0]).toBe('object');
      expect(goals[0].title).toBe('Step Goal');
      expect(goals[0].unit).toBe('steps');
    });

    it('Should go to start of choices', function() {
      GoalBuilder.goalClick();
      expect($state.go).toHaveBeenCalledWith('goaldetails');
    });
  })

  describe('GOAL SUCCESS CONTROLLER', function(){
    it('Should have a list of success objects listed in an array', function() {
      $scope.goalClick = GoalBuilder.returnSucesses();
      var goalSucesses = $scope.goalClick;

      expect(Array.isArray(goalSucesses)).toBe(true);
      expect(typeof goalSucesses[0]).toBe('object');
      expect(goalSucesses[0].orgName).toBe('Arbor Day Foundation');
      expect(goalSucesses[0].description).toBe('Plant a tree!');
      expect(goalSucesses[0].price).toBe('$5');
      expect(goalSucesses[0].img).toBe('imgurl');
    });

    it('Should route to goal failure', function() {
      GoalBuilder.successClick();
      expect($state.go).toHaveBeenCalledWith('goalfailure');
    });
  })

  describe('GOAL FAILURE CONTROLLER', function(){
    it('Should have a list of success objects listed in an array', function() {
      $scope.goalClick = GoalBuilder.returnFailures();
      var goalFailure = $scope.goalClick;

      expect(Array.isArray(goalFailure)).toBe(true);
      expect(typeof goalFailure[0]).toBe('object');
      expect(goalFailure[0].orgName).toBe('Tip the developers');
      expect(goalFailure[0].description).toBe("We're broke");
      expect(goalFailure[0].img).toBe('imgurl');
    });

    xit('Should route to payment page', function() {
      GoalBuilder.successClick();
      expect($state.go).toHaveBeenCalledWith('paymentspage');
    });
  })


});

