import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment, { duration } from 'moment';
import { isDifferent } from '@angular/core/src/render3/util';
import { LoginPage } from '../login/login';
import { ReceiverPage } from '../receiver/receiver'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Geolocation } from '@ionic-native/geolocation';
import geolib from 'geolib';
import { resolve } from 'url';
import { log } from 'util';
import { P } from '@angular/core/src/render3';
import { SlideshowComponent } from 'ng-simple-slideshow/src/app/modules/slideshow/slideshow.component';
import { IndHisPage } from '../ind-his/ind-his';

/**
 * Generated class for the FaceidPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-faceid',
  templateUrl: 'faceid.html',
})
export class FaceidPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, private camera: Camera, private imagePicker: ImagePicker, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaceidPage');
  }

  text: string="";
 
  image: string; 

  name: string="";
  phnum: number;
  location: string="";
  imageface: any;
  imageID:any;
  imageJob: any;
  imgID: any;
  jobID: any;
  currentelec: string="";
  usefor: string="";
  dailysped: number;
  usebatt: string="";

  viewprofile(){
      this.navCtrl.push(IndHisPage);

  }
 

  
public error:string;
      // Global loading bool that indicates whether a photo is being analyzed
      public loading:boolean;

      // Array of key-value pairs for our analysis
      // Sample analysis data:
      // [ { "Feature": "Age", "Value": 25} ]
      public analysis:Array <object> = [];

      // Options for camera feature
      // Defaults to a selfie and takes square photos
      private options:CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 600,
            targetHeight: 600,
            saveToPhotoAlbum: false,
            allowEdit: true,
            sourceType: 1,
            correctOrientation: false,
            cameraDirection: 1
            
      };

      // Injectable providers go in the constructor
      

      // Perform our steps to facial analysis in asynchronous order
      // 1. Takes the photo
      // 2. Gets a photo link from imgur
      // 3. Analyzes face data from imgur link
      // If an error occurs in any of the steps, it is shown on the screen
      // and the asynchronous calls terminate.
      // public analyzeFace():void {
      //       this.error = null;
      //       this.takePhoto(
      //             // If photo was taken
      //             (photo) => {
      //                   this.image = photo;
      //                   this.loading = true;
      //                   this.sendToImgur(photo,
      //                         // If Imgur returned an image link
      //                         (link) => {
      //                               this.analyzeViaAzure(link,
      //                                     // If analysis worked
      //                                     (response) => {
      //                                           this.loading = false;
      //                                           this.analyzeFaceDetails(response);
      //                                     },
      //                                     // If analysis didn't work
      //                                     () => {
      //                                           this.loading = false;
      //                                           this.error = "Error: Azure couldn't analyze the photo.";
      //                                     }
      //                               )
      //                         },
      //                         // If Imgur didn't return an image link
      //                         () => {
      //                               this.error = "Error: Imgur couldn't return a link."
      //                         }
      //                   )
      //             },
      //             // If photo wasn't taken
      //             () => {
      //                   this.error = "Error: Phone couldn't take the photo.";
      //             }
      //       )
      // }

      // Takes a photo and returns it in a callback
      // taken: callback that returns the base64 image
      // notTaken: callback that returns the error
      public takePhotoFace(taken:Function = null, notTaken:Function = null):void {
            this.camera.getPicture(this.options).then((base64Image) => {
                  // For the sake of displaying our image, we have to add a
                  // data type to our base64 encoding. We'll snip this out later
                  // when retrieving a link from Imgur.
                  this.imageface="data:image/png;base64," + base64Image;

                  if (taken != null) taken(base64Image);
            }, (e) => {
                  if (notTaken != null) notTaken(e);
            });
      }

      public takePhotoID(taken:Function = null, notTaken:Function = null):void {
            this.camera.getPicture(this.options).then((base64Image) => {
                  // For the sake of displaying our image, we have to add a
                  // data type to our base64 encoding. We'll snip this out later
                  // when retrieving a link from Imgur.
                  this.imageID="data:image/png;base64," + base64Image;
                  if (taken != null) taken(base64Image);
            }, (e) => {
                  if (notTaken != null) notTaken(e);
            });
      }

      public takePhotoJob(taken:Function = null, notTaken:Function = null):void {
            this.camera.getPicture(this.options).then((base64Image) => {
                  // For the sake of displaying our image, we have to add a
                  // data type to our base64 encoding. We'll snip this out later
                  // when retrieving a link from Imgur.
                  this.imageJob="data:image/png;base64," + base64Image;
                  if (taken != null) taken(base64Image);
            }, (e) => {
                  if (notTaken != null) notTaken(e);
            });
      }

      // POSTs a photo to Imgur in exchange for a link to the image
      // image: base64 encoded image
      // urlCallback: callback that returns the link to the image
      // failureCallback: callback that returns errors
   

      logout(){

            firebase.auth().signOut().then(()=>{
              this.toastCtrl.create({
                message: "You have been logged out",
                duration: 3000
              }).present()
              this.navCtrl.setRoot(LoginPage);
            });
        
          } 

     


  addPhoto(){
    this.launchCamera();
    // this.launchGallery();
  }


  createRecord(){

      
        firebase.firestore().collection("lscr").add({
          // file_name: this.text,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          owner: firebase.auth().currentUser.uid,
          owner_name: firebase.auth().currentUser.displayName,
          location: this.location,
          onboard_name : this.name,
          ph_num: this.phnum,
          current_elec:this.currentelec,
          user_for:this.usefor,
          daily_spend:this.dailysped,
          use_bat:this.usebatt,
         
          //startDate: this.startDate,
         // endDate: this.endDate


        }).then(async (doc) => {
          //console.log(doc);

          this.toastCtrl.create({
            message: "Wait for Upload...",
            duration: 1000
          }).present();

          await this.upload_new_face(doc.id)
          await this.upload_new_ID(doc.id)
          await this.upload_new_job(doc.id)

          this.name="";
          this.location="" ;
          this.phnum=0;
          this.image="";
          this.imageID=null;
          this.imageJob=null;
          this.imageface=null;
          this.currentelec="";
          this.usefor="";
          this.dailysped=0;
          this.usebatt="";
                 this.toastCtrl.create({
               message: "Submitted!",
               duration: 3000
             }).present();

          
         
          
          })
      





       
  }



  launchGallery(){
    let options ={
      maximumImagesCount: 1,
      quality: 100,
      width: 512,
      height: 512,
      outputType: 1 // Base64
    }
    this.imagePicker.getPictures(options).then(function (results){
        this.image = "data:image/png;base64," + results[0];
  }, (err) => { console.log('Error') });
  }

launchCamera(){
  let options: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetHeight: 512,
    targetWidth: 512,
    allowEdit: true,
    // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }
  this.camera.getPicture(options).then((base64Image)=>{
    this.image = "data:image/png;base64," + base64Image;
    // console.log(base64Image)
  }).catch((err)=>{console.log(err)})
}

// OLD UPLOAD FUNCTION NOT SAVING URL IN DB
// upload(name: string){
//   let ref = firebase.storage().ref("postImages/" + name);
//   let uploadTask = ref.putString(this.image.split(',')[1], "base64");
//   uploadTask.on("state_changed", function(taskSnapshot){
//     console.log(taskSnapshot);
//   }, function(err){
//     console.log(err);
//   }, function(){
//     console.log("Upload Complete");
//     uploadTask.snapshot.ref.getDownloadURL().then(function(url){
//       console.log(url);  
//     })
    
//   })
// }

upload_new_face(name: string){
  return new Promise((resolve, reject) => {
  
    let ref = firebase.storage().ref("postImages/" + name + "face");
    let uploadTask = ref.putString(this.imageface.split(',')[1], "base64");
    uploadTask.on("state_changed", function(taskSnapshot){
      console.log(taskSnapshot);
    }, function(err){
      console.log(err);
    }, function(){
      console.log("Upload Complete");
      uploadTask.snapshot.ref.getDownloadURL().then(function(url){
        //console.log(url);  
        firebase.firestore().collection("lscr").doc(name).update({
          imageface_url: url
        }).then(()=>{
          resolve()
        }).catch((err)=>{
          reject
        })
      }).catch((err)=>{
        reject
      })
      
    })
  })
}

upload_new_ID(name: string){
      return new Promise((resolve, reject) => {
      
        let ref = firebase.storage().ref("postImages/" + name + "ID");
        let uploadTask = ref.putString(this.imageID.split(',')[1], "base64");
        uploadTask.on("state_changed", function(taskSnapshot){
          console.log(taskSnapshot);
        }, function(err){
          console.log(err);
        }, function(){
          console.log("Upload Complete");
          uploadTask.snapshot.ref.getDownloadURL().then(function(url){
            //console.log(url);  
            firebase.firestore().collection("lscr").doc(name).update({
              IDimg_url: url
            }).then(()=>{
              resolve()
            }).catch((err)=>{
              reject
            })
          }).catch((err)=>{
            reject
          })
          
        })
      })
    }

    upload_new_job(name: string){
      return new Promise((resolve, reject) => {
      
        let ref = firebase.storage().ref("postImages/" + name + "job") ;
        let uploadTask = ref.putString(this.imageJob.split(',')[1], "base64");
        uploadTask.on("state_changed", function(taskSnapshot){
          console.log(taskSnapshot);
        }, function(err){
          console.log(err);
        }, function(){
          console.log("Upload Complete");
          uploadTask.snapshot.ref.getDownloadURL().then(function(url){
            //console.log(url);  
            firebase.firestore().collection("lscr").doc(name).update({
              imagejob_url: url
            }).then(()=>{
              resolve()
            }).catch((err)=>{
              reject
            })
          }).catch((err)=>{
            reject
          })
          
        })
      })
    }


}
