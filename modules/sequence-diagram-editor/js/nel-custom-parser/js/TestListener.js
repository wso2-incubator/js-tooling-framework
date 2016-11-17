var Listener = customRequire('../generated-parser/NELListener');

function TestListener() {
    Listener.NELListener.call(this); // inherit default listener
    return this;
}

TestListener.prototype = Object.create(Listener.NELListener.prototype);
TestListener.prototype.constructor = TestListener;

TestListener.prototype.enterScript = function(ctx) {
    console.log("enterScript");
};

exports.TestListener = TestListener;