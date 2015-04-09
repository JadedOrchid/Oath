describe("Unit Testing Ionic", function () {
  beforeEach(module('starter'))
  beforeEach(module('starter.factories'))

  var $scope;
  var $controller;
  var GoalBuilder;
  var $log;
  var $state;
  var User;

  beforeEach(inject(function($rootScope, _$controller_, _GoalBuilder_, _$log_, _$state_, _User_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
    GoalBuilder = _GoalBuilder_;
    $state = _$state_;
    User = _User_;
    spyOn($state, 'go');
    spyOn(GoalBuilder, 'sendGoal');
    spyOn(GoalBuilder, 'saveGoal');
  }));


  describe('GOAL BUILDER FACTORY', function(){
    it('Should have a goal object', function() {
      expect(typeof GoalBuilder.goal).toBe('object');
    });

    describe('RETURN GOALS FUNCTION', function(){

      it('Should return an array of objects', function() {
        var goalTypes = GoalBuilder.returnGoals();
        expect(Array.isArray(goalTypes)).toBe(true);
      });

      it('Object should have title', function() {
        var goalTypes = GoalBuilder.returnGoals();
        expect(goalTypes[0].title).toBeDefined();
      });

      it('Object should have unit', function() {
        var goalTypes = GoalBuilder.returnGoals();
        expect(goalTypes[0].unit).toBeDefined();
      });
    })
  })

  describe('GOAL CLICK FUNCTION', function(){
    it('Should update the goal object with goal type', function(){
      GoalBuilder.goalClick('Step Goal');
      expect(GoalBuilder.goal.goalType).toBe('Step Goal');
    });

    it('Should redirect to goal details', function(){
      GoalBuilder.goalClick('Sleep Goal');
      expect($state.go).toHaveBeenCalledWith('deviceAuth');
    });
  });

  describe('RETURN SUCCESSES', function(){

    it('Should return an array of objects', function() {
      var successes = GoalBuilder.returnSucesses();
      expect(Array.isArray(successes)).toBe(true);
      expect(typeof successes[0]).toBe('object');
    });

    it('Object should have orgName', function() {
      var goalTypes = GoalBuilder.returnSucesses();
      expect(goalTypes[0].orgName).toBeDefined();
    });

    it('Object should have description', function() {
      var goalTypes = GoalBuilder.returnSucesses();
      expect(goalTypes[0].description).toBeDefined();
    });

    it('Object should have price', function() {
      var goalTypes = GoalBuilder.returnSucesses();
      expect(goalTypes[0].price).toBeDefined();
    });

    it('Object should have img', function() {
      var goalTypes = GoalBuilder.returnSucesses();
      expect(goalTypes[0].img).toBeDefined();
    });
  });

  describe('SUCCESS CLICK FUNCTION', function(){
    it('Should update the goal object with success object', function(){
      GoalBuilder.successClick({
        orgName: 'Red Cross',
        description: 'Buy a vaccination',
        price: '$5',
        img: 'imgurl'
      });
      expect(GoalBuilder.goal.success.orgName).toBe('Red Cross');
    });

    it('Should redirect to goal details', function(){
      GoalBuilder.successClick({});
      expect($state.go).toHaveBeenCalledWith('goalfailure');
    });
  });

  describe('RETURN TIMES', function(){
    it('Should return an array of strings', function() {
      var times = GoalBuilder.returnTimes();
      expect(Array.isArray(times)).toBe(true);
      expect(typeof times[0]).toBe('string');
    });
  });

  describe('RETURN FAILURES', function(){

    it('Should return an array of objects', function() {
      var failures = GoalBuilder.returnFailures();
      expect(Array.isArray(failures)).toBe(true);
      expect(typeof failures[0]).toBe('object');
    });

    it('Object should have orgName', function() {
      var goalTypes = GoalBuilder.returnFailures();
      expect(goalTypes[0].orgName).toBeDefined();
    });

    it('Object should have description', function() {
      var goalTypes = GoalBuilder.returnFailures();
      expect(goalTypes[0].description).toBeDefined();
    });

    it('Object should have img', function() {
      var goalTypes = GoalBuilder.returnFailures();
      expect(goalTypes[0].img).toBeDefined();
    });
  });

  describe('FAIL CLICK FUNCTION', function(){
    it('Should update the goal object', function(){
      GoalBuilder.failClick({
        orgName: 'Tip the developers',
        description: "We're broke",
        img: 'imgurl'
      });
      expect(GoalBuilder.goal.fail.orgName).toBe('Tip the developers');
    });

    it('Should call sendGoal() to server', function(){
      GoalBuilder.failClick();
      expect(GoalBuilder.sendGoal).toHaveBeenCalled();
    });

    it('Should call saveGoal() to server', function(){
      GoalBuilder.failClick();
      expect(GoalBuilder.saveGoal).toHaveBeenCalled();
    });

    it('Should call saveGoal() to server', function(){
      GoalBuilder.failClick();
      if(User.loggedIn.hasPayment){
        expect($state.go).toHaveBeenCalledWith('progress');
      } else {
        expect($state.go).toHaveBeenCalledWith('payment');
      }
    });

    it('Should check if user has payment and redirect accordingly', function(){
      User.loggedIn.hasPayment = false;
      GoalBuilder.failClick();
      expect($state.go).toHaveBeenCalledWith('payment');

      User.loggedIn.hasPayment = true;
      GoalBuilder.failClick();
      expect($state.go).toHaveBeenCalledWith('progress');
    });
  });

}); 

