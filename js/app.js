$(document).ready(function () {
    $("#container").start();
    $('#container').addObject('left');
    $('#container').addObject('right');

    var listener = new LeapListener();

    listener.on('connecting', function () {
    });

    listener.on('connected', function () {
    });

    listener.on('connectionTimedout', function () {
    });

    listener.on('pause', function () {
    });

    listener.on('resume', function () {
    });

    listener.on('data', function (frameProcessor) {
        if (frameProcessor == undefined) return;

        var leftHand = frameProcessor.getLeftHand(),
            rightHand = frameProcessor.getRightHand();

        if (leftHand) {
            console.log('Left hand detected.');
            //var pos = frameProcessor.getScreenPosition(leftHand);
            console.log(leftHand.screenPosition());
        }

        if (rightHand) {
            console.log('Right hand detected.');
            //var pos = frameProcessor.getScreenPosition(rightHand);
            console.log(rightHand.screenPosition());
        }
    });

    listener.setup();
    listener.start();
});