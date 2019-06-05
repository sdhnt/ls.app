import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { IndHisPage } from '../ind-his/ind-his';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoginPage } from '../login/login';
import firebase from 'firebase';
import { FeedPage } from '../feed/feed';
//import { ScreenOrientation } from '@ionic-native/screen-orientation';

// import { Geolocation } from '@ionic-native/geolocation'; // geolocation


/**
 * Generated class for the ReceiverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receiver',
  templateUrl: 'receiver.html',
})
export class ReceiverPage {
  retrieved_images: string[] = [];
  TIMEOUT_INTERVAL:number = 1000 * 10 ;
  all_locations: any;
  today: string = new Date().toISOString(); // minimum date = current date
  startDate: string = new Date().toISOString();
  min_end_date: string = this.startDate;
  maxDate: string = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()).toISOString(); // max date = 3 months from today

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public toastCtrl: ToastController) {
  }

  

    // Set up all locations from DB
  //   async get_all_locations(){
  //     const snapshot = await firebase.firestore().collection('locations').get()
  //     let value = snapshot.docs.map(doc => doc.data());
  //     value.forEach((val) => {
  //       val.latitude = val.point.latitude;
  //       val.longitude = val.point.longitude;
  //     });
  //     this.all_locations = value;
  //     console.log(this.all_locations);
      
  //  }
  
   

  // // ionViewDidLoad() {
  // //   console.log('ionViewDidLoad ReceiverPage');
  // // }

  // getlocation_wrapper(){
  //   let options = {
  //     enableHighAccuracy: true,
  //   timeout: 5000,
  //     maximumAge: 0
  //   };
  //   return new Promise((res,rej) => {
  //     navigator.geolocation.getCurrentPosition(res,rej,options);
  //   });
  // }


  // // TODO - Receive permission

  // getlocation(){
  //   let me = this;
  //   console.log("here 0");
    
  //   this.getlocation_wrapper().then((resp:any)=>{
  //     // console.log(typeof this.all_locations[0].point);
  //     let latitude = resp.coords.latitude;
  //     let longitude = resp.coords.longitude;
  //     let result: any;
  //     result = geolib.findNearest({ latitude: latitude, longitude: longitude }, this.all_locations);
  //     console.log("Closest to:");        
  //     console.log(this.all_locations[result.key]);
  //     console.log("here 1")
  //     let current_time = new Date();
  //     let current_location =  (this.all_locations[result.key]).value;
  //     firebase.firestore().collection('file_data').where('location', '==', current_location).get().then(function (result) {
  //       console.log("here 2")
  //       let value = result.docs.map((doc) => { return { data: doc.data(), id: doc.id } });
  //       console.log("here 3")
  //       // console.log("values:");
  //       value = value.filter((val)=>{        
  //         return (new Date(val.data.startDate) < current_time) && (current_time < new Date(val.data.endDate) );
  //       })
  //       let temp_images = [];
  //       // me.retrieved_images = [];
  //       console.log("here 4")
  //       value.forEach((val:any) => {
  //         // console.log(val.id);        
  //         // console.log(val.data.location);
  //         // console.log(val.data.startDate);
  //         console.log(val.data.image_url);
  //         temp_images.push(val.data.image_url);        
  //         // me.download(val.id);
          
  //       })
  //       me.retrieved_images = temp_images;
  
  //       // me.slideshow()
        
  //     })
  //     // let value = snapshot.docs.map(doc => doc.data());
  //     // value.forEach((val) => {
  //     //   val.latitude = val.point.latitude;
  //     //   val.longitude = val.point.longitude;
  //     // });
  //     // this.all_locations = value;
      
  //   })   
  // }

  // subscribe_location() {
  //   this.getlocation();
  //   setInterval(() => {
  //     this.getlocation()
  //   }, this.TIMEOUT_INTERVAL);
  // }

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
imageface: any;
nextpg(){
  if(this.imageface!=null){
  
  this.toastCtrl.create({
    message: "Rental Confirmed!",
    duration: 3000
  }).present()
  this.navCtrl.push(FeedPage);
  }
  else{
    this.toastCtrl.create({
      message: "No QRCode Scan yet!",
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
            message: "QR Code Scanned!",
            duration: 3000
          }).present()

          
    }, (e) => {
          if (notTaken != null) notTaken(e);
    });
}

}



