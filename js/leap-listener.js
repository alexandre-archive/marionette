function SetupException(message) {
   this.message = message;
   this.name = "SetupException";
}

TIMEOUT = 30; // seconds

var LeapListener = EventListener.extend(function (params) {
    this._controller = undefined;
    this._connectTimeout = undefined;
    _this = this;
}).methods({
    _onConnect: function () {
        clearTimeout(_this._connectTimeout);
        console.log('Leap Motion connected.');
        _this.trigger('connected', []);
    },

    _onFrame: function (frame) {
        _this.trigger('data', [new FrameProcessor({frame: frame})]);
    },

    _onHandFound: function (hand) {
        _this.trigger('handFound', [hand, hand.type]);
    },

    _onHandLost: function (hand) {
        _this.trigger('handLost', [hand, hand.type]);
    },

    /* Connect all events. */
    _connectEvents: function () {
        this._controller.on('frame', this._onFrame);
        this._controller.on('handFound', this._onHandFound);
        this._controller.on('handLost', this._onHandLost);
    },

    setup: function (params) {
        console.log('Setting up Leap Motion controller...');
        this._controller = new Leap.Controller(params);
        // http://leapmotion.github.io/leapjs-plugins/docs/
        this._controller.use('screenPosition');
        this._controller.use('handEntry');
        this._connectEvents();
    },

    /* Start Leap Motion Controller. */
    start: function () {
        if (this._controller === undefined) {
            throw new SetupException('You need to call setup before start.')
        }

        console.log('Starting connection with Leap Motion...');
        this.trigger('connecting', []);
        this._controller.connect();

        this._connectTImeout = setTimeout(function () {
            _this.trigger('connectionTimedout', []);
            console.log('Leap Motion connection timed out.')
        }, TIMEOUT * 1000);
    },

    stop: function () {
        if (this._controller === undefined) {
            throw new SetupException('You need to call setup before stop.')
        }
        console.log('Finishing Leap Motion connection...');
        this._controller.disconnect();
    },
});
