var timeController = app.controller("timeController", function ($scope, $location, $interval, $timeout, $rootScope) {
    $scope.timeChosen = parseInt($location.$$url.split("/")[1].split("sec")[0]); // 30, 60, 90
    $scope.max = $scope.timeChosen * 1000;

    $scope.setTime = function (newTime) {
        $scope.timeChosen = newTime;
    }

    $rootScope.startTime = timeStart;
    $rootScope.stopTime = disableTime;

    var dateOfStart;

    function timeStart() {
        if ($rootScope.gameOn == false) {
            dateOfStart = new Date().getTime() + $scope.max;
            $rootScope.gameOn = true;
            $scope.timeInterval = $interval(function () {
                if ($rootScope.gameOn == true) {
                    var actualDate = new Date(dateOfStart - new Date().getTime());

                    var millisecond, second, minute;
                    millisecond = actualDate.getMilliseconds();
                    second = actualDate.getSeconds();
                    minute = actualDate.getMinutes();

                    if (millisecond < 10) millisecond = "00" + millisecond;
                    else if (millisecond >= 10 && millisecond < 100) millisecond = "0" + millisecond;
                    if (second < 10) second = "0" + second;
                    if (minute < 10) minute = "0" + minute;

                    if (dateOfStart - new Date().getTime() <= 0) {
                        millisecond = "000";
                        second = "00";
                        minute = "00";
                        timesUp();
                    }

                    $scope.czasik = minute + ":" + second + "." + millisecond;
                    $scope.value = dateOfStart - new Date().getTime();
                }
            }, 1);
        }
    }

    function timesUp() {
        $rootScope.message = "Czas spadł! Przegrałeś!";
        $rootScope.mesVisible = true;
        $rootScope.assemble();
        disableTime();
    }

    function disableTime() {
        $interval.cancel($scope.timeInterval);
        dateOfSTart = undefined;
        $rootScope.reset();
        $rootScope.gameOn = false;
    }
});

timeController.directive('time', function () {
    return {
        templateUrl: 'directives/time/time.html',
        restricts: 'A'
    };
});