/*
Leap.loop(function(frame){
        $('#hands-length').text(frame.hands.length);

        var fingers = 0, fingersExt = 0;

        for (var i = frame.hands.length - 1; i >= 0; i--) {
            fingers += frame.hands[i].fingers.length;

            for (var x = frame.hands[i].fingers.length - 1; x >= 0; x--) {
                if (frame.hands[i].fingers[x].extended) fingersExt++;
            };
        };

        $('#fingers-length').text(fingers);
        $('#fingers-ext-length').text(fingersExt);
});*/

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
        console.log('foi');
        $('#pauseModal').modal('show');
    })

    listener.setup();
    listener.start();
});
