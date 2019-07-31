import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Camera, CameraOptions } from "@ionic-native/camera"; //import in app.module.ts
import { ImagePicker } from "@ionic-native/image-picker"; //image picker
import { Geolocation } from "@ionic-native/geolocation"; // geolocation
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { SignUpPage } from "../pages/sign-up/sign-up";
import { FeedPage } from "../pages/feed/feed";
import { SlideshowModule } from "ng-simple-slideshow";
//import { EmojiPickerModule } from '@ionic-tools/emoji-picker';

import firebase from "firebase";
import { ReceiverPage } from "../pages/receiver/receiver";
import { FaceidPage } from "../pages/faceid/faceid";
import { SearchresultsPage } from "../pages/searchresults/searchresults";
import { IndHisPage } from "../pages/ind-his/ind-his";

// var config = {
//     apiKey: "AIzaSyADjIbI3_GRS4eRHGVGFsT2hrkKvH9K06M",
//     authDomain: "trialapp-1cb3d.firebaseapp.com",
//     databaseURL: "https://trialapp-1cb3d.firebaseio.com",
//     projectId: "trialapp-1cb3d",
//     storageBucket: "trialapp-1cb3d.appspot.com",
//     messagingSenderId: "591467524421"
//   };

// dev-liquid-star
const config = {
  apiKey: "AIzaSyCGwOOzxlKmaW1aoOUh6w5rlvLS3wi7fO8",
  authDomain: "dev-liquid-star.firebaseapp.com",
  databaseURL: "https://dev-liquid-star.firebaseio.com",
  projectId: "dev-liquid-star",
  storageBucket: "dev-liquid-star.appspot.com",
  messagingSenderId: "710243209058",
  appId: "1:710243209058:web:9498c9eacde6ac5f"
};

// var config = {
//   apiKey: "AIzaSyDBlHvhFw8AjkX9ccgM_nTxcFF73o9H5b4",
//   authDomain: "liquid-star-mobile-onboard.firebaseapp.com",
//   databaseURL: "https://liquid-star-mobile-onboard.firebaseio.com",
//   projectId: "liquid-star-mobile-onboard",
//   storageBucket: "liquid-star-mobile-onboard.appspot.com",
//   messagingSenderId: "455491584209",
//   appId: "1:455491584209:web:e619159f4ce57acd"
// };

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    FeedPage,
    ReceiverPage,
    FaceidPage,
    SearchresultsPage,
    IndHisPage
  ],
  imports: [
    BrowserModule,
    SlideshowModule,
    IonicModule.forRoot(MyApp)
    // EmojiPickerModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    FeedPage,
    ReceiverPage,
    FaceidPage,
    SearchresultsPage,
    IndHisPage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    Camera,
    ImagePicker,
    Geolocation,
    ScreenOrientation,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
