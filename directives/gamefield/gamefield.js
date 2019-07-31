var gamefieldController = app.controller('gamefieldController', function ($scope, $location, $interval, $timeout, $rootScope) {
    $scope.cardsCount = [0, 1, 2, 3];
    $scope.tabCard = [];
    $scope.lastChoice;
    $scope.numberOfPairs = 0;
    $scope.pairs = [];
    $scope.block = false;
    $rootScope.message = "";
    $rootScope.mesVisible = false;

    $scope.back = function () {
        $scope.mesVisible = false;
        reset();
        $location.path("/");
    }

    $rootScope.assemble = function() {
        $scope.message = $rootScope.message;
        $scope.mesVisible = $rootScope.mesVisible;
    }

    $rootScope.reset = reset;

    function reset() {
        $scope.numberOfPairs = 0;
        $scope.pairs = [];
        $scope.lastChoice = undefined;
        $scope.tabCard = [];
        $scope.block = false;
        $rootScope.message = "";
        $rootScope.mesVisible = false;
    }

    function generateCards() {
        var tabTemp = [];
        for (var i = 1; i <= 8; i++) {
            for (var j = 0; j < 2; j++) tabTemp.push(i);
        }
        for (var i = tabTemp.length; i > 1; i--) {
            var j = Math.floor(Math.random() * i);
            var temp = tabTemp[i - 1];
            tabTemp[i - 1] = tabTemp[j];
            tabTemp[j] = temp;
        }

        var allTab = [];
        for (var i = 0; i < 4; i++) {
            var line = [];
            for (var j = 0; j < 4; j++) line.push(tabTemp[i * 4 + j]);
            allTab.push(line);
        }
        return allTab;
    }

    function startGame() {
        $scope.tabCard = generateCards();
        $rootScope.startTime();
    }

    function winGame() {
        $rootScope.message = "Zwycięstwo!";
        $rootScope.mesVisible = true;
        $rootScope.assemble();
        $rootScope.stopTime();
    }

    $scope.clicked = function (posX, posY, event) {
        if ($rootScope.gameOn == false) startGame();

        var openedBefore = false;
        $scope.pairs.forEach(function (pair) {
            if (pair.posX == posX && pair.posY == posY) {
                openedBefore = true;
                return;
            }
        });

        if ($scope.block == true) return;
        if (openedBefore) return;

        if ($scope.lastChoice != undefined) {
            if (!($scope.lastChoice.posX == posX && $scope.lastChoice.posY == posY)) {
                event.target.src = 'img/' + $scope.tabCard[posX][posY] + '.jpg';
                if ($scope.lastChoice.imageSrc == 'img/' + $scope.tabCard[posX][posY] + '.jpg') {
                    $scope.pairs.push({ posX, posY });
                    $scope.pairs.push({ posX: $scope.lastChoice.posX, posY: $scope.lastChoice.posY });
                    $scope.numberOfPairs++;
                    if ($scope.numberOfPairs == 8) winGame();
                    $scope.lastChoice = undefined;
                } else {
                    $scope.block = true;
                    $timeout(function () {
                        $scope.block = false;
                        event.target.src = `img/0.jpg`;
                        $scope.lastChoice.target.src = `img/0.jpg`;
                        $scope.lastChoice = undefined;
                    }, 500);
                }
            }
        } else {
            $scope.lastChoice = {
                posX: posX,
                posY: posY,
                imageSrc: 'img/'+$scope.tabCard[posX][posY]+'.jpg',
                target: event.target
            }
            event.target.src = 'img/'+$scope.tabCard[posX][posY]+'.jpg';
        }
    }
});

gamefieldController.directive('gamefield', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/gamefield/gamefield.html'
    }
});