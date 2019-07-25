## Pre-requisites

Some requirements are highly recommended to follow this article, the most important are the following:

- Fundamental knowledge of Javascript
- Knowledge of HTML and CSS or SASS
- A basic understanding of how Ionic works (Setting up the environment, understanding the structure, ...)
- A familiarization of Phomo. Luckily, we wrote a step-by-step guide which can help having a grip on the tool, that you can find [here](https://blog.matchmore.io/phomo-a-phone-motion-simulator/).
- A lot of creativity: This blogpost will only show you how to create a basic app with Matchmore and Ionic. You can use it as a root to build more complete apps.

Before going further, we can question ourselves, **why do we need to build our app with Ionic?**

There is an old debate about the different approaches on how to build a mobile app. Some prefer using native tools while other people opt for a hybrid approaches. Ionic, which allows you to build your app using web technologies (HTML, CSS and JavaScript), offers you all the advantages you have while building a hybrid app. It allows you to deploy your single code based on all the platforms with minor changes and provides you with a set of tools to build your app with the UI component used in native apps.

![img](https://blog.matchmore.io/content/images/2019/01/Screenshot-2019-01-21-at-14.59.41.png)

Source: [Cleveroad](https://www.cleveroad.com/blog/native-or-hybrid-app-development-what-to-choose)

As a drawback, hybrid apps may have access to all the native devices features like the GPS, accelerometer, touchID, etc... but you need to set up additional plugins. For some apps, performance might not be the same as native apps.

## App overview

The app that we are going to create should meet the requirements below:

- It has to integrate the basics functionalities of [Matchmore's SDK](https://docs.matchmore.io/)
- It has to be easy (and fun) to develop

In order to make it simple and make it work on all the platforms (Android and iOS), we will use Ionic for the app and our phone simulator Phomo on the backend.

In our example, let's assume that we are creating an app for a hotel chain. Our app will be linked to their internal room management system and should show the available rooms and the prices of these rooms when a customer enters a particular area.

We can imagine creating a simple geofencing app which can be used by the hotel chain. By using the app, clients can easily get to the nearest hotel matching their search criteria. The hotel chains will be able to reach a wider audience and offer deals and attractive prices based on the client's loyalty, their proximity and/or based on the occupancy rates of their hotels.

The room details will be entered and broadcasted through Phomo. The data entered in Phomo will in turn be available on the user's phone through a basic app. Let's start!

## Setting up the tools

Before we start creating our app, we have to make sure that we have installed Ionic on our computer and created an account on [Matchmore](https://matchmore.io/account/register/?__hstc=155224932.0643babe560725db18790e5358cdcd91.1519631029521.1561493971718.1561745119822.54&__hssc=155224932.2.1561745119822&__hsfp=2589687283).

For our client app, we have to follow the steps below:

- Install [Node](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm)
- Create a new project using your terminal:

```
ionic start Geofencing blank --type=angular
```

Here, `Geofencing` is the name of the project, `blank` is the starter template, and the project type is `angular`.

Since we will use Phomo as an admin panel, we have to log in to the Matchmore's website or [create a new account](https://matchmore.io/account/register/?__hstc=155224932.0643babe560725db18790e5358cdcd91.1519631029521.1561493971718.1561745119822.54&__hssc=155224932.2.1561745119822&__hsfp=2589687283). Phomo requires a minimal configuration and its goal is to be used with the highest simplicity.

## Backend with Phomo

On the admin side, we only have to identify all the hotels in the city and setup the geofences around them. To do that, we have to create a new app and a new scenario, define the pinpoint devices (which will represent the hotels on a map), and create a publication filled by the specificities of the hotels.

Let's assume that we are responsible of three hotels with a capacity of 300 rooms in the city of Lausanne, Switzerland. Let's create our geofencing campaign to broadcast the number of the available rooms. In order to do it, we have to follow the steps below:

- Select an app.
- Select your scenario.

In the Device's tab, you have to click on Add a device.

On the map, you have to place your hotels. By default, tag the device as a pinpoint without any mobility model. Then click on Add to see the device on the map.

Now, click on the Publication's tab. Add a publication by clicking on the appropriate button and associate it with the first device. We can use "nearby_hotel" as topic, the range should be around the hotel, let us fix it as 200m and let us set the advertising duration to one month (2,592,000 seconds). We will add all the details of the hotels in the properties. It can be, for example, the name of the hotel, the address, the number of available rooms by type of rooms (single, double, suites etc.) and a short description.

Repeat the same steps for the two other hotels. After filling all the fields, your scenario should look like this:

```Javascript
{
  "scenario": [
    {
      "device": {
        "name": "Hotel1",
        "location": {
          "latitude": 46.529124733539525,
          "longitude": 6.608489490172361,
          "altitude": 0
        },
        "deviceType": "PinDevice",
        "id": "b0db893f-27e4-4854-bdbb-71051ab86c56",
        "createdAt": 1548945161681,
        "mobilityModel": {
          "internalId": "10993a0b-fb65-f49e-fd4c-e2848e104431",
          "type": "static",
          "name": "Not move",
          "location": {
            "latitude": 46.529124733539525,
            "longitude": 6.608489490172361,
            "altitude": 0
          }
        }
      },
      "pubs": [
        {
          "duration": 2592000,
          "id": "3f672c66-cb74-4b75-a6a7-faf0605f3e3b",
          "properties": {
            "suite_rooms": 2,
            "hotel_name": "Cocoa Hotel",
            "single_rooms": 128,
            "double_rooms": 5,
            "address": "Avenue de la confrérie 16, Lausanne"
          },
          "range": 200,
          "createdAt": 1548945416066,
          "topic": "nearby_hotel",
          "deviceId": "b0db893f-27e4-4854-bdbb-71051ab86c56",
          "device": {
            "name": "Hotel1",
            "location": {
              "latitude": 46.529124733539525,
              "longitude": 6.608489490172361,
              "altitude": 0
            },
            "deviceType": "PinDevice",
            "id": "b0db893f-27e4-4854-bdbb-71051ab86c56",
            "createdAt": 1548945161681,
            "mobilityModel": {
              "internalId": "10993a0b-fb65-f49e-fd4c-e2848e104431",
              "type": "static",
              "name": "Not move",
              "location": {
                "latitude": 46.529124733539525,
                "longitude": 6.608489490172361,
                "altitude": 0
              }
            }
          }
        }
      ],
      "subs": []
    },
    {
      "device": {
        "name": "Hotel2",
        "location": {
          "latitude": 46.533937119105715,
          "longitude": 6.634753680846189,
          "altitude": 0
        },
        "deviceType": "PinDevice",
        "id": "957f2096-840f-4204-82c1-94e0cc69a19b",
        "createdAt": 1548945172208,
        "mobilityModel": {
          "internalId": "0e9244e0-3c55-6416-a18b-77a6f5144bbe",
          "type": "static",
          "name": "Not move",
          "location": {
            "latitude": 46.533937119105715,
            "longitude": 6.634753680846189,
            "altitude": 0
          }
        }
      },
      "pubs": [
        {
          "duration": 2592000,
          "id": "26f18c3e-2dd6-48d0-b329-2eed2af2c3a6",
          "properties": {
            "suite_rooms": 2,
            "hotel_name": "Nautica",
            "single_rooms": 72,
            "double_rooms": 35,
            "address": "Route du Pavement 55, Lausanne"
          },
          "range": 200,
          "createdAt": 1548945556657,
          "topic": "nearby_hotel",
          "deviceId": "957f2096-840f-4204-82c1-94e0cc69a19b",
          "device": {
            "name": "Hotel2",
            "location": {
              "latitude": 46.533937119105715,
              "longitude": 6.634753680846189,
              "altitude": 0
            },
            "deviceType": "PinDevice",
            "id": "957f2096-840f-4204-82c1-94e0cc69a19b",
            "createdAt": 1548945172208,
            "mobilityModel": {
              "internalId": "0e9244e0-3c55-6416-a18b-77a6f5144bbe",
              "type": "static",
              "name": "Not move",
              "location": {
                "latitude": 46.533937119105715,
                "longitude": 6.634753680846189,
                "altitude": 0
              }
            }
          }
        }
      ],
      "subs": []
    },
    {
      "device": {
        "name": "Hotel3",
        "location": {
          "latitude": 46.51666369293213,
          "longitude": 6.6517481571645485,
          "altitude": 0
        },
        "deviceType": "PinDevice",
        "id": "996fb6bd-fee6-451b-9251-9aab2cadfedb",
        "createdAt": 1548945183057,
        "mobilityModel": {
          "internalId": "16d24146-9864-f96f-5c22-b9acfb211e93",
          "type": "static",
          "name": "Not move",
          "location": {
            "latitude": 46.51666369293213,
            "longitude": 6.6517481571645485,
            "altitude": 0
          }
        }
      },
      "pubs": [
        {
          "duration": 2592000,
          "id": "e41bf8be-799f-4f63-b0a1-857ec64af0fb",
          "properties": {
            "suite_rooms": 0,
            "hotel_name": "Hotel Camayenne",
            "single_rooms": 300,
            "double_rooms": 61,
            "address": "Chemin du Levant 100, Lausanne"
          },
          "range": 200,
          "createdAt": 1548945692042,
          "topic": "nearby_hotel",
          "deviceId": "996fb6bd-fee6-451b-9251-9aab2cadfedb",
          "device": {
            "name": "Hotel3",
            "location": {
              "latitude": 46.51666369293213,
              "longitude": 6.6517481571645485,
              "altitude": 0
            },
            "deviceType": "PinDevice",
            "id": "996fb6bd-fee6-451b-9251-9aab2cadfedb",
            "createdAt": 1548945183057,
            "mobilityModel": {
              "internalId": "16d24146-9864-f96f-5c22-b9acfb211e93",
              "type": "static",
              "name": "Not move",
              "location": {
                "latitude": 46.51666369293213,
                "longitude": 6.6517481571645485,
                "altitude": 0
              }
            }
          }
        }
      ],
      "subs": []
    }
  ],
  "models": []
}
```

Feel free to upload the above scenario on your dashboard ;-)

## Client's app (with Ionic)

The app installed on the client's device will only do a subscription on the topic `nearby_hotel` with the criteria that the client is going to define. A subscription zone will be set around the client. There will be a match when the subscription zone (of the client) overlaps with the one of the hotels which has the same criteria mentioned by the client.

In order to create our app, we first need to import the Matchmore's script by downloading it [here](https://github.com/matchmore/js-sdk/blob/master/dist/web/matchmore.js) and adding it to our assets (under `src/assets/js`). Once it's done, we can start creating our app.

Our app will intensively use the geolocation service. To get our real time location, we need to add the cordova geolocation plugin. To do it, open your terminal and type the following commands:

```Shell
ionic cordova plugin add cordova-plugin-geolocation
npm install @ionic-native/geolocation
```

Now we have to get our API Key on the Matchmore portal by following the process below:
![create-app-1](https://blog.matchmore.io/content/images/2019/06/create-app-1.gif)
Once we get our API Key, we can manually import the Matchmore's Manager script by adding this line on top of our file:

```Javascript
import {Manager} from '../../assets/js/matchmore.js'
```

In our page, we can add a function used to initialize Matchmore. We will set it up with only one line:

```Javascript
this.matchmore = new Manager(this.ApiKey)
```

Then the next steps will be to register our device as a mobile device, create a subscription and get the matches.
We will create our device by using the script below:

```Javascript
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
```

> In the Matchmore environment, we have 3 different types of devices: Mobile, Pin and iBeacon devices. A **pin device** is one that has geographical location associated with it but is not represented by any object in the physical world; usually its location doesn't change frequently if at all. A **mobile device** is the one that potentially moves together with its user and therefore has a geographical location assosciated with it. A mobile device is typically a location-aware smartphone, which knows its location thanks to a GPS or to some other means like cell tower triangulation, etc. An **iBeacon device**represents an Apple conform iBeacon announcing its presence via Bluetooth LE advertising packets which can be detected by a other mobile device. It doesn't necessarily have any location associated with it but it serves to detect and announce its proximity to other mobile devices.

After setting up our device, we can create a subscription with the same topic as the publication. The magic of Matchmore is the ease in filtering the results that we want. In our case, we can filter the result by number of single rooms available for example in a range of 500 meters. To apply a filter in our subscription, we can use a selector which uses SQL like syntax to define which publication will match with this subscription.

By default, we can set the duration of our subscription to 30 minutes (1,800 seconds). We can create the subscription with only few lines of codes:

```Javascript
this.matchmore.createSubscription("nearby_hotel", 500, 1800, "single_rooms > 1").then ((sub) => {
      console.log("subscription created successfully" + JSON.stringify(sub)) 
    })
```

That's it! We can already see the matches on Phomo when at least one of the publications and a subscription overlaps.

To have an event on our mobile devices, we can pool the matches by using a method that will be called every time there is a match. In order to do it, we can start by turning our device into monitoring mode:

```Javascript
this.matchmore.startMonitoringMatches()
```

Now we will trigger an action every time there is a match:

```Javascript
this.matchmore.onMatch = (m) => {
var hotel_name = m.publication.properties.hotel_name
this.log("There's a match with "+hotel_name)
}
```

> The Matches that we received are encoded into a JSON format and can be easily parsed.

## Go further...

We have reached the end of this blogpost. Now, you can create your own basic geofencing campaign with Matchmore and Ionic. To make what you learned more useful, feel free to think about some other scenarios. For example, think about a system that could be integrated to the hotel's ERP and which will automatically broadcast the number of available rooms every time there's a change in the system. I will give you a hint. Explore our [documentation](https://docs.matchmore.io/) and learn more about our RESTful API which can allows you to make customized queries. The other option can be to build a module and integrate it to the hotel's ERP by using one of our [SDKs](https://github.com/matchmore).

I hope you enjoyed this blogpost, feel free to download the [code source](https://blog.matchmore.io/set-in-your-geofencing-campaign-with-ionic-and-phomo/#) of the project and to send me an [email](mailto:alpha.diallo@matchmore.com) if you have any question.
