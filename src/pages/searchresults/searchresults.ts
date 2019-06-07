import { Component, NgZone } from '@angular/core';
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
declare var require: any
@IonicPage()
@Component({
  selector: 'page-searchresults',
  templateUrl: 'searchresults.html',
})
export class SearchresultsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public toastCtrl: ToastController, private zone: NgZone) {
  }


  confidence: any;
  isIdentical: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchresultsPage');
  }


  searchResults() {

    this.navCtrl.push(SearchresultsPage);

  }
  imageface: any;
  personalResult() {
    this.navCtrl.push(IndHisPage);

  }

  private options: CameraOptions = {
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
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }


  logout() {

    firebase.auth().signOut().then(() => {
      this.toastCtrl.create({
        message: "You have been logged out",
        duration: 3000
      }).present()
      this.navCtrl.setRoot(LoginPage);
    });

  }

  nextpg() {
    //if (this.isIdentical == true) {
      this.navCtrl.push(ReceiverPage);
   // }
    // else {
    //   this.toastCtrl.create({
    //     message: "No Match yet! Please try again!",
    //     duration: 1000
    //   }).present()
    // }
  }

  mfaceID1: any;
  mfaceID2: any;

  public takePhoto(taken: Function = null, notTaken: Function = null): void {
    this.uploadFaces();
    this.camera.getPicture(this.options).then((base64Image) => {
      // For the sake of displaying our image, we have to add a
      // data type to our base64 encoding. We'll snip this out later
      // when retrieving a link from Imgur.
      this.imageface = "data:image/png;base64," + base64Image;



      if (taken != null) taken(base64Image);

      this.toastCtrl.create({
        message: "Face Match!",
        duration: 3000
      }).present()


    }, (e) => {
      if (notTaken != null) notTaken(e);
    });
  }
   flag = 0;


  public uploadFaces() {
    var request = require('request');
    console.log("wodup");

    
    const subscriptionKey = 'b62d45685ba64c539152b9a8896c26aa';

    var uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

    const imageUrl1 =
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c05962448.png";


    const imageUrl2 =
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80";

    var params = {
      'returnFaceId': 'true',
      'returnFaceLandmarks': 'false',
      'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };

    var options = {
      uri: uriBase,
      qs: params,
      //mode:'no-cors',
      body: '{"url": ' + '"' + imageUrl1 + '"}',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8100/',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    };

    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      } else {
        let jsonResponse = JSON.parse(body);
        console.log('JSON Response\n');
        console.log(jsonResponse.length);

        if (jsonResponse.length > 0) {
          this.mfaceID1 = jsonResponse[0].faceId;
          console.log('JSON Response\n');
          console.log(this.mfaceID1);
          var options = {
            uri: uriBase,
            qs: params,
            //mode:'no-cors',
            body: '{"url": ' + '"' + imageUrl2 + '"}',
            headers: {
              'Access-Control-Allow-Origin': 'http://localhost:8100/',
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': subscriptionKey
            }
          };

          request.post(options, (error, response, body) => {
            if (error) {
              console.log('Error: ', error);
              return;
            }
          
            else {
              let jsonResponse = JSON.parse(body);
              // console.log('JSON Response\n');
              // console.log(jsonResponse);
              if (jsonResponse.length > 0 && this.flag == 0) {
                this.mfaceID2 = jsonResponse[0].faceId;
                console.log('JSON Response\n');
                console.log(this.mfaceID2);






                ///////////VERIFY FACE
                uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify';

                var params1 = {

                };

                this.sleep(1000);

                const options2 = {
                  uri: uriBase,
                  qs: params1,
                  body: '{"faceId1": ' + '"' + String(this.mfaceID1) + '", "faceId2": "' + String(this.mfaceID2) + '"}',
                  //body: '{"faceId1": ' + '"' + "c924e1af-272b-46c4-a4e1-61b3dd7535bc" + '", "faceId2": "'+ "2e5cdffb-0933-4ee7-a436-26f428fbf211" +'"}',


                  //{"faceId1": "this.mfaceID", "faceId2: "this.mfaceID2"


                  headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:8100/',
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                  }
                };


                request.post(options2, (error, response, body) => {
                  if (error) {
                    console.log('Error: ', error);
                    return;
                  }
                  let jsonResponse = JSON.parse(body);
                  console.log('JSON Response\n');
                  console.log(jsonResponse);

                  this.zone.run(() => {
                    this.isIdentical = String(jsonResponse.isIdentical);
                    this.confidence = String(jsonResponse.confidence);
                  });


                  //console.log(this.isIdentical);
                });

              }
            }



          });





        }
        else{
          this.zone.run(() => {
            this.flag = 1;
          });
        }
      }



    });



  }


}
