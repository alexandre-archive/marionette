function HandPosition(x, y, z) {
    this.x = x; // X axis.
    this.y = y; // Y axis.
    this.z = z; // Z axis.
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

    getScreenPosition: function(hand, screen) {
        var x = 100, y = 100, z = 100; // Center screen.
        // window.screen.availHeight
        // window.screen.availWidth
        return new HandPosition(x, y, z);
    },

    getFrameRate: function () {
        return this._frame.currentFrameRate;
    }
});
