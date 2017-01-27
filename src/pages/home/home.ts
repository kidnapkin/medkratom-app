import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { InAppBrowser, Network } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular'
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  show: boolean;
  noConnection: boolean;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
      this.load();
  }

  load() {
    this.show = true;
    this.noConnection = false;
    if (Network.type === 'none') {
        this.show = false;
        this.showAlert();
        this.noConnection = true;
    } else {
      let browser = new InAppBrowser('https://medkratom.com', '_blank', 'location=no,hidden=yes');

      browser.on("loadstart")
        .subscribe(
        () => {
            this.show = false;
        },
        err => {
            console.log("InAppBrowser Load Event Error: " + err);
        });

      browser.on("loadstop")
        .subscribe(
        () => {
            this.show = false;
            browser.show();
        },
        err => {
            console.log("InAppBrowser Load Event Error: " + err);
        });

      browser.on("loaderror")
        .subscribe(
        () => {
          this.show = false;
          browser.close();
          this.load();
        },
        err => {
          console.log("InAppBrowser Loadstop Event Error: " + err);
        });

      browser.on("exit")
        .subscribe(
          () => {
             this.show = false;
             if (Network.type !== 'none') {
              this.noConnection = false;
             }
           },
           err => {
             alert("InAppBrowser exit Event Error: " + err);
       });
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'No internet!',
      subTitle: 'Connect to the internet and pull to refresh',
      buttons: ['OK']
    });
    alert.present();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.load();
      refresher.complete();
    }, 2000);
  }

}
