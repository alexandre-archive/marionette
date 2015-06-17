

var Msg = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'danger'
};

angular.module('MarionetteApp', []).controller('MarionetteController', function ($scope, $timeout) {
    $scope.Msg = Msg;
    $scope.msg = {};

    $scope.showMessage = function (type, message, autoClose) {
        if($scope.$$phase) {
            $scope.msg = {
                type: type,
                message: message
            };
        } else {
            $scope.$apply(function () {
                $scope.msg = {
                    type: type,
                    message: message
                };
            });
        }

        if (autoClose) {
            $timeout(function () {
                $scope.msg = {};
            }, 15000);
        }
    }

    var listener = new LeapListener();

    listener.on('connecting', function () {
        $scope.showMessage(Msg.INFO, 'Connecting to Leap Motion...');
    });

    listener.on('connected', function () {
        $scope.showMessage(Msg.SUCCESS, 'Connected', true);
    });

    listener.on('connectionTimedout', function () {
        $scope.showMessage(Msg.ERROR, 'Connection timed out', true);
    });

    listener.on('pause', function () {
        $('#pauseModal').modal('show');
    });

    listener.on('resume', function () {
        $('#pauseModal').modal('hide');
    });

    listener.on('data', function (frameProcessor) {
        if (frameProcessor == undefined) return;

        $('#hands-length').text(frameProcessor.getHandsCount());
        $('#fingers-length').text(frameProcessor.getFingersCount());
        $('#fingers-ext-length').text(frameProcessor.getExtendedFingersCount());

        var leftHand = frameProcessor.getLeftHand(),
            rightHand = frameProcessor.getRightHand();

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (leftHand) {
            console.log('Left hand detected.');
            var pos = frameProcessor.getScreenPosition(leftHand);

            var centerX = pos.x;
            var centerY = pos.y;


            var radius = 7;

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();

        }

        if (rightHand) {
            console.log('Right hand detected.');
            var pos = frameProcessor.getScreenPosition(rightHand);

            var centerX = pos.x;
            var centerY = pos.y;
            var radius = 7;

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'gray';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }
    });

    listener.setup();
    listener.start();
});

$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
});