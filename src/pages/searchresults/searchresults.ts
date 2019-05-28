import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IndHisPage } from '../ind-his/ind-his';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchresultsPage');
  }

  searchResults(){

    this.navCtrl.push(SearchresultsPage);
     
   }

   personalResult(){
     this.navCtrl.push(IndHisPage);

   }

}
