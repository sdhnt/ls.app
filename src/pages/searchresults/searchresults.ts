import { Component, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { IndHisPage } from "../ind-his/ind-his";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { ReceiverPage } from "../receiver/receiver";
import { LoginPage } from "../login/login";
import firebase from "firebase";
/**
 * Generated class for the SearchresultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var require: any;
@IonicPage()
@Component({
  selector: "page-searchresults",
  templateUrl: "searchresults.html"
})
export class SearchresultsPage {
  uid;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public toastCtrl: ToastController,
    private zone: NgZone
  ) {
    this.uid = navParams.get("docid");
  }

  confidence: any;
  isIdentical: any;
  imageface_url: any;
  temp: any;

  ionViewDidLoad() {
    console.log("ionViewDidLoad SearchresultsPage");
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
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.toastCtrl
          .create({
            message: "You have been logged out",
            duration: 3000
          })
          .present();
        this.navCtrl.setRoot(LoginPage);
      });
  }

  nextpg() {
    if (this.isIdentical == "true") {
      this.navCtrl.push(ReceiverPage);
    } else {
      this.toastCtrl
        .create({
          message: "No Match yet! Please try again!",
          duration: 1000
        })
        .present();
    }
  }

  mfaceID1: any;
  mfaceID2: any;

  public takePhoto(taken: Function = null, notTaken: Function = null): void {
    this.camera.getPicture(this.options).then(
      base64Image => {
        // For the sake of displaying our image, we have to add a
        // data type to our base64 encoding. We'll snip this out later
        // when retrieving a link from Imgur.
        this.imageface = "data:image/png;base64," + base64Image;

        if (taken != null) taken(base64Image);

        this.toastCtrl
          .create({
            message: "Please wait while we complete Face ID!",
            duration: 5000
          })
          .present();

        this.zone.run(() => {
          this.temp = "Pic taken";
        });

        this.upload_new_face(this.uid);
      },
      e => {
        if (notTaken != null) notTaken(e);
      }
    );
  }
  flag = 0;

  upload_new_face(name: string) {
    return new Promise((resolve, reject) => {
      let ref = firebase.storage().ref("rentalImages/" + name + "face");
      let uploadTask = ref.putString(this.imageface.split(",")[1], "base64");

      this.zone.run(() => {
        this.temp = "Uploading to server...";
      });

      uploadTask.then(snap => {
        snap.ref.getDownloadURL().then(url => {
          // do something with url here
          this.zone.run(() => {
            this.imageface_url = url;
            this.temp = "URL updated! Checking Face ID...";
            this.uploadFaces();
          });
        });
        //return ref.getDownloadURL()
      });

      // uploadTask.snapshot.ref.getDownloadURL().then(function(url){
      //   //

      //   this.zone.run(() => {
      //     this.temp = " no_url"
      //   });

      //   this.zone.run(() => {
      //     this.imageface_url=url;
      //   });

      //   this.zone.run(() => {
      //     this.temp = " new_url"
      //   });

      //   this.uploadFaces();

      // }).catch((err)=>{
      //   reject
      // })

      // uploadTask.on("state_changed", function(taskSnapshot){
      //   //console.log(taskSnapshot);
      //   this.zone.run(() => {
      //     this.temp = "Uploaded"
      //   });
      // }, function(err){
      //   //console.log(err);
      //   this.zone.run(() => {
      //     this.temp = "Uploaded"
      //   });
      // }, function(){
      //   //console.log("Upload Complete");
      //   this.zone.run(() => {
      //     this.temp = "Uploaded"
      //   });
      //   this.zone.run(() => {
      //     this.temp = "Uploaded"
      //   });

      // })
    });
  }

  url2;
  public uploadFaces() {
    var request = require("request");
    //console.log("wodup");

    const subscriptionKey = "b62d45685ba64c539152b9a8896c26aa";

    var uriBase =
      "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    const imageUrl1 = this.imageface_url;
    //'https://firebasestorage.googleapis.com/v0/b/trialapp-1cb3d.appspot.com/o/rentalImages%2F527158face?alt=media&token=42cfc27d-63c3-466a-89b1-5928e6a6cf93'

    var params = {
      returnFaceId: "true",
      returnFaceLandmarks: "false",
      returnFaceAttributes:
        "age,gender,headPose,smile,facialHair,glasses," +
        "emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    var options = {
      uri: uriBase,
      qs: params,
      //mode:'no-cors',
      body: '{"url": ' + '"' + imageUrl1 + '"}',
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:8100/",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    };

    request.post(options, (error, response, body) => {
      if (error) {
        console.log("Error: ", error);
        return;
      } else {
        let jsonResponse = JSON.parse(body);
        console.log("JSON Response\n");
        console.log(jsonResponse.length);

        if (jsonResponse.length > 0) {
          this.flag = 2; //FACE detected in first image
          this.mfaceID1 = jsonResponse[0].faceId; // SAVED
          console.log("JSON Response\n");
          console.log(this.mfaceID1); //SHOWN

          this.zone.run(() => {
            this.temp = "Set FID1...";
          });
          // Now we retrieve URL 2 & post
          var Ref = firebase
            .firestore()
            .collection("lscr")
            .doc(this.uid);
          Ref.get().then(doc => {
            this.zone.run(() => {
              this.temp = "Fetching URL...";
            });
            console.log(doc.data().imageface_url);
            this.url2 = String(doc.data().imageface_url);

            this.zone.run(() => {
              this.temp = "Downloading From Database";
              const imageUrl2 = this.url2;
            });

            // PICTURE 2 retrievedONWARDS

            var options = {
              uri: uriBase,
              qs: params,
              //mode:'no-cors',
              body: '{"url": ' + '"' + this.url2 + '"}',
              headers: {
                "Access-Control-Allow-Origin": "http://localhost:8100/",
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey
              }
            };
            // POST PICTURE 2 to Azure and get ID
            request.post(options, (error, response, body) => {
              if (error) {
                console.log("Error: ", error);
                return;
              } else {
                let jsonResponse = JSON.parse(body);
                // console.log('JSON Response\n');
                // console.log(jsonResponse);
                if (jsonResponse.length > 0) {
                  this.mfaceID2 = jsonResponse[0].faceId;
                  console.log("JSON Response\n");
                  console.log(this.mfaceID2);

                  ///////////VERIFY FACE
                  uriBase =
                    "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify";

                  var params1 = {};

                  this.sleep(1000);

                  const options2 = {
                    uri: uriBase,
                    qs: params1,
                    body:
                      '{"faceId1": ' +
                      '"' +
                      String(this.mfaceID1) +
                      '", "faceId2": "' +
                      String(this.mfaceID2) +
                      '"}',
                    //body: '{"faceId1": ' + '"' + "c924e1af-272b-46c4-a4e1-61b3dd7535bc" + '", "faceId2": "'+ "2e5cdffb-0933-4ee7-a436-26f428fbf211" +'"}',

                    //{"faceId1": "this.mfaceID", "faceId2: "this.mfaceID2"

                    headers: {
                      "Access-Control-Allow-Origin": "http://localhost:8100/",
                      "Content-Type": "application/json",
                      "Ocp-Apim-Subscription-Key": subscriptionKey
                    }
                  };

                  request.post(options2, (error, response, body) => {
                    if (error) {
                      console.log("Error: ", error);
                      return;
                    }
                    let jsonResponse = JSON.parse(body);
                    console.log("JSON Response\n");
                    console.log(jsonResponse);

                    this.zone.run(() => {
                      this.temp = "Recieving FaceID confirmation";

                      this.isIdentical = String(jsonResponse.isIdentical);
                      this.confidence = String(jsonResponse.confidence);
                    });

                    //console.log(this.isIdentical);
                  });
                }
              }
            });
          });
        } else {
          this.zone.run(() => {
            this.flag = 1;
          });
        }
      }
    });
  }
}
