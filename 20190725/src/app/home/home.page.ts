import { Component } from '@angular/core';
import { Manager } from '../../assets/js/matchmore.js';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  LogConf: String = ""
  matchmore:any
  location:any
  device:any

  //Get your API_KEY on matchmore.com
  ApiKey = "YOUR_API_KEY"

  constructor(private geolocation:Geolocation){}

  ngOnInit(){
    this.initMatchmore()
  }

//Log the actions
log(s:any){
  this.LogConf += s
  console.log (s)
}

  initMatchmore(){
    //Setup Matchmore
    this.matchmore = new Manager(this.ApiKey)
    this.log("Init Matchmore completed")
  }

createAnyDevice(){

  //Get current position of the user -> Check if the position is available
  this.geolocation.getCurrentPosition().then((resp) =>{
    this.location = resp.coords
    this.log("Coordinates " + resp.coords.latitude + ", "+ resp.coords.longitude)

  }).then(dvc => {
    //Creating a mobile device
    this.matchmore.createAnyDevice({
      deviceType: "MobileDevice",
      name: "Ionic-device",
      location: this.location,
      platform: "JS-SDK",
      deviceToken: ""
    }, (device =>{
      this.device = device
      this.log (JSON.stringify(device))
    })).then(t =>{
        this.log(this.matchmore.defaultDevice)
      }).then(t => {
        this.matchmore.startUpdatingLocation(1000)
        this.matchmore.onLocationUpdate = (loc) => {
          this.matchmore.updateLocation(this.location).then(t => {
            this.log("default device details" + JSON.stringify(this.matchmore.defaultDevice))
            this.log("Location Update "+JSON.stringify(loc))
          })
        }
      })
  })
}

  createSub(){
    
    this.matchmore.createSubscription("nearby_hotel", 500, 1800, "single_rooms > 1").then ((sub) => {
      this.log("subscription created successfully" + JSON.stringify(sub)) 
    })
  }

  colision(){
    //The first step is to create the user's device
    this.createAnyDevice()

    //Then we will create a Subscription for the user's device
    this.createSub()
    
    //Start waiting for the matches
    this.matchmore.startMonitoringMatches()

    //Event when there's a match
    this.matchmore.onMatch = (m) => 
    {
      //trigger an event when there's a match
      var hotel_name = m.publication.properties.hotel_name
      this.log("There's a match with "+hotel_name)
     
    }

  }

  
}
