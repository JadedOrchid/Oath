describe('Routes', function() {
  //Login
  describe('login', function() {
    var $state;

    beforeEach(function() {
      module('starter');
      inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
        $state = _$state_;
      });
    });

    it('should respond to login', function() {
      expect($state.href('login')).toEqual('#/login');
    });
    it('should respond to localLogin', function(){
      expect($state.href('localLogin')).toEqual('#/locallogin');
    });
    xit('should respond to localSignup', function(){
      expect($state.href('localSignup')).toEqual('#/localsignup');
    });
    it('should respond to purgatory', function(){
      expect($state.href('purgatory')).toEqual('#/purgatory');
    });
    it('should respond to goaltype', function() {
      expect($state.href('goaltype')).toEqual('#/goaltype');
    });
    it('should respond to signup', function(){
      expect($state.href('signup')).toEqual('#/signup');
    });
    it('should respond to deviceAuth', function() {
      expect($state.href('deviceAuth')).toEqual('#/deviceauth');
    });
    it('should respond to goaldetails', function() {
      expect($state.href('goaldetails')).toEqual('#/goaldetails');
    });
    it('should respond to goalsuccess', function() {
      expect($state.href('goalsuccess')).toEqual('#/goalsuccess');
    });
    it('should respond to goalfailure', function() {
      expect($state.href('goalfailure')).toEqual('#/goalfailure');
    });
    it('should respond to payment', function(){
      expect($state.href('payment')).toEqual('#/payment');
    });
    it('should respond to progress', function(){
      expect($state.href('progress')).toEqual('#/progress');
    });
    it('should respond to successreport', function(){
      expect($state.href('successreport')).toEqual('#/successreport');
    });
    it('should respond to failurereport', function(){
      expect($state.href('failurereport')).toEqual('#/failurereport');
    });
    it('should respond to settings', function(){
      expect($state.href('settings')).toEqual('#/settings');
    });
  });

});

// [x] login
// [x] localLogin
// [] localSignup 'is this being used?'
// [x] purgatory
// [x] goaltype
// [x] signup
// [x] deviceAuth
// [x] goaldetails
// [x] goalsuccess
// [x] goalfailure
// [x] payment
// [x] progress
// [x] successreport
// [x] failurereport
// [x] settings