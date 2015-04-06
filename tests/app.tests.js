describe("Unit Testing Ionic", function () {
  beforeEach(module('starter'))
  beforeEach(module('starter.factories'))

  var $scope;
  var $controller;
  var GoalBuilder;
  var $log;

  beforeEach(inject(function($rootScope, _$controller_, _GoalBuilder_, _$log_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
    GoalBuilder = _GoalBuilder_;
    $log = _$log_;
  }));

  describe('GOAL BUILDER FACTORY', function(){
    it('Should have a goal builder factory', function() {
      var $scope = {};
      var controller = $controller('GoalDetailCtrl', { $scope: $scope });

      GoalBuilder.goalClick('step');
      expect(typeof GoalBuilder.goal).toBe('object');
      expect(GoalBuilder.goal.goalType).toBe('step');
    });

    describe('RETURN GOALS FUNCTION', function(){

      it('Should return an array of objects', function() {
        var $scope = {};
        var controller = $controller('GoalDetailCtrl', { $scope: $scope });
        var goalTypes = GoalBuilder.returnGoals();

        expect(Array.isArray(goalTypes)).toBe(true);
      });

      it('Object should have title', function() {
        var $scope = {};
        var controller = $controller('GoalDetailCtrl', { $scope: $scope });
        var goalTypes = GoalBuilder.returnGoals();

        expect(goalTypes[0].title).toBeDefined();
      });

      it('Object should have unit', function() {
        var $scope = {};
        var controller = $controller('GoalDetailCtrl', { $scope: $scope });
        var goalTypes = GoalBuilder.returnGoals();

        expect(goalTypes[0].unit).toBeDefined();
      });
    })
  })


  //Test Goal Ctrl

  //Test Goal Success Ctrl

  //Test Goal Failure Ctrl
});

