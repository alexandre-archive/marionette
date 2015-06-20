var drawer;

function moveObject(hand) {
    if (hand && (hand.timeVisible > .25) && (hand.confidence > .7)) {
        var pitch = hand.pitchDegree(),
            roll = hand.rollDegree(),
            yaw = hand.yawDegree(),
            p = hand.get3JsScreenPosition();

        drawer.moveObject(hand.type, p.x, p.y, p.z);
        drawer.rotateObject(hand.type, pitch * -1, yaw, roll);
    }
}

$(document).ready(function () {
    drawer = new MarionetteDrawer();
    drawer.init(document.getElementById('container'));
    drawer.addScenario();
    drawer.animate();

    var controller = new Leap.Controller();

    controller.use('screenPosition')
        .use('handEntry')
        .use('threejsPosition')
        .use('leapExtras');

    controller.on('frame', function (frame) {
        moveObject(frame.getLeftHand());
        moveObject(frame.getRightHand());
    });

    controller.on('handFound', function (hand) {
        if (hand.type === 'left') {
            drawer.addHorse(hand.type);
        } else if (hand.type == 'right') {
            drawer.addFlamingo(hand.type);
        } else {
            drawer.addCube(hand.type);
        }

        drawer.moveObject(hand.type);
    });

    controller.on('handLost', function (hand) {
        drawer.removeObject(hand.type);
    });

    controller.connect();
});