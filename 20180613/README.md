# Everything you need to know about beacons
# What is it ?
Beacons are wireless devices that help indoor and outdoor positioning. Since 2013, they are becoming more and more common and are now supported by the two dominant mobile operating systems, namely Android and iOS.
Beacons are wireless devices that continuously broadcast an advertising packet over Bluetooth. This advertising packet is composed of letters and numbers describing the beacons; in addition, other informations like manufacturer data or received signal strength indication (RSSI) are available. Other devices can receive the packet, thus helping to estimate their proximity to the transmitting beacon. All those informations help developers to implement indoor location, although beacons can be used outside as well.
Beacons use the Bluetooth Low Energy (BLE) technology to transmit data over short distances. The design of BLE is intended to provide low energy consumption, thus allowing the beacon’s battery to last longer than the original Bluetooth technology. The battery duration of BLE goes between 2 to 3 years [1](#1).

# Different brands
The iBeacon is the standard defined by Apple [2](#2). There is also other beacons standard like Eddystone by Google [3](#3) or AltBeacons by Kontakt.io [4](#4). Basically, the content of the advertising packet could vary slightly from one standard to another, but the communication protocol (Bluetooth) remains the same. As a consequence, most beacons on the market support at least the Eddystone standard and the iBeacon standard.

## Difference between Eddystone and iBeacon
In the end user's perspective, there is nothing really compelling to discuss about. 
The little difference, that appears between both standards, does not create a big significance.
The distinction that does exist between them is rather on their functionalities.

As noted, both protocols work with iOS and Android devices. There is no issue of incompatibility involved with beacon transmissions to Android and iOS smart devices.

So, from the perspective of end users, developers don't need to be worried about the difference in Eddystone and iBeacon.

Matchmore supports all beacons conform to Eddystone and Apple's standard, iBeacon.

# How does it work ? 
## Advertising packet
Advertising packet is the message that beacons transmit continuously announcing their presence to nearby devices. The advertising packet could be slightly different depending on the beacon standards. Generally, advertising packets contain at least a universally unique identifier (UUID), major and minor. For example, Eddystone’s advertising packet can contain URL and also telemetry data like what temperature the Eddystone’s beacon is detecting. But in the end, all of them transmit the basic information which are:
• A UUID is a 16 bytes, usually represented as a string.
• A Major is a 2 bytes number from 1 to 65,535.
• A Minor, same as major.
• Received signal strength indication (RSSI) indicating the signal strength on meter from the device, keep in mind that it is more an estimation than an exact distance.
One could use UUID to distinguish beacons in one’s network, from all other beacons in networks outside of his control. Major and minor could be considered as a supplement layer to identify beacons with greater accuracy than using UUID alone.
Note that a beacon only transmits the advertising packet, no descriptive information are carried by a beacon. If one wants to deploy beacons for commercial use, it requires an external source to provide descriptive informations associated to the beacons.

## Beacons detection
The beacon's detection in Android devices is different from iOS devices. Mobile applications have different states, when the app is running in foreground both iOS and Android's detection are smooth and nice. While running app in background mode stays smooth for iOS developers, this is not the case for Android developers.

### Android Issues
On Android, you don’t have the same low level of integration offered by iOS ; if you want to implement a complex feature involving beacons, you have to dig harder with the Bluetooth APIs, or use another library. Fortunately, there are some very good, mature libraries to handle monitoring and ranging on Android.

This difference is very much felt at the introduction of the new version of Android 8.0 (Oreo). With Oreo, you are not allowed to run long background tasks anymore. It creates an important Android limitation to be aware of when running beacons. In the interests of battery consumption, Google have restricted the application's features running in background mode — which effectively means your beacon scanner may not run as frequently as you’d like.

If you are developing with beacons on Android, keep in mind that foreground monitoring is reliable and you will get 100% of the beacons detection. On the other hand, background monitoring can be used but you may miss some beacons some time to time.

### Smartphones and beacons
Smartphones interact with beacons in two different ways.

#### Ranging
Ranging is used to determine approximate distance to a device generating iBeacon’s conform advertisements. Applications ranging beacons are able to locate themselves based on advertising packets. Only applications that are currently alive on foreground or background can range beacons.
Every seconds the smartphone refreshes the list of detected beacons. All informations about the detected beacons are available, UUID, major, minor and relative proximity between detecting smartphone and detected beacon. About relative proximity, iBeacon standard rely on four constants to describe the distance between them and the detecting devices. Relative proximity to an iBeacon are categorized as:
• Immediate - the detecting device is virtually touching the beacon, distance between detecting device and beacon is defined to be between: 
0 meter ≤ d < 0.5 meter.
• Near - when detecting device is virtually in the same room, distance between detecting device and beacon is defined to be between:
0.5 meter ≤ d < 3 meters.
• Far - the detecting device can hear the beacon but is pretty far, distance between detecting device and beacon is defined to be between:
3 meters ≤ d < 50 meters.
• Unknown - the detecting device cannot determine the RSSI, we define the distance between detecting device and beacon to be between:
50 meters ≤ d < 200 meters.

Figure 1 describes two different cases of beacon ranging.
![Figure 1, ranging beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/beaconRanging.pdf "beacons ranging")
#### Monitoring
When one is particularly interested in knowing if users enter or leave a specific area, this is called geofencing. Monitoring beacons is very similar to geofencing. The device is constantly monitoring, therefore even if the application is killed, or application is not in foreground or background mode, monitoring never stops.
Whenever the device enter or exit a defined region, the application is launched or reactivated and generates appropriate events in relation to the crossed region. In beacons case, a region boundaries is defined by the detection of Bluetooth beacons advertising packet. When one wants to monitor with beacons, one has to define which beacons are included in a region.
• One beacon defines a region:
– a beacon triples (UUID, major and minor).
• Subset of beacons define a region: 
– UUID and major,
– only the UUID.
In example, imagine two beacons having equal UUID but different major and
minor attributes. If an application monitors a beacon region by using only this UUID. The region boundaries are defined by the two beacons advertising packet. In other words, the application will generate appropriate events for the defined region no matter which one of the two beacon’s advertising packet it detects. Important to know that the application can not differentiate which one of the two beacon was detected.
On the other hand, if you monitor a beacon region by using all values of an iBeacon; The triples (UUID, major and minor). The region boundaries are defined by your uniquely beacon which is broadcasting those triples attributes. Note, nothing stops developers from setting two or more beacons with the exact same triples attributes.
Apple limits applications to 20 monitored regions, but we can easily pass this limit by using a single UUID to monitor a subset for multiple beacons. An application monitoring a region with only the UUID, no major, no minor provided, cannot access other attributes from advertising packet. The application knows only that it detected a beacon broadcasting the UUID defined for this region. If one wants to know more informations about beacons, one has to use ranging. Monitoring is only used for enter/exit events.

Figure 2, illustrates the beacons monitor.
![Figure 2, monitoring beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/beaconMonitoring.pdf "beacons monitoring")
# And with Matchmore ?
There is two advantages to use beacons with Matchmore.

First, the publication's properties allow you to attach meaningful informations with your beacons.

Second, you are able to work with pin points on a macro-level scale (meters to kilometers) and beacons on a micro-level scale (centimeters to meters) ; combine both scales at once in a unique integrated back-end service.

## Start using beacons with Matchmore
First you need to register the beacons in your account on Matchmore.
Go to your [account dashboard](www.matchmore.com) by connecting on Matchmore's portal.

When you are logged in, click on "Beacons" in the user menu.

![Go to beacons view](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/3.png "beacons")

Register all the beacons you plan to use.

![Register your beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/4.png "registration")

Then, you can start assign your beacons in your app.

![Assign your beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180613/img/5.png "assignation")

Your beacons are ready to be used with Matchmore, you can now use the generated ID to publish or subscribe on your beacons.

That's how easy it is !

You can also access all the available beacons in an app by calling the following GET request:

`https://api.matchmore.io/v5/devices/IBeaconTriples`

Here is an example with curl:

```JSON
curl -X GET \
http://api.matchmore.io/v5/devices/IBeaconTriples \
-H 'api-key: eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiYmM1Y2EwNTgtZGQ4Yi00ZWZmLWFkMjYtZjg4MmI4OTZiNzMzIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MTU0MjQwMTYsImlhdCI6MTUxNTQyNDAxNiwianRpIjoiMSJ9.m6tVQ8oqWTe8Ne0M0rdZVhwprdEmoSZoP7wg5zM97rlo_n4c_Mks2Cqj4mZsvqM6mczJBm6wtydNnCQvqCZ1Ig' \
-H 'content-type: application/json' \
```

The returned result will be a JSON describing all the available beacons in the given api-key app:

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

## Sources : 
#### 1 
ibeaconinsider. Whåat is ibeacon? a guide to beacons. http://www. ibeacon.com/what-is-ibeacon-a-guide-to-beacons/, 2017. Accessed on 17-12-2017.
#### 2
Apple. Getting started with ibeacon. https://developer.apple.com/ ibeacon/Getting-Started-with-iBeacon.pdf, 06 2014. Accessed on 17-12-2017.
#### 3
Estimote. What is eddystone? http://developer.estimote.com/ eddystone/, 2017. Accessed on 17-12-2017.
#### 4
kontakt.io. What is a beacon? https://kontakt.io/beacon-basics/ what-is-a-beacon/, 2017. Accessed on 17-12-2017.
