var FrameProcessor = EventListener.extend(function (params) {
    this._frame = params.frame;
    _self = this;
}).methods({

    getHandsCount: function () {
        return this.frame.hands.length;
    },

    getFingersCount: function () {
        return _.reduce(this.frame.hands, function (memo, hand) {
            return memo + hand.fingers.length;
        }, 0);
    },

    getExtendedFingersCount: function () {
        return _.reduce(this.frame.hands, function (memo, hand) {
            return memo + _.filter(hands.fingers, function (finger) { return finger.extended }).length;
        }, 0);
    }
});
