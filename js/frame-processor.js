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

    getFrameRate: function () {
        return this._frame.currentFrameRate;
    }
});
