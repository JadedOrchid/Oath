angular.module('oath.progressCtrl', [])
.controller('ProgressCtrl', ['$scope', '$state', 'User', 'GoalBuilder',  function($scope, $state, User, GoalBuilder) {
  if (!User.loggedIn){
    $state.go('login');
  }
  var goals = User.loggedIn.goals.filter(function(goal){
    return !goal.celebrated;
  }).reverse();
  $scope.goals = goals.map(processGoal);
    // Chart.js Options
   $scope.goalOptions =  {
      responsive: true,
      segmentShowStroke : false,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 60,
      animationSteps : 1,
      animationEasing : 'easeInBounce',
      animateRotate : false,
      animateScale : false,
      legendTemplate : ''
    };

    $scope.timeOptions =  {
      responsive: true,
      segmentShowStroke : false,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 80,
      animationSteps : 1,
      animationEasing : 'easeInBounce',
      animateRotate : false,
      animateScale : false,
      legendTemplate : ''
    };

    function processGoal(goal){
      goal.goalRemaining = Math.max( + goal.target - goal.progress, 0) ;
      goal.graphData = [{
          value: goal.progress,
          color:'#ffc125', // salmon
          // highlight: '#FF5A5E',
          label: ''
        },
        {
          value: goal.goalRemaining,
          color: '#ececec', // grey
          // highlight: '#46BFBD',
          label: ''
        } ];
        var now = Math.floor(Date.now() / 1000);
        goal.timeElapsed =  now - goal.startTime;
        var timeRemaining = goal.period.seconds - goal.timeElapsed;
        goal.timeRemaining = convertTime(timeRemaining);

      goal.timeData = [{
          value: goal.timeElapsed,
          color:'#ececec',
          // highlight: '#28BE9B',
          label: ''
        },
        {
          value: timeRemaining,
          color: '#26b099',
          // highlight: '#5AD3D1',
          label: ''
        } ];

      if (goal.goalType.title !== "Sleep Goal"){
        goal.displayProgress = goal.progress + ' ' + goal.goalType.unit;
      } else {
        goal.displayProgress = convertTime( +goal.progress);
      }
      return goal;
    }

    function convertTime(seconds){
      if (seconds < 60){
        var num = seconds;
        return num + " second" + ((num === 1) ? '' : 's');
      } else if (seconds < 60 * 60) {
        var num = Math.floor(seconds / 60);
        return  num + " minute" + ((num === 1) ? '' : 's');
      } else if (seconds < 60 * 60 * 24 ) {
        var num = Math.floor(seconds / 60 / 60);
        return num + " hour" + ((num === 1) ? '' : 's');
      } else {
        var num = Math.floor(seconds / 60 / 60 / 24);
        return num + " day" + ((num === 1) ? '' : 's');
      }
    };
}]);
