var app = angular.module("CalendarExercise", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "/src/app.html",
            controller: "mainCtrl"
        }).otherwise({
            redirectTo: "/"
        });
    });
app.controller("mainCtrl", function ($scope, $http) {
    $scope.startDate = null;
    $scope.numberOfDays = null;
    $scope.countryCode = null;
    $scope.months = [];
    $scope.calculate = calculate;
    $scope.monthsText = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    function calculate() {
        var tempDate = new Date($scope.startDate.getTime());
        var weekIndex = 0;
        $scope.months = [];
        for (var i = 0; i < $scope.numberOfDays; i++) {
            if (monthsAreEmpty()) {
                $scope.months.push({
                    monthIndex: tempDate.getMonth(),
                    weeks: [{
                        index: weekIndex,
                        days: []
                    }]
                });
                populateDaysOnWeeks(tempDate, weekIndex);
            } else if (monthIsNotPresentOnArray(tempDate)) {
                populateRemainingDaysOfTheWeek(tempDate);
                weekIndex = 0;
                $scope.months.push({
                    monthIndex: tempDate.getMonth(),
                    weeks: [{
                        index: weekIndex,
                        days: []
                    }]
                });
                populateDaysOnWeeks(tempDate, weekIndex);
            } else {
                populateDaysOnWeeks(tempDate, weekIndex);
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        populateRemainingDaysOfTheWeek(tempDate);


        $http.get("http://holidayapi.com/v1/holidays",{ country: $scope.countryCode, year: $scope.startDate.getFullYear }).then(function success(response) {
            console.log(response);
        });


        console.log($scope.months);
    }

    function populateRemainingDaysOfTheWeek(tempDate) {
        if (tempDate.getDay() < 6) {
            for (var z = tempDate.getDay() ; z <= 6 ; z++) {
                $scope.months[$scope.months.length - 1].weeks[$scope.months[$scope.months.length - 1].weeks.length - 1].days.push({
                    day: null,
                    date: "-"
                });
            }
        }
    }

    function populateDaysOnWeeks(tempDate, weekIndex) {
        if (tempDate.getDay() > 0 && $scope.months[$scope.months.length - 1].weeks[$scope.months[$scope.months.length - 1].weeks.length - 1].days.length === 0) {
            for (var z = 0; z < tempDate.getDay() ; z++) {
                $scope.months[$scope.months.length - 1].weeks[$scope.months[$scope.months.length - 1].weeks.length - 1].days.push({
                    day: null,
                    date: "-"
                });
            }
        }

        $scope.months[$scope.months.length - 1].weeks[$scope.months[$scope.months.length - 1].weeks.length - 1].days.push({
            day: tempDate.getDay(),
            date: tempDate.getDate()
        });

        if ($scope.months[$scope.months.length - 1].weeks[$scope.months[$scope.months.length - 1].weeks.length - 1].days.length === 7) {
            weekIndex++;
            $scope.months[$scope.months.length - 1].weeks.push({
                index: weekIndex,
                days: []
            });
        }
    }

    function monthsAreEmpty() {
        return $scope.months.length === 0;
    }

    function monthIsNotPresentOnArray(tempDate) {
        return $scope.months[$scope.months.length - 1].monthIndex !== tempDate.getMonth();
    }

});
