import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { IndHisPage } from '../ind-his/ind-his';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReceiverPage } from '../receiver/receiver';
import { LoginPage } from '../login/login';
import firebase from 'firebase';

/**
 * Generated class for the SearchresultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchresults',
  templateUrl: 'searchresults.html',
})
export class SearchresultsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchresultsPage');
  }

  searchResults(){

    this.navCtrl.push(SearchresultsPage);
     
   }
    imageface: any;
   personalResult(){
     this.navCtrl.push(IndHisPage);

   }

   private options:CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 600,
    targetHeight: 600,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: 1,
    correctOrientation: true,
    cameraDirection: 1
    
};

public sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


logout(){

  firebase.auth().signOut().then(()=>{
    this.toastCtrl.create({
      message: "You have been logged out",
      duration: 3000
    }).present()
    this.navCtrl.setRoot(LoginPage);
  });

}

nextpg(){
  if(this.imageface!=null){
  this.navCtrl.push(ReceiverPage);
  }
  else{
    this.toastCtrl.create({
      message: "No FaceID Match yet!",
      duration: 1000
    }).present()
  }
}

   public takePhoto(taken:Function = null, notTaken:Function = null):void {
    this.camera.getPicture(this.options).then((base64Image) => {
          // For the sake of displaying our image, we have to add a
          // data type to our base64 encoding. We'll snip this out later
          // when retrieving a link from Imgur.
          this.imageface="data:image/png;base64," + base64Image;

          if (taken != null) taken(base64Image);

          this.toastCtrl.create({
            message: "Face Match!",
            duration: 3000
          }).present()

          
    }, (e) => {
          if (notTaken != null) notTaken(e);
    });
}

}
