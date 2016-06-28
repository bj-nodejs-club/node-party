"use strict";
var Player = (function () {
    function Player() {
        var _this = this;
        this.coverYs = [];
        this.context = new AudioContext();
        this.frequencyData = new Uint8Array(128);
        for (var i = 0; i < 128; i++) {
            this.coverYs[i] = [];
            for (var j = 0; j < 128; j++) {
                this.coverYs[i][j] = 1;
            }
        }
        var audioElement = document.getElementById("player");
        audioElement.addEventListener("canplay", function () {
            var source = _this.context.createMediaElementSource(audioElement);
            _this.analyser = _this.context.createAnalyser();
            _this.analyser.fftSize = 256;
            source.connect(_this.analyser);
            _this.analyser.connect(_this.context.destination);
        });
        this.audioTag = audioElement;
    }
    Player.prototype.setSource = function (filePath, callback) {
        this.audioTag.src = filePath;
        callback("images/cover.png");
    };
    Player.prototype.getFrequencyData = function () {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            var ys = [];
            for (var i = 0; i < 128; i++) {
                ys[i] = this.frequencyData[i] / 255;
            }
            this.coverYs.unshift(ys);
            this.coverYs.length = 128;
        }
        return this.coverYs;
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map