var drawer;

function rotateRadian(radian){
    if (radian < 0) {
        return radian - Math.PI;
    } else {
        return radian + Math.PI;
    }
}

function moveObject(hand) {
    if (hand && (hand.timeVisible > 0.25) && (hand.confidence > 0.7)) {
        var pitch = hand.pitch(),
            roll = hand.roll() * -1,
            yaw = hand.yaw() * -1,
            p = {
                x: hand.stabilizedPalmPosition[0],
                y: hand.stabilizedPalmPosition[1],
                z: hand.stabilizedPalmPosition[2]
            };

        drawer.moveObject(hand.type, p.x, p.y, p.z);
        drawer.rotateObject(hand.type, pitch, rotateRadian(yaw), roll);
    }
}

$(document).ready(function () {
    drawer = new MarionetteDrawer();
    drawer.setup();
    drawer.setupStats();
    drawer.setBackground();
    drawer.animate();

    var controller = new Leap.Controller();

    controller.use('screenPosition', {
            scale: 0.25
        })
        .use('handEntry')
        .use('leapExtras')
        .use('boneHand', {
            scene: drawer.scene,
            targetEl: document.body,
            arm: false
        });

    controller.on('frame', function (frame) {
        moveObject(frame.getLeftHand());
        moveObject(frame.getRightHand());
    });

    controller.on('handFound', function (hand) {
        var p = hand.screenPosition();
        if (hand.type === 'left') {
            drawer.addHorse(hand.type, p.x, p.y, p.z);
        } else if (hand.type == 'right') {
            drawer.addFlamingo(hand.type, p.x, p.y, p.z);
        } else {
            drawer.addCube(hand.type);
        }
    });

    controller.on('handLost', function (hand) {
        drawer.removeObject(hand.type);
    });

    controller.connect();
});