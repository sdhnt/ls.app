import { Component } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { SignUpPage } from "../sign-up/sign-up";
import firebase from "firebase";
import { FeedPage } from "../feed/feed";
import { ReceiverPage } from "../receiver/receiver";
import { Injectable } from "@angular/core";
import { ResonanceAudio } from "resonance-audio";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
@Injectable()
export class LoginPage {
  // TODO remove credentials
  email: string = "tsk.nakamura@gmail.com";
  password: string = "password";
  len: number = 0.0;
  breadth: number = 0.0;
  height: number = 0.0;

  alen: number = 10.0;
  abreadth: number = 10.0;
  aheight: number = 10.0;

  rad = 5;
  angle = 0;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {}

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  rotpos() {
    var rad = 5;
    var angle = 0;
    while (angle! > 360) {
      this.breadth = rad * Math.sin((angle * 3.1415) / 180);
      this.len = rad * Math.cos((angle * 3.1415) / 180);
      angle = angle + 1;
      this.delay(10);
    }
  }

  generateAudio() {
    let audioContext = new AudioContext();

    // Create a (first-order Ambisonic) Resonance Audio scene and pass it
    // the AudioContext.
    let resonanceAudioScene = new ResonanceAudio(audioContext);

    resonanceAudioScene.output.connect(audioContext.destination);
    let roomDimensions = {
      width: this.abreadth,
      height: this.alen,
      depth: this.aheight
    };

    let roomMaterials = {
      // Room wall materials
      left: "transparent",
      right: "transparent",
      front: "transparent",
      back: "transparent",
      // Room floor
      down: "transparent",
      // Room ceiling
      up: "transparent"
    };

    resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);

    let audioElement = document.createElement("audio");

    // Load an audio file into the AudioElement.
    audioElement.src = "../../assets/ping.mp3";

    let audioElementSource = audioContext.createMediaElementSource(
      audioElement
    );

    // Add the MediaElementSource to the scene as an audio input source.
    let source = resonanceAudioScene.createSource();
    audioElementSource.connect(source.input);

    // Set the source position relative to the room center (source default position).
    source.setPosition(this.len, this.breadth, this.height);

    // Play the audio.
    audioElement.play();

    this.breadth = this.rad * Math.sin((this.angle * 3.1415) / 180);
    this.len = this.rad * Math.cos((this.angle * 3.1415) / 180);
    this.angle = this.angle + 90;

    if (this.angle <= 360) {
      this.generateAudio();
      this.delay(250);
    } else {
      this.angle = 0;
    }
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        console.log(user);
        this.toastCtrl
          .create({
            message: "Welcome " + user.user.displayName,
            duration: 3000
          })
          .present();

        if (user.user.displayName == "TaxiDriver") {
          this.navCtrl.setRoot(ReceiverPage);
        } else {
          this.navCtrl.setRoot(FeedPage);
        }
      })
      .catch(err => {
        console.log(err);
        this.toastCtrl
          .create({
            message: err.message,
            duration: 3000
          })
          .present();
      });
  }

  gotoSignUp() {
    this.navCtrl.push(SignUpPage);
  }
}
