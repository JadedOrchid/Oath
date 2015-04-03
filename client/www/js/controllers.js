angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope) {})

// .controller('ChatsCtrl', function($scope, Chats) {
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   }
// })

.controller('GoalCtrl', function($scope, $stateParams, $state) {
  $scope.user = {};  
  $scope.goalTypes = [
    "Step Goal",
    "Sleep Goal",
    "Cycling Distance Goal",
    "Cycling Climbing Goal",
    "Tech Usage Goal",
    "Running Distance Goal",
    "Focus Goal"
  ];

  $scope.goalClick = function(goal){
    var user = $scope.user;
    user.goalType = goal;
    $state.go('goaldetails');
    // console.log('this is user: ', user)
  };

  $scope.showScope = function(){
    console.log("This is the scope", $scope);
  };
});








// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

// .controller('LoginCtrl', function($scope, $stateParams) {
//   $scope.face = "This is my face";
//   // console.log("This is the login controller");
// })

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
