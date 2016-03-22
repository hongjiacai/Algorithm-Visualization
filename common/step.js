function Step() {
    this.steps = [];
    this.count = 0;
    this.now = 0;
    this.init = function () {
        this.count = 0;
        this.now = 0;
    };
    this.addStep = function () {
        for (var i = 0; i < arguments.length; i++)
            this.steps[this.count++] = arguments[i];
    };
}