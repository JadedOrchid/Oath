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
    it('should respond to goaltype', function() {
      expect($state.href('goaltype')).toEqual('#/goaltype');
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
  });

});