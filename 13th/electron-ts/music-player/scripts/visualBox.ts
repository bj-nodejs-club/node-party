"use strict"


import { Player } from './player';

export class VisualBox {
    coverColors: number[][][] = [];
    coverYs: number[][] = [];
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera;
    pointclouds: THREE.Points[];
    raycaster: THREE.Raycaster;
    pcBuffer: THREE.Points;
    mouse = new THREE.Vector2();
    intersection: THREE.Intersection = null;
    spheres: THREE.Mesh[] = [];
    spheresIndex = 0;
    clock: THREE.Clock;
    threshold = 0.1;
    pointSize = 0.08;
    width = 128;
    length = 128;
    rotateY = new THREE.Matrix4().makeRotationY(0.005);
    player:Player;
    mode:VisualBoxMode = VisualBoxMode.Line;
    constructor(player:Player) {
        for (var i = 0; i < this.width; i++) {
            this.coverYs[i] = [];
            this.coverColors[i] = [];
            for (var j = 0; j < this.length; j++) {
                this.coverYs[i][j] = 0;
                this.coverColors[i][j] = [0.1,0.2,0.3];
            }
        }
        this.player = player;
        this.init();
        
    }

    set source(value: string) {
        var image = new Image();
        image.src = value;
        image.onload = () =>{
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.length;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0,image.width,image.height,0,0,128,128);
            this.coverColors.length = 0;
            for (var i = 0; i < this.width; i++) {
                var line: number[][] = [];
                this.coverColors.push(line)
                for (var j = 0; j < this.length; j++) {
                    var color = ctx.getImageData(i, j, 1, 1).data;
                    line[j] = [color[0] / 255, color[1] / 255, color[2] / 255];
                }
            }
        }
    }

    private init() {

        this.init3D();
        this.animate();
    }

    private init3D() {

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

        window.addEventListener('resize', ()=>this.onWindowResize(), false);

    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    private animate() {
        requestAnimationFrame(()=>this.animate());
        this.render();
    }

    private toggle = 0;
    private render() {
        this.camera.applyMatrix(this.rotateY);
        this.camera.updateMatrixWorld(false);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.coverYs = this.player.getFrequencyData();
        this.generatePointcloud(this.width, this.length);
        var intersections = this.raycaster.intersectObjects(this.pointclouds);
        this.intersection = (intersections.length) > 0 ? intersections[0] : null;

        this.toggle += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    }

    private generatePointCloudGeometry(width: number, length: number) {
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
                if(this.mode==VisualBoxMode.Line){
                    y = this.coverYs[i][j] / 4;// 0.05;// ( Math.cos( u * Math.PI * 8 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
                }
                else{
                    var dx = j - width / 2,
                        dy = i - length /2;
                    var a = Math.atan2(dy,dx)+Math.PI;
                    var d = Math.sqrt(dx*dx+dy*dy) / (Math.sqrt(65*65*2));
                    d = Math.max(d,0.01);
                    var dindex = Math.round(d*128);
                    a = Math.round(a/Math.PI/2*127);
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
    }

    private generatePointcloud(width: number, length: number) {
        var geometry = this.generatePointCloudGeometry(width, length);
        if (!this.pcBuffer) {
            var material = new THREE.PointsMaterial({ size: this.pointSize, vertexColors: THREE.VertexColors });
            this.pcBuffer = new THREE.Points(geometry, material);
        }
        else {
            this.pcBuffer.geometry = geometry;
        }
        return this.pcBuffer;
    }
    
    public toggleMode(){
        this.mode = this.mode == VisualBoxMode.Circle?VisualBoxMode.Line:VisualBoxMode.Circle;
    }
}

export enum VisualBoxMode {
    Cover,
    Line,
    Circle
}