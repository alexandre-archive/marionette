$(document).ready(function () {
    $("#container").start();

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
            console.log('Left hand moving...');
            var p = frameProcessor.getScreenPosition(leftHand);
            $('#container').moveObject('left', p.x, p.y, p.z);
        }

        if (rightHand) {
            console.log('Right hand moving...');
            var p = frameProcessor.getScreenPosition(rightHand);
            $('#container').moveObject('right', p.x, p.y, p.z);
        }
    });

    listener.on('handFound', function (hand, type) {
        console.log('%s hand found.', type);
        var obj = type === 'left' ? 'horse' : 'flamingo';
        $('#container').addObject(type, obj);
    });

    listener.on('handLost', function (hand, type) {
        console.log('%s hand lost.', type);
        $('#container').removeObject(type);
    });

    listener.setup();
    listener.start();
});