describe('login', function() {

  var $rootScope; 
  var $state; 
  var $injector;
  var myServiceMock;
  var state = 'login';

  beforeEach(function() {

    module('starter', function($provide) {
      $provide.value('GoalBuilder', myServiceMock = {});
    });

    inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;

      // We need add the template entry into the templateCache if we ever
      // specify a templateUrl
      $templateCache.put('login.html', '');
    })
  });

  it('should respond to URL', function() {
    expect($state.href(state)).toEqual('#/login');
  });

  // it('should resolve data', function() {
  //   var spy = jasmine.createSpy('findAll');
  //   myServiceMock.findAll = spy.and.returnValue('findAll');

  //   $state.go(state);
  //   $rootScope.$digest();
  //   expect($state.current.name).toBe(state);

  //   // Call invoke to inject dependencies and run function
  //   expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
  // });
});