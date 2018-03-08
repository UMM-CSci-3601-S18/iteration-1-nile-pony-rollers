import {Component} from '@angular/core';
import {TrackerListService} from "../trackers/tracker-list.service";
import {Tracker} from "../trackers/tracker";
import {MatDialog} from '@angular/material';
import {ResponseComponent} from "./response.component";
import {ResponseComponent2} from "./response-2.component";
import {ResponseComponent3} from "./response-3.component";
import {ResponseComponent5} from "./response-5.component";
import {ResponseComponent4} from "./response-4.component";

@Component({
    selector: 'app-home-list-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public slideIndex = 0;
    public emojis: string[] = ["./assets/grinning1.png", "./assets/slightly-smiling1.png", "./assets/neutral-face1.png",
        "./assets/Sad.png", "./assets/disappointed-face1.png"];

    public emojisString: string[] = ["Verry Happy", "Happy", "Normal", "Sad", "Very Sad"];
    public image = this.emojis[this.slideIndex];

    constructor(public trackerListService: TrackerListService, public dialog: MatDialog) {

    }

    public addEmotion(index: number): void {

        console.log(this.emojisString[index]);
        const newTracker: Tracker = {_id: '', emoji: this.emojisString[index], date: ''};
        this.trackerListService.addNewEmoji(newTracker).subscribe(
            trackers => {
            },
            err => {
                console.log(err);
            }
        );
    }

    public plusSlides(n: number): void{
        this.slideIndex = this.slideIndex + n;
        if(this.slideIndex == -1){
            this.slideIndex = 0;
        }
        if(this.slideIndex == this.emojis.length){
            this.slideIndex = this.emojis.length - 1;
        }
        console.log(this.slideIndex + ' index');
        console.log(this.image);
        this.image = this.emojis[this.slideIndex];
    }

    openDialog(n: number): void {
        console.log(n);
        if (n == 0){
            const dialogRef = this.dialog.open(ResponseComponent,{
                width: '800px',
                height: '750px'
            });
        }
        else if(n == 1){
            const dialogRef = this.dialog.open(ResponseComponent2,{
                width: '500px',
                height: '500px'
            });
        }

        else if(n == 2){
            const dialogRef = this.dialog.open(ResponseComponent3,{
                width: '500px',
                height: '500px'
            });
        }

        else if(n == 3){
            const dialogRef = this.dialog.open(ResponseComponent4,{
                width: '500px',
                height: '500px'
            });
        }

        else{
            const dialogRef = this.dialog.open(ResponseComponent5,{
                width: '500px',
                height: '500px'
            });
        }

    }
}
