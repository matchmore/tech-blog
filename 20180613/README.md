# Everything you need to know about beacons
# What is it ?
Beacons are wireless devices that help indoor and outdoor positioning. Since 2013, they are becoming more and more common and are now supported by the two dominant mobile operating systems, namely Android and iOS.

Beacons are wireless devices that continuously broadcast an advertising packet over Bluetooth. This advertising packet is composed of letters and numbers describing the beacons; in addition, other informations like manufacturer data or received signal strength indication (RSSI) are available. Other devices can receive the packet, thus helping to estimate their proximity to the transmitting beacon. All those informations help developers to implement indoor location, although beacons can be used outside as well.

Beacons use the Bluetooth Low Energy (BLE) technology to transmit data over short distances. The design of BLE is intended to provide low energy consumption, thus allowing the beacon’s battery to last longer than the original Bluetooth technology. The battery duration of BLE goes between 2 to 3 years [^1].

# Different brands
The iBeacon is the standard defined by Apple [^2]. There is also other beacons standard like Eddystone by Google [^3] or AltBeacons by Kontakt.io [^4]. Basically, the content of the advertising packet could vary slightly from one standard to another, but the communication protocol (Bluetooth) remains the same. As a consequence, most beacons on the market support at least the Eddystone standard and the iBeacon standard.

## Difference between Eddystone and iBeacon
In the end user's perspective, there is nothing really compelling to discuss about. The little difference, that appears between both standards, does not create a big significance. The distinction that does exist between them is rather on their functionalities.

As noted, both protocols work with iOS and Android devices. There is no issue of incompatibility involved with beacon transmissions to Android and iOS smart devices. So, from the perspective of end users, developers don't need to be worried about the difference in Eddystone and iBeacon. Matchmore supports all beacons conform to Eddystone and Apple's standard, iBeacon.

# How does it work ? 
## Advertising packet
Advertising packet is the message that beacons transmit continuously announcing their presence to nearby devices. The advertising packet could be slightly different depending on the beacon standards. Generally, advertising packets contain at least a universally unique identifier (UUID), major and minor. For example, Eddystone’s advertising packet can contain URL and also telemetry data like what temperature the Eddystone’s beacon is detecting. But in the end, all of them transmit the basic information which are:
* A UUID is a 16 bytes, usually represented as a string.
* A Major is a 2 bytes number from 1 to 65,535.
* A Minor, same as major.
* Received signal strength indication (RSSI) indicating the signal strength on meter from the device, keep in mind that it is more an estimation than an exact distance.

One could use UUID to distinguish beacons in one’s network, from all other beacons in networks outside of his control. Major and minor could be considered as a supplement layer to identify beacons with greater accuracy than using UUID alone.
Note that a beacon only transmits the advertising packet, no descriptive information are carried by a beacon. If one wants to deploy beacons for commercial use, it requires an external source to provide descriptive informations associated to the beacons.

## Beacons detection
The beacon's detection in Android devices is different from iOS devices. Mobile applications have different states, when the app is running in foreground both iOS and Android's detection are smooth and nice. While running app in background mode stays smooth for iOS developers, this is not the case for Android developers.

### Android Issues
On Android, you don’t have the same low level of integration offered by iOS ; if you want to implement a complex feature involving beacons, you have to dig harder with the Bluetooth APIs, or use another library. Fortunately, there are some very good, mature libraries to handle monitoring and ranging on Android.

This difference is very much felt at the introduction of the new version of Android 8.0 (Oreo). With Oreo, you are not allowed to run long background tasks anymore. Since running beacons is very interesting in background mode, this creates an important Android limitation to be aware of.

With this limitation, Google have restricted application's features running in background to raise and help the battery life. It means that your beacon scanner may not run effectively as you'd like in background.

If you are developing with beacons on Android, keep in mind that foreground monitoring is reliable and you will get 100% of the beacons detection. On the other hand, background monitoring can be used but you may miss some beacons some time to time.

### Smartphones and beacons
Smartphones interact with beacons in two different ways, ranging and monitoring. 

#### Ranging
Ranging is used to determine approximate distance to a device generating iBeacon’s conform advertisements. Applications ranging beacons are able to locate themselves based on advertising packets. Only applications that are currently alive on foreground or background can range beacons.

Every seconds the smartphone refreshes the list of detected beacons. All informations about the detected beacons are available, UUID, major, minor and relative proximity between detecting smartphone and detected beacon. About relative proximity, iBeacon standard rely on four constants to describe the distance between them and the detecting devices. Relative proximity to an iBeacon are categorized as:
* Immediate - the detecting device is virtually touching the beacon, distance between detecting device and beacon is defined to be between: 0 meter ≤ d < 0.5 meter.
* Near - when detecting device is virtually in the same room, distance between detecting device and beacon is defined to be between: 0.5 meter ≤ d < 3 meters.
* Far - the detecting device can hear the beacon but is pretty far, distance between detecting device and beacon is defined to be between: 3 meters ≤ d < 50 meters.
* Unknown - the detecting device cannot determine the RSSI, we define the distance between detecting device and beacon to be between: 50 meters ≤ d < 200 meters.


![Figure 1, ranging beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/beaconRanging.png "beacons ranging")
Figure 1. Two different cases of beacon ranging.

#### Monitoring
When one is particularly interested in knowing if users enter or leave a specific area, this is called geofencing. Monitoring beacons is very similar to geofencing. The device is constantly monitoring, therefore even if the application is killed, or application is not in foreground or background mode, monitoring never stops.

Whenever the device enter or exit a defined region, the application is launched or reactivated and generates appropriate events in relation to the crossed region. In beacons case, a region boundaries is defined by the detection of Bluetooth beacons advertising packet. When one wants to monitor with beacons, one has to define which beacons are included in a region.
* One beacon defines a region:
– a beacon triples (UUID, major and minor).
* Subset of beacons define a region: 
– UUID and major,
– only the UUID.

For example, imagine two beacons having equal UUID but different major and minor attributes. If an application monitors a beacon region by using only this UUID, the region boundaries are defined by the two beacons advertising packet. In other words, the application will generate appropriate events for the defined region no matter which one of the two beacon’s advertising packet it detects. Important to know that the application can not differentiate which one of the two beacon was detected.

On the other hand, if you monitor a beacon region by using all values of an iBeacon; The triples (UUID, major and minor). The region boundaries are defined by your uniquely beacon which is broadcasting those triples attributes. Note, nothing stops developers from setting two or more beacons with the exact same triples attributes.

Apple limits applications to 20 monitored regions, but we can easily pass this limit by using a single UUID to monitor a subset for multiple beacons. An application monitoring a region with only the UUID, no major, no minor provided, cannot access other attributes from advertising packet. The application knows only that it detected a beacon broadcasting the UUID defined for this region. If one wants to know more informations about beacons, one has to use ranging. Monitoring is only used for enter/exit events.


![Figure 2, monitoring beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/beaconMonitoring.png "beacons monitoring") Figure 2. Beacons monitoring.


# And with Matchmore ?
There is two advantages to use beacons with Matchmore.

First, the publication's properties allow you to attach meaningful informations with your beacons.

Second, you are able to work with pin points on a macro-level scale (meters to kilometers) and beacons on a micro-level scale (centimeters to meters); combine both scales and outdoor-indoor service at once in a unique integrated cloud Backend-as-a-Service.

## Start using beacons with Matchmore
First you need to register the beacons in your account on Matchmore.
Go to your [account dashboard](https://matchmore.io/account/) by connecting on Matchmore's portal.

When you are logged in, click on "Beacons" in the user menu.

![Go to beacons view](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/3.png "beacons")

Register all the beacons you plan to use.

![Register your beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/4.png "registration")

Then, you can start assign your beacons in your app.

![Assign your beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/5.png "assignation")

Your beacons are ready to be used with Matchmore, you can now use the generated device ID to publish or subscribe on your beacons.

That's how easy it is !

### Two ways to publish on the beacons
Let's assume that you are developing an application for a museum. 
You want to create mobile notifications based on a visitor’s proximity to an object.

And you have the beacon with Major `53494` and Minor `28090` placed near your famous piece of art painted by Van Gogh in June 1889.

There is many ways to publish on the beacons, but here we present two of them.
- Via our portal without any lines of code
- HTTP request with Curl

**Note: you can also publish on your beacons via our SDKs.**

#### On the portal (No code needed)
When you are logged-in, after you have registered all your beacons and assigned them to your application.

1. Check which beacon corresponds to the Major `53494` and Minor `28090`.
2. Click on `tools` in the menu bar, 
3. and then on `Create a Publication`.

![Create a publication, go to view](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/6.png "create a publication go to view")

It brings you to the page where you can create publication in your app without coding anything.

1. Choose the application for which you want to publish
2. Choose the device. The beacon corresponding to the Major `53494` and Minor `28090` is our namely, `Beetroot`.
3. Set the topic, it could be `museum-beacon`.
4. Choose the range, as we want people to be very close to the Van Gogh before receiving a notification, we set 3 meters.
5. We have set 86400 seconds which correspond to a month duration.
6. Set the properties, that is metadata attached to our beacon.
7. Press `Publish`, to publish your publication.

![Create a publication, example](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/7.png "create a publication")

#### HTTP request with Curl
Here is another way to publish on your beacons.
You are going to use HTTP request with Curl.

First, you need to access and get the device ID of the beacon on which you want to publish. 
You can access all the available beacons in an app by calling the following GET request:

`https://api.matchmore.io/v5/devices/IBeaconTriples`

Here is an example with Curl:

```json
curl -X GET \
http://api.matchmore.io/v5/devices/IBeaconTriples \
-H 'api-key: eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiYmM1Y2EwNTgtZGQ4Yi00ZWZmLWFkMjYtZjg4MmI4OTZiNzMzIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MTU0MjQwMTYsImlhdCI6MTUxNTQyNDAxNiwianRpIjoiMSJ9.m6tVQ8oqWTe8Ne0M0rdZVhwprdEmoSZoP7wg5zM97rlo_n4c_Mks2Cqj4mZsvqM6mczJBm6wtydNnCQvqCZ1Ig' \
-H 'content-type: application/json' \
```

The returned result will be a Json describing all the available beacons in the given api-key app:

```json
[
{
"deviceId": "38143334-1f0d-4d62-a5a0-67c2b8cd6a53",
"proximityUUID": "b9407f30-f5f8-466e-4393-25556b57fe6d",
"major": 1000,
"minor": 40050
},
{
"deviceId": "fb705200-13fc-4491-b20f-ce58db97ade8",
"proximityUUID": "b9407f30-f5f8-466e-aff9-25556b57fe6d",
"major": 53494,
"minor": 28090
},
{
"deviceId": "a2eea8e6-ffc4-467e-ad65-68d01da8d309",
"proximityUUID": "b9407f30-f5f8-466e-aff9-25556b57fe6d",
"major": 203,
"minor": 1230
}
]
```

With the known device ID, you are able to start publishing or subscribing from your beacons.

You are looking for the beacon with Major `53494` and Minor `28090` placed near your famous piece of art painted by Van Gogh in June 1889.

Use the device ID which is `fb705200-13fc-4491-b20f-ce58db97ade8`.

Set your publication with Curl:

Provide the significant information in the `properties`.
```json
curl -X POST \
http://api.matchmore.io/v5/devices \
-H 'api-key: eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiYmM1Y2EwNTgtZGQ4Yi00ZWZmLWFkMjYtZjg4MmI4OTZiNzMzIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MTU0MjQwMTYsImlhdCI6MTUxNTQyNDAxNiwianRpIjoiMSJ9.m6tVQ8oqWTe8Ne0M0rdZVhwprdEmoSZoP7wg5zM97rlo_n4c_Mks2Cqj4mZsvqM6mczJBm6wtydNnCQvqCZ1Ig' \
-H 'content-type: application/json' \
-d '{
"deviceId": "fb705200-13fc-4491-b20f-ce58db97ade8",
"worldId": "bc5ca058-dd8b-4eff-ad26-f882b896b733",
"topic": "museum-beacon",
"range": 3,
"duration": 86400,
"properties": {
"painter": "Vincent Willem van Gogh",
"movement": "Post-Impressionism",
"name": "The Starry Night"
}
}'
```

### You have the publication on the beacon and now what ?

So, for a subscriber on topic `museum-beacon` to pass near by the beacon (below 3 meters relative distance), will receive a match. This match can trigger pre-implemented feature and this match provide useful information based on the properties you have set before. When you know which beacons the end user has been near you can notify him with relevant contents ; *for example, display a page with The Starry Night painting information, because the end user is near the "Beetroot" beacon*.

That would be a good exercise for you:
- Set a subscription on topic `museum-beacon` on a mobile device
- Get the match
- Implement a feature

This is already the end of this blog post. After reading this post and following these instruction, you will most likely be able to call yourself a beacon ninja! 

[^1]: ibeaconinsider, (2017) What is ibeacon? a guide to beacons. (Online) Available at: [http://www. ibeacon.com/what-is-ibeacon-a-guide-to-beacons/](http://www.ibeacon.com/what-is-ibeacon-a-guide-to-beacons/) (Accessed on 11-06-2018).

[^2]: Apple, (06 2014) Getting started with ibeacon. (Online) Available at: [https://developer.apple.com/ibeacon/Getting-Started-with-iBeacon.pdf](https://developer.apple.com/ibeacon/Getting-Started-with-iBeacon.pdf) (Accessed on 04-06-2018).

[^3]: Estimote, (2017) What is eddystone? (Online) Available at: [http://developer.estimote.com/eddystone/](http://developer.estimote.com/eddystone/) (Accessed on 04-06-2018).

[^4]: kontakt.io, (2017) What is a beacon? (Online) Available at: [https://kontakt.io/beacon-basics/what-is-a-beacon/](https://kontakt.io/beacon-basics/what-is-a-beacon/) (Accessed on 11-06-2018).
