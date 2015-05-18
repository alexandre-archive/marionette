function SetupException(message) {
   this.message = message;
   this.name = "SetupException";
}

TIMEOUT = 30; // seconds

var LeapListener = EventListener.extend(function (params) {
    this._controller = undefined;
    this._connectTimeout = undefined;
    _self = this;
}).methods({
    _onConnect: function () {
        clearTimeout(_self._connectTimeout);
        console.log('Leap Motion connected.');
        _self.trigger('connected', []);
    },

    _onFrame: function (frame) {
        $('#hands-length').text(frame.hands.length);

        var fingers = 0, fingersExt = 0;

        for (var i = frame.hands.length - 1; i >= 0; i--) {
            fingers += frame.hands[i].fingers.length;

            for (var x = frame.hands[i].fingers.length - 1; x >= 0; x--) {
                if (frame.hands[i].fingers[x].extended) fingersExt++;
            };
        };

        $('#fingers-length').text(fingers);
        $('#fingers-ext-length').text(fingersExt);
    },

    /* Connect all events. */
    _connectEvents: function () {
        //this._controller.on('frame', this._onFrame);
        //this._controller.on('connect', this._onConnect);
        this._controller.on('blur', function () { console.log('blur'); _self.trigger('pause'); });
        this._controller.on('deviceAttached', function () { console.log('deviceAttached') });
        //this._controller.on('deviceConnected', function () { console.log('deviceConnected') });
        //this._controller.on('deviceDisconnected', function () { console.log('deviceDisconnected') });
        this._controller.on('deviceRemoved', function () { console.log('deviceRemoved') });
        this._controller.on('deviceStopped', function () { console.log('deviceStopped') });
        this._controller.on('deviceStreaming', function () { console.log('deviceStreaming') });
        this._controller.on('disconnect', function () { console.log('disconnect') });
        this._controller.on('focus', function () { console.log('focus') });
        //this._controller.on('frame', function () { console.log('frame') });
        this._controller.on('gesture', function () { console.log('gesture') });
        //this._controller.on('frameEnd', function () { console.log('frameEnd') });
        this._controller.on('protocol', function () { console.log('protocol') });
        this._controller.on('streamingStarted', function () { console.log('streamingStarted') });
        this._controller.on('streamingStopped', function () { console.log('streamingStopped') });
        this._controller.on('connect', function () { console.log('connect') });
    },

    setup: function (params) {
        console.log('Setting up Leap Motion controller...');
        this._controller = new Leap.Controller(params);
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
            _self.trigger('connectionTimedout', []);
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
