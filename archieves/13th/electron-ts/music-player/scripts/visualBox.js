"use strict";
var VisualBox = (function () {
    function VisualBox(player) {
        this.coverColors = [];
        this.coverYs = [];
        this.mouse = new THREE.Vector2();
        this.intersection = null;
        this.spheres = [];
        this.spheresIndex = 0;
        this.threshold = 0.1;
        this.pointSize = 0.08;
        this.width = 128;
        this.length = 128;
        this.rotateY = new THREE.Matrix4().makeRotationY(0.005);
        this.mode = VisualBoxMode.Line;
        this.toggle = 0;
        for (var i = 0; i < this.width; i++) {
            this.coverYs[i] = [];
            this.coverColors[i] = [];
            for (var j = 0; j < this.length; j++) {
                this.coverYs[i][j] = 0;
                this.coverColors[i][j] = [0.1, 0.2, 0.3];
            }
        }
        this.player = player;
        this.init();
    }
    Object.defineProperty(VisualBox.prototype, "source", {
        set: function (value) {
            var _this = this;
            var image = new Image();
            image.src = value;
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = _this.width;
                canvas.height = _this.length;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 128, 128);
                _this.coverColors.length = 0;
                for (var i = 0; i < _this.width; i++) {
                    var line = [];
                    _this.coverColors.push(line);
                    for (var j = 0; j < _this.length; j++) {
                        var color = ctx.getImageData(i, j, 1, 1).data;
                        line[j] = [color[0] / 255, color[1] / 255, color[2] / 255];
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    VisualBox.prototype.init = function () {
        this.init3D();
        this.animate();
    };
    VisualBox.prototype.init3D = function () {
        var _this = this;
        var container = document.getElementById('visualBox');
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 20));
        this.camera.applyMatrix(new THREE.Matrix4().makeRotationX(-0.7));
        //
        this.pcBuffer = this.generatePointcloud(this.width, this.length);
        this.pcBuffer.scale.set(20, 20, 20);
        this.pcBuffer.position.set(0, 0, 0);
        this.scene.add(this.pcBuffer);
        this.pointclouds = [this.pcBuffer];
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        var size = container.getBoundingClientRect();
        this.renderer.setSize(size.width, size.height);
        container.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Points.threshold = this.threshold;
        window.addEventListener('resize', function () { return _this.onWindowResize(); }, false);
    };
    VisualBox.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    VisualBox.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
        this.render();
    };
    VisualBox.prototype.render = function () {
        this.camera.applyMatrix(this.rotateY);
        this.camera.updateMatrixWorld(false);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.coverYs = this.player.getFrequencyData();
        this.generatePointcloud(this.width, this.length);
        var intersections = this.raycaster.intersectObjects(this.pointclouds);
        this.intersection = (intersections.length) > 0 ? intersections[0] : null;
        this.toggle += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    };
    VisualBox.prototype.generatePointCloudGeometry = function (width, length) {
        var geometry = new THREE.BufferGeometry();
        var numPoints = width * length;
        var positions = new Float32Array(numPoints * 3);
        var colors = new Float32Array(numPoints * 3);
        var k = 0;
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < length; j++) {
                var u = i / width;
                var v = j / length;
                var x = u - 0.5;
                var y = 0;
                if (this.mode == VisualBoxMode.Line) {
                    y = this.coverYs[i][j] / 4; // 0.05;// ( Math.cos( u * Math.PI * 8 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
                }
                else {
                    var dx = j - width / 2, dy = i - length / 2;
                    var a = Math.atan2(dy, dx) + Math.PI;
                    var d = Math.sqrt(dx * dx + dy * dy) / (Math.sqrt(65 * 65 * 2));
                    d = Math.max(d, 0.01);
                    var dindex = Math.round(d * 128);
                    a = Math.round(a / Math.PI / 2 * 127);
                    y = this.coverYs[dindex][a] / 4;
                }
                var z = v - 0.5;
                positions[3 * k] = x;
                positions[3 * k + 1] = y;
                positions[3 * k + 2] = z;
                var intensity = (y + 0.1) * 5;
                colors[3 * k] = this.coverColors[i][j][0] * intensity;
                colors[3 * k + 1] = this.coverColors[i][j][1] * intensity;
                colors[3 * k + 2] = this.coverColors[i][j][2] * intensity;
                k++;
            }
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeBoundingBox();
        return geometry;
    };
    VisualBox.prototype.generatePointcloud = function (width, length) {
        var geometry = this.generatePointCloudGeometry(width, length);
        if (!this.pcBuffer) {
            var material = new THREE.PointsMaterial({ size: this.pointSize, vertexColors: THREE.VertexColors });
            this.pcBuffer = new THREE.Points(geometry, material);
        }
        else {
            this.pcBuffer.geometry = geometry;
        }
        return this.pcBuffer;
    };
    VisualBox.prototype.toggleMode = function () {
        this.mode = this.mode == VisualBoxMode.Circle ? VisualBoxMode.Line : VisualBoxMode.Circle;
    };
    return VisualBox;
}());
exports.VisualBox = VisualBox;
(function (VisualBoxMode) {
    VisualBoxMode[VisualBoxMode["Cover"] = 0] = "Cover";
    VisualBoxMode[VisualBoxMode["Line"] = 1] = "Line";
    VisualBoxMode[VisualBoxMode["Circle"] = 2] = "Circle";
})(exports.VisualBoxMode || (exports.VisualBoxMode = {}));
var VisualBoxMode = exports.VisualBoxMode;
//# sourceMappingURL=visualBox.js.map