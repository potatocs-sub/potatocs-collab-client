import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-camera-dialog',
    standalone: true,
    imports: [],
    templateUrl: './camera-dialog.component.html',
    styleUrl: './camera-dialog.component.scss'
})
export class CameraDialogComponent {
    @ViewChild('video') video: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

    constructor() { }

    ngOnInit() {
        this.startCamera();
    }


    startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream;
            this.video.nativeElement.play();
        });
    }

    captureFrame() {
        const context = this.canvas.nativeElement.getContext('2d');
        context.drawImage(this.video.nativeElement, 0, 0, 640, 480);
        const frame = this.canvas.nativeElement.toDataURL('image/jpeg');
        // Send the frame to the server
        this.sendFrameToServer(frame);
    }

    sendFrameToServer(frame: string) {
        // Implement the logic to send the frame to the server
        // For example, using HttpClient to POST the frame to a server endpoint
    }
}