Leap.Controller.plugin('leapExtras', function() {

    return {
        frame: {
            getLeftHand: function () {
                return $.grep(this.hands, function (hand){ return hand.type === 'left'; })[0];
            },

            getRightHand: function () {
                return $.grep(this.hands, function (hand){ return hand.type === 'right' })[0];
            },
        }
    };
});
