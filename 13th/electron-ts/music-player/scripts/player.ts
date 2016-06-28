declare var ID3;

export class Player {
    private audioTag: HTMLAudioElement;
    private imageUrl: string;
    private coverYs: number[][] = [];

    private context = new AudioContext();
    private analyser: AnalyserNode;
    private frequencyData = new Uint8Array(128);
    constructor() {
        for (var i = 0; i < 128; i++) {
            this.coverYs[i] = [];
            for (var j = 0; j < 128; j++) {
                this.coverYs[i][j] = 1;
            }
        }
        var audioElement = document.getElementById("player") as HTMLAudioElement;
        audioElement.addEventListener("canplay", () => {
            var source = this.context.createMediaElementSource(audioElement);
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);
            this.analyser.connect(this.context.destination);
        });
        this.audioTag = audioElement;
    }

    setSource(filePath: string, callback: (imageUrl: string) => void) {
        this.audioTag.src = filePath;
        callback( "images/cover.png");
    }

    getFrequencyData() {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            var ys: number[] = [];
            for (var i = 0; i < 128; i++) {
                ys[i] = this.frequencyData[i] / 255;
            }

            this.coverYs.unshift(ys);
            this.coverYs.length = 128;
        }
        return this.coverYs;
    }
}