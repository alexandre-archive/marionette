Leap.Controller.plugin('threejsPosition', function() {
    var convert, handPosition;

    /*
        Convert LeapJS space to ThreeJS space.

        @param value: x or y axis.
        @param base: screen width (x) or height (y) size.
        @param d: scale factor to increase leap motion area (default: 2).

        @return the new space position.
    */
    convert = function(value, base, d) {
        var oldMax = base,
            oldMin = 0,
            newMax = base / (d || 2),
            newMin = base / -(d || 2);

        var oldRange = (oldMax - oldMin),
            newRange = (newMax - newMin);

        return (((value - oldMin) * newRange) / oldRange) + newMin;
    };

    convertDegree = function(value) {
        var oldMax = 180,
            oldMin = -80,
            newMax = 360,
            newMin = 0;

        var oldRange = (oldMax - oldMin),
            newRange = (newMax - newMin);

        return (((value - oldMin) * newRange) / oldRange) + newMin;
    };

    handPosition = function(x, y, z) {
        this.x = x; // X axis.
        this.y = y; // Y axis.
        this.z = z; // Z axis.
    };

    return {
        hand: {
            get3JsScreenPosition: function () {
                var p = this.screenPosition(),
                    w = window.innerWidth,
                    h = window.innerHeight;

                var x = convert(p[0], w, 5),
                    y = convert(p[1] * -1, h),
                    z = p[2];

                return new handPosition(x, y, z);
            },

            get3JsPitchDegree: function () {
                return convertDegree(this.pitchDegree());
            },

            get3JsRollDegree: function () {
                return convertDegree(this.rollDegree());
            }
        }
    };
});
