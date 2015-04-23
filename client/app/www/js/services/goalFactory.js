angular.module('oath.goalFactory', [])
.factory('GoalBuilder', ['User', '$http', function(User, $http) {
  var GoalBuilder = {};

  //THE GOAL
  GoalBuilder.goal = {
    completed: false,
    celebrated: false
  };

  //DATA
  GoalBuilder.returnGoals = function(){
    var goalTypes = [
      {
        title: "Step",
        unit: "steps",
        phase: "day",
        suggestedTarget: 10000,
        iconClass: "ion-android-walk"
      },
      {
        title: "Sleep",
        unit: "hours",
        phase: "night",
        suggestedTarget: 8,
        iconClass: "ion-ios-cloudy-night-outline"
      },
      {
        title: "Cycle",
        unit: "miles",
        phase: "day",
        suggestedTarget: 10,
        iconClass: "ion-android-bicycle"
      },
      {
        title: "Run",
        unit: "miles",
        phase: "day",
        suggestedTarget: 5,
        iconClass: "ion-android-walk"
      },
      {
        title: "Focus",
        unit: "minutes",
        phase: "day",
        suggestedTarget: 240,
        iconClass: "ion-android-radio-button-on"
      },
      {
        title: "Tech",
        unit: "minutes",
        phase: "day",
        suggestedTarget: 240,
        iconClass: "ion-ios-monitor"
      }
    ];

    return goalTypes;
  };

  GoalBuilder.returnSucesses = function(){
    //images need to be 760px by 380px
    var successTypes = [
      {
        orgName: 'Doctors Without Borders',
        headline: 'Vaccines - Doctors Without Borders',
        description: 'helps people worldwide where the need is greatest, delivering emergency medical aid to people affected by conflict, epidemics, disasters or exclusion from health care.',
        price: '$5',
        stripePrice: 500,
        img: '../img/msf.jpg',
        clickAction: 'Buy a vaccine'
      },
      {
        orgName: 'The Arbor Day Foundation',
        headline: 'Plant a tree with the Arbor Day Foundation',
        description: 'inspires people to plant, nurture, and celebrate trees.',
        price: '$25',
        stripePrice: 2500,
        img: '../img/arbor.jpg',
        clickAction: 'Buy a tree'
      },
      {
        orgName: 'TerraPass',
        headline: 'Offset a flight with TerraPass',
        description: 'helps create, implement, and operate customer-funded emissions reduction projects at facilities such as dairy farms and landfills.',
        price: '$35',
        stripePrice: 1500,
        img: '../img/carbonoffset.jpg',
        clickAction: 'Offset a flight'
      }
    ];
    return successTypes;
  };

  GoalBuilder.returnTimes = function(){
    var times = [
      "One Day",
      "One Week",
      "One Month",
      "One Year"
    ];
    return times;
  };

  GoalBuilder.returnFailures = function(){
    var failTypes = [
      {
        orgName: 'Tip the developers',
        description: "to support the development of Oath. Maybe we'll donate it ourselves, or maybe we'll buy cupcakes. Or go to Vegas.",
        img: '../img/developers.jpg',
        clickAction: 'Tip the developers'
      },
      {
        orgName: 'Consolation Cupcakes',
        description: 'will provide the nessecary sugar to support your next attempt. Shipped from SF, CA.',
        img: '../img/cupcake.jpg',
        clickAction: 'Send the cupcakes'
      }
    ];
    return failTypes;
  };

  GoalBuilder.getDays = function(timeframe){
    var timeframes = {
      "One Day": 1,
      "One Week": 7,
      "One Month": 30,
      "One Year": 365
    };
    return timeframes[timeframe];
  };

  GoalBuilder.saveGoal = function(goal) {
    var copy = angular.copy(goal);
    //prepend a copy to local goals array
    User.loggedIn.goals.push(copy);
  };

  GoalBuilder.sendGoal = function(goal){
    $http.post('/api/goals', goal)
      .success(function(data, status, headers, config) {
        console.log('YAY!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your goal could not be added');
      });
  };

  GoalBuilder.convertTime = function(timeframe) {
    var seconds = {
      'One Day': 86400,
      'One Week': 604800,
      'One Month': 2592000,
      'One Year': 3.15569e7
    }
    return seconds[timeframe];
  };

  return GoalBuilder;
}]);
