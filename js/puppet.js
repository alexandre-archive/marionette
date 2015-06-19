(function($) {

    var marionetteDrawer;

    $.fn.start = function() {
        marionetteDrawer = new MarionetteDrawer();
        marionetteDrawer.init(this.context.getElementById('container'));
        marionetteDrawer.addScenario();
        marionetteDrawer.animate();
    }

    $.fn.stop = function() {
        marionetteDrawer.stop();
    }

    $.fn.play = function() {
        marionetteDrawer.play();
    }

    $.fn.removeObject = function(id) {
        marionetteDrawer.removeObject(id);
    }

    $.fn.addObject = function(id, type) {
        if (type == 'horse') {
            marionetteDrawer.addHorse(id);
        } else if (type == 'flamingo') {
            marionetteDrawer.addFlamingo(id);
        } else {
            marionetteDrawer.addCube(id);
        }
    }

    $.fn.moveObject = function(id, x, y, z) {
        marionetteDrawer.moveObject(id, x, y, z);
    }

    $.fn.rotateObjectX = function(id, angle) {
        marionetteDrawer.rotateObjectX(id, angle);
    }

    $.fn.rotateObjectY = function(id, angle) {
        marionetteDrawer.rotateObjectY(id, angle);
    }

    $.fn.moveLeftHand = function(id, x, y, z) {
        //marionetteDrawer.moveObject(id, x, y, z);
    }

    $.fn.moveRightHand = function(id, x, y, z) {
        //marionetteDrawer.moveObject(id, x, y, z);
    }

    $.fn.moveLeftLeg = function(id, x, y, z) {
        //marionetteDrawer.moveObject(id, x, y, z);
    }

    $.fn.moveRightLeg = function(id, x, y, z) {
        //marionetteDrawer.moveObject(id, x, y, z);
    }

    $.fn.addObjects = function() {
        $('container').addObject('a', 'horse');
        $('container').addObject('b', 'flamingo');
    }

    $.fn.organize = function() {
        $('container').moveObject('b', -200, 250, 0);
    }

}(jQuery));