function HandPosition(x, y, z) {
    this.x = x; // X axis.
    this.y = y; // Y axis.
    this.z = z; // Z axis.
}

/*
    Convert LeapJS space to ThreeJS space.

    @param value: x or y axis.
    @param base: screen width (x) or height (y) size.
    @param d: scale factor to increase leap motion area (default: 2).

    @return the new space position.
*/
function c(value, base, d) {
    var oldMax = base,
        oldMin = 0,
        newMax = base / (d || 2),
        newMin = base / -(d || 2);

    var oldRange = (oldMax - oldMin),
        newRange = (newMax - newMin);

    return (((value - oldMin) * newRange) / oldRange) + newMin;
}

var FrameProcessor = klass(function (params) {
    this._frame = params.frame;
    _self = this;
}).methods({

    getHandsCount: function () {
        return this._frame.hands.length;
    },

    getFingersCount: function () {
        return _.reduce(this._frame.hands, function (memo, hand) {
            return memo + hand.fingers.length;
        }, 0);
    },

    getExtendedFingersCount: function () {
        return _.reduce(this._frame.hands, function (memo, hand) {
            return memo + _.filter(hand.fingers, function (finger) { return finger.extended }).length;
        }, 0);
    },

    getLeftHand: function () {
        return _.findWhere(this._frame.hands, { type: 'left' });
    },

    getRightHand: function () {
        return _.findWhere(this._frame.hands, { type: 'right' });
    },

    getScreenPosition: function(hand) {
        var p = hand.screenPosition();
        var x = c(p[0], window.innerWidth, 5), y = c(p[1] * -1, window.innerHeight), z = p[2];
        return new HandPosition(x, y, z);
    },

    getFrameRate: function () {
        return this._frame.currentFrameRate;
    }
});
