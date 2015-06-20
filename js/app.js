function moveObject(hand) {
    if (hand && (hand.timeVisible > .25) && (hand.confidence > .7)) {
        var p = hand.get3JsScreenPosition();
        $('#container').moveObject(hand.type, p.x, p.y, p.z);
    }
}

$(document).ready(function () {
    $("#container").start();

    var controller = new Leap.Controller();

    controller.use('screenPosition')
        .use('handEntry')
        .use('threejsPosition')
        .use('frameExtras');

    controller.on('frame', function (frame) {
        moveObject(frame.getLeftHand());
        moveObject(frame.getRightHand());
    });

    controller.on('handFound', function (hand) {
        var obj = hand.type === 'left' ? 'horse' : 'flamingo';
        $('#container').addObject(hand.type, obj);
        moveObject(hand);
    });

    controller.on('handLost', function (hand) {
        $('#container').removeObject(hand.type);
    });

    controller.connect();
});