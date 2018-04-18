# Saving iPhones lives

You probably had battery frustration. New age sickness. Your phone died already several times, right? In the least expected moments. You started to wonder: who's fault is that? You go to the settings looking for the hog. There it is. An application that was doing something in the background, even worse GPS! You take it's permissions back. Now you're safe - never opening the app back again.

But when you are a developer - you don't want above to happen to the app you're working on, but still, you want to give all these location/background related features, because they're cool and that's reasonable.

What can we do about it?

It appears best practices are out there, but none cares. Here I'd like to take a chance to overview them and apply them to real life scenario. For now only for iOS, but in the next post for Android, eventually ending up with a pretty robust comparison of both.

## What really drains the battery?

A general answer is pretty simple. Every CPU, GPU, disk, camera, GPS or network operation has a direct effect on battery consumption. If a developer sets up a location manager that triggers location update every second, stores in on disk and in addition enqueues API request we will end up with battery killer app. Though - sometimes - you may want something similar to that. For example, an application that records your car mileage or a game such as Pokemon go, where everything is related to you concrete position on a map. But in this scenario phone is either hooked to the car's electric system or a player ends up buying power bank.

The trick is that it takes a small effort to get background permissions on iOS. All you need to do is flick "using location" switch and fill in a couple of description strings.

The important part here is that it's always a good idea to explain the what are you planning to do with this location. In general, users just give it, but explaining what's gonna happen in details will make them think twice before they turn it off. For example, Revolut app is using phones location as an additional security measure and they are very clear about this when asking for your location permissions.


## How can we measure battery consumption?

In iOS, it's quite tricky. There're a couple of solutions available in Cydia, but jailbreaking is less and less popular, making it quite hard to run on newest devices. Also, we could use Xcode's energy impact profiler, but here it might be really tricky to invent proper testing scenarios. Especially when you consider GPS based app that performs requests and receives data depending on its location.

The truth is that the best we can do is to really start using your own app as if you were a user. In Matchmore we created a number of scenarios and invited every member of the team to participate. Their task was pretty simple: become one of the users of our app, start be active and see if you receive notifications with valuable data.

The general scenario was pretty simple. Create some offers with tickets you are interested in on your way to work and back home and see if you were able to be notified about them all while using your phone normally as you would.

Beginnings were awful. The first implementation we've given to testers with the default setup of the SDK was updating location every second almost every time talking to our cloud. You can imagine how it went. It was a slaughter. iPhones were dying within hours. Tough to be completely honest with you, we expected that to happen. Having that test we learned how much we can squeeze in in terms of data quality, not caring about battery cost at all. After that our motivation was to figure out the best setup with which we could obtain proper balance. Minimizing battery usage while maximizing the usefulness of the features. To do so we needed to answer several questions.

## How to analyze your project needs?

We already established, that there're cases like location-based games or live tracking scenarios where you're supposed to drain a battery. Take Pokemon Go as an example. People running around with power banks is quite a usual picture. Though, the real question is: What Your application needs?

For the sake of this post, I'd like to focus on use case we've implemented. Ticketing app that uses Matchmore allows doing three things. Finding, buying and selling tickets. For selling it's quite simple - we just need the concrete location of a user or location chosen by the user on the map (there's also the third option with iBeacons, but let's not go there yet).  Searching and purchasing are much more complicated. To make it work we need continuous location update.

Imagine a scenario where you have two spare tickets for a concert that happens today, but you've got unexpected visitation of your family. With ticketing app we created, you could take these tickets with you (wherever you go with your family) and just broadcast the offer to people around you. Now it's time to write down some numbers.

For ticketing app, we agreed that range of the offer will be from 1 to 15km and location update will happen every 100m. With that, we'll trigger background process 100 times less than default setup. Matchmore allows injection of location manager, so all you need to do is creating `CLLocationManager` instance with proper setup and put it into Matchmore SDK. Let's see how it looks like in our code:

```swift
lazy var locationManager: CLLocationManager = {
    let locationManager = CLLocationManager()
    locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    locationManager.activityType = .fitness
    locationManager.pausesLocationUpdatesAutomatically = true
    locationManager.allowsBackgroundLocationUpdates = true
    return locationManager
}()
```
Let's break it down with some documentation before we go any further:

`desiredAccuracy`:
The accuracy of the location data.
The receiver does its best to achieve the requested accuracy; however, the actual accuracy is not guaranteed.
You should assign a value to this property that is appropriate for your usage scenario. For example, if you need the current location only within a kilometer, you should specify `kCLLocationAccuracyKilometer` and not `kCLLocationAccuracyBestForNavigation`. Determining a location with greater accuracy requires more time and more power.
When requesting high-accuracy location data, the initial event delivered by the location service may not have the accuracy you requested. The location service delivers the initial event as quickly as possible. It then continues to determine the location with the accuracy you requested and delivers additional events, as necessary when that data is available.

`activityType`:
The location manager uses the information in this property as a cue to determine when location updates may be automatically paused. Pausing updates gives the system the opportunity to save power in situations where the user's location is not likely to be changing. For example, if the activity type is `automotiveNavigation` and no location changes have occurred recently, the radios might be powered down until movement is detected again.

`pausesLocationUpdatesAutomatically`:
A Boolean value indicating whether the location manager object may pause location updates.
Allowing the location manager to pause updates can improve battery life on the target device without sacrificing location data. When this property is set to true, the location manager pauses updates (and powers down the appropriate hardware) at times when the location data is unlikely to change. For example, if the user stops for food while using a navigation app, the location manager might pause updates for a period of time. You can help the determination of when to pause location updates by assigning a value to the `activityType` property.

`allowsBackgroundLocationUpdates`:
A Boolean value indicating whether the app should receive location updates when suspended.
Apps that want to receive location updates when suspended must include the `UIBackgroundModes` key (with the location value) in their app’s Info.plist file and set the value of this property to true. The presence of the `UIBackgroundModes` key with the location value is required for background updates; you use this property to enable and disable background updates programmatically. For example, you might set this property to true only after the user enables features in your app where background updates are needed.

That's a lot! But there's even more once you really dig into the docs. Tools like deferred location updates or handling `locationManagerDidPauseLocationUpdates(_:)` are quite important, but we won't go there in this post.

Here it's worth to mention that getting GPS is one thing, but what happens to it afterward is the other. In Matchmore we do simple fire and forget strategy. Enqueuing requests and caching data on disk is sometimes needed, but for most applications, we don't have to be that robust.

To sum it up, in this scenario - Matchmore SDK with proper location manager setup will fire one request every 100m updating user's position and will go into battery saving mode when a user stops moving.

## Is it possible to force iOS to make our app work forever?

Yes and no.

The thing is that even if you have all background permissions you could get, iOS can still choose to terminate our application, for example when it wasn't used by a user for some time and another app requires more RAM memory.
It doesn't matter if you're recording location or not.

But there's way which allows configuring your app in a way that significant location change will open your app after the event happens. Let's take a look what they say in docs:

If you start this service and your app is subsequently terminated, the system automatically relaunches the app into the background if a new event arrives. In such a case, the options dictionary passed to the `application(_:willFinishLaunchingWithOptions:)` and `application(_:didFinishLaunchingWithOptions:)` methods of your app delegate contains the key location to indicate that your app was launched because of a location event. Upon relaunch, you must still configure a location manager object and call this method to continue receiving location events. When you restart location services, the current event is delivered to your delegate immediately. In addition, the location property of your location manager object is populated with the most recent location object even before you start location services.

Once you get background location updates permissions you have loads of power in your hands. Which means that you have to be very careful about what you do when the application is in the background state.


To make it happen you have to simply:
```swift
locationManager.requestAlwaysAuthorization()
locationManager.requestWhenInUseAuthorization()
locationManager.startMonitoringSignificantLocationChanges()
locationManager.startUpdatingLocation()
```

Also, make sure, you're making all important setups in `application(_:didFinishLaunchingWithOptions:)`, because this will be the only method fired automatically after your app is terminated.

The whole code base of the ticketing app is available open source:
https://github.com/matchmore/ios-ticketing-app

We're also releasing it to the AppStore.

## To sum it up
There're quite some tools out there to make your app efficient. It may require some digging, but it's definitely worth it. For all these years Apple made real effort to provide well-designed mechanisms that are both safe for the user and powerful for the developer.