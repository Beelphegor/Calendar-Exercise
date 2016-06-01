var app = angular.module("CalendarExercise", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "/src/app.html",
            controller: "mainCtrl"
        }).otherwise({
            redirectTo: "/"
        });
    });
app.controller("mainCtrl", function($scope) {
    $scope.helloWorld = "hello world!";
});
