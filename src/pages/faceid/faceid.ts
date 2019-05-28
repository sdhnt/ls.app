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
  imgID: any;
  jobID: any;
  currentelec: string="";
  usefor: string="";
  dailysped: number;
  usebatt: string="";

  viewprofile(){
      this.navCtrl.push(IndHisPage);

  }


 

  public IMGUR_ENDPOINT:string = "https://api.imgur.com/3/image";
// Imgur client ID
public IMGUR_CLIENT_ID:string = "e91c1fe8b52f178";

// Azure Face API endpoint (West-Central US Server)
// This is my endpoint. Please use your own for it to work.
public AZURE_ENDPOINT:string = "https://eastasia.api.cognitive.microsoft.com/face/v1.0";
// Azure Face API key
public AZURE_API_KEY:string = "95965f0d38542d1e77d9bf94f8be19ed833aa490";



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
            encodingType: this.camera.EncodingType.JPEG,
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
      public analyzeFace():void {
            this.error = null;
            this.takePhoto(
                  // If photo was taken
                  (photo) => {
                        this.image = photo;
                        this.loading = true;
                        this.sendToImgur(photo,
                              // If Imgur returned an image link
                              (link) => {
                                    this.analyzeViaAzure(link,
                                          // If analysis worked
                                          (response) => {
                                                this.loading = false;
                                                this.analyzeFaceDetails(response);
                                          },
                                          // If analysis didn't work
                                          () => {
                                                this.loading = false;
                                                this.error = "Error: Azure couldn't analyze the photo.";
                                          }
                                    )
                              },
                              // If Imgur didn't return an image link
                              () => {
                                    this.error = "Error: Imgur couldn't return a link."
                              }
                        )
                  },
                  // If photo wasn't taken
                  () => {
                        this.error = "Error: Phone couldn't take the photo.";
                  }
            )
      }

      // Takes a photo and returns it in a callback
      // taken: callback that returns the base64 image
      // notTaken: callback that returns the error
      public takePhoto(taken:Function = null, notTaken:Function = null):void {
            this.camera.getPicture(this.options).then((imageData) => {
                  // For the sake of displaying our image, we have to add a
                  // data type to our base64 encoding. We'll snip this out later
                  // when retrieving a link from Imgur.
                  this.imageface=imageData;
                  let base64Image:string = 'data:image/jpeg;base64,' + imageData;
                  if (taken != null) taken(base64Image);
            }, (e) => {
                  if (notTaken != null) notTaken(e);
            });
      }

      // POSTs a photo to Imgur in exchange for a link to the image
      // image: base64 encoded image
      // urlCallback: callback that returns the link to the image
      // failureCallback: callback that returns errors
      public sendToImgur(image:string, urlCallback:Function = null, failureCallback:Function = null):void {
            // Imgur requires that Base64 images be stripped of the
            // string 'data:image/...;base64,' so we snip it out here.
            image = image.substring(image.indexOf('base64,') + 'base64,'.length);

            // Imgur requires this string for authentication
            // It looks like: 'Client-ID XXXXXXXXXXXX' when sent
            let auth:string = `Client-ID ${this.IMGUR_CLIENT_ID}`;

            // Imgur wants an encoded form-data body
            // So we'll give it to them -> just append a key-value pair
            // with our 'snipped' base64 image.
            let body:FormData = new FormData();
            body.append('image', image);

            // Angular was very annoying in sending out a form-data request
            // using HttpModule (I spent 3 hours trying to solve it). But, instead, we
            // can send a request the old fashioned JavaScript way.

            // Create a POST request and authorize us via our auth variable from above
            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.IMGUR_ENDPOINT, true);
            xhr.setRequestHeader("Authorization", auth);

            // Once the request is sent, we check to see if it's successful
            xhr.onreadystatechange = () => {
                  if (xhr.readyState == XMLHttpRequest.DONE) {
                        // 200 is a successful status code, meaning it worked!
                        if (xhr.status == 200) {
                              // We can grab the link from our HTTP response and call it back
                              let link = JSON.parse(xhr.response)['data']['link'];
                              if (urlCallback != null && link != null) {
                                    urlCallback(link);
                              }
                        } else if (xhr.status >= 400 && failureCallback != null) {
                              // If we receive a bad request error, we'll send our failure callback.
                              failureCallback();
                        }
                  }
            }

            // This synchronously sends our form-data body.
            xhr.send(body);
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

      public analyzeViaAzure(link:string, analysisCallback:Function = null, failureCallback:Function = null):void {

            // This is a subfunction that converts an object into a serialized URL format.
            // For instance, { 'foo': 'bar' } becomes 'foo=bar'
            let serialize:any = (parameters:object) => Object.keys(parameters).map(key => key + '=' + parameters[key]).join('&');

            // Tell the server that we are querying/looking for a specific set of face data,
            // and want it in the appropriate format.
            let faceParameters:object = {
                  "returnFaceId": "true",
                  "returnFaceLandmarks": "false",
                  "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
            }

            // We use the above function, serialize, to serialize our face parameters.
            let serializedFaceParameters:string = serialize(faceParameters);

            // Our body contains just one key, 'url', that contains our image link.
            // We must convert our body JSON into a string in order to POST it.
            let body = JSON.stringify({ "url": link });

            // Create a POST request with the serialized face parameters in our endpoint
            // Our API key is stored in the 'Ocp-Apim-Subscription-Key' header
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.AZURE_ENDPOINT}/detect?${serializedFaceParameters}`, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Ocp-Apim-Subscription-Key", this.AZURE_API_KEY);

            // Once the request is sent, we check to see if it's successful
            xhr.onreadystatechange = () => {
                  if (xhr.readyState == XMLHttpRequest.DONE) {
                        // 200 is a successful status code, meaning it worked!
                        if (xhr.status == 200) {
                              // We can grab the link from our HTTP response and call it back
                              if (analysisCallback != null) {
                                    analysisCallback(JSON.parse(xhr.response));
                              }
                        } else if (xhr.status >= 400 && failureCallback != null) {
                              // If we receive a bad request error, we'll send our failure callback.
                              console.error(JSON.stringify(JSON.parse(xhr.response), null, 2));
                              failureCallback();
                        }
                  }
            }

            xhr.send(body);
      }

      // Populate the analysis array from a Face API response object
      public analyzeFaceDetails(response:object):void {
            // Clear analysis array.
            this.analysis = [];

            // Retrieved face attributes object from response.
            let attributes = response[0]['faceAttributes'];

            // Convert two strings into a key-value pair for our
            // analysis list.
            let getAnalysisObject:object = (feature, value) => {
                  return { "feature": feature, "value": value };
            }

            // Converts 'john' into 'John'
            let capitalizeFirstLetter:any = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

            //
            // ~ Analysis Time ~
            //

            // Get age
          
            this.analysis.push({"feature": "Age", "value": attributes['age']},)

            // Get age
            
            this.analysis.push({"feature": "Gender", "value": capitalizeFirstLetter(attributes['gender'])},)

            // Get smiling (person is smiling if value is over 0.5)
           
            this.analysis.push({"feature": "Smiling?", "value": (attributes['smile'] > 0.5 ? "Yes" : "No")},)

            // Check if bald, if so, output that.
            // If not, give the person's hair color.
            if (attributes['hair']['bald'] > 0.8) {
                  this.analysis.push({"feature": "Is Bald?", "value": "Yes"},);
            } else if (attributes['hair']['hairColor'] && attributes['hair']['hairColor'].length > 0) {
                  this.analysis.push({"feature": "Hair COlor?", "value": capitalizeFirstLetter(attributes['hair']['hairColor'][0]['color'])},);
            }

            // Get person's emotion by looping through emotion object and grabbing the greatest value
            let moods = attributes['emotion'];
            var greatestEmotion, greatestEmotionValue;
            for (var mood in moods) {
                  if (moods[mood] && (!greatestEmotion || moods[mood] > greatestEmotionValue)) {
                        greatestEmotion = mood;
                        greatestEmotionValue = moods[mood];
                  }
            }
        
            this.analysis.push({"feature": "Emotion", "value": capitalizeFirstLetter(greatestEmotion)},);

      }










  addPhoto(){
    this.launchCamera();
    // this.launchGallery();
  }


  createRecord(){

      // post()
      // {
      //   console.log(this.location);
        
      //   firebase.firestore().collection("file_data").add({
      //     // file_name: this.text,
      //     created: firebase.firestore.FieldValue.serverTimestamp(),
      //     owner: firebase.auth().currentUser.uid,
      //     owner_name: firebase.auth().currentUser.displayName,
      //     location: this.location,
      //     //startDate: this.startDate,
      //    // endDate: this.endDate
      //   }).then(async (doc) => {
      //     console.log(doc);
      //     await this.upload_new(doc.id)
      //     this.text="";
      //     this.location=null;
      //     this.image="";
      //     //this.startDate="";
      //     //this.endDate="";  
    
      //     let toast= this.toastCtrl.create({
      //       message: "Your image has been uploaded",
      //       duration: 3000
      //     }).present();
         
          
      //     })
      // }
       this.name="";
       this.location="" ;
       this.phnum=0;
       this.image="";
       this.imageface=null;
       this.currentelec="";
       this.usefor="";
       this.dailysped=0;
       this.usebatt="";
              this.toastCtrl.create({
            message: "Submitted!",
            duration: 3000
          }).present();
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

upload_new(name: string){
  return new Promise((resolve, reject) => {
  
    let ref = firebase.storage().ref("postImages/" + name);
    let uploadTask = ref.putString(this.image.split(',')[1], "base64");

    uploadTask.on("state_changed", function(taskSnapshot){
      console.log(taskSnapshot);
    }, function(err){
      console.log(err);
    }, function(){
      console.log("Upload Complete");
      uploadTask.snapshot.ref.getDownloadURL().then(function(url){
        console.log(url);  
        firebase.firestore().collection("file_data").doc(name).update({
          image_url: url
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
