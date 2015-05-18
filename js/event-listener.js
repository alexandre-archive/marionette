/**
* Basic event listener class.
*/
var EventListener = klass(function (params) {
    this._eventListeners = [];
}).methods({
    /**
    * Register a new event listener.
    */
    on: function(event, callback) {
        this._eventListeners[event] = this._eventListeners[event] || [];
        this._eventListeners[event].push(callback);
    },

    /**
    * Removes an event listener.
    */
    off: function(event, callback) {
        var eventListenerArray = this._eventListeners[event];
        if (eventListenerArray) {
            eventListenerArray.pop(callback);
        }
    },

    /**
    * Triggers an event to the ones who are interested in.
    */
    trigger: function(event, args) {
        var eventListenerArray = this._eventListeners[event] || [];

        for (var i = 0; i < eventListenerArray.length; i++) {
            var callback = eventListenerArray[i];
            callback.apply(this, args);
        }
    }
});
