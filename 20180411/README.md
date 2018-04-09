# Getting Started with Matchmore: A Proximity detection based location app with Swift iOS [Part 2 of 2]
Hello dear readers, we are back for the second part of the app Color!

This tutorial will show you how to write an iOS app that changes the color of surroundings devices screen to match the most recent published value. We'll be working with Matchmore iOS SDK which encapsulates well known CoreLocation framework. The code will be written in Swift 4 for iOS9 and Xcode 9.2.
This tutorial is to show you how quick and easy it is to get a proof-of-concept **proximity detection based location app**.

All the code for this demo is available on GitHub here: [myColorApp full](https://github.com/matchmore/tech-blog/tree/master/20180411/code/myColorApp)

I have divided this tutorial into two parts:

1. Build the User Interface (UI) needed for this project
2. **Integrate Matchmore to make geomatching and color surroundings devices screen**
# PART 2 Integrate Matchmore
We are back for the part two of this tutorial.

You are going to integrate Matchmore to your ready UI project built in part one. If you are joining us now, please have a look at the previous blog post to catch up, or you can download it [myColorApp part one](https://github.com/matchmore/tech-blog/tree/master/20180403/code/myColorApp).

Let's get started.

## Installing Dependencies
First, you need to inject Matchmore in your Xcode project. You'll need CocoaPods.

If you don’t have CocoaPods installed on your machine, check out [Adam's blog post](http://blog.matchmore.io/first-mobile-app-with-matchmore/) for a quick explanation.

Open **Terminal**, locate to your project folder, like image below.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/1.png "LOCATE")

Enter the following command:

`pod init`, press Enter.

See image below.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/2.png "podfile")

It will create a file named Podfile in the main directory of the project.
Open the Podfile and add the following line under `use_frameworks`. 

`pod 'AlpsSDK', '~> 0.6'`

See example below.

```
target 'myColorApp' do
  # Comment the next line if you're not using Swift ...
  use_frameworks!

  pod 'AlpsSDK', '~> 0.6'
  ...
```

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/3.png "podfile complete")

Save the Podfile, and inside **Terminal** enter the following command:

`pod install`, press Enter. See result below.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/4.png "after pod install")

Open the newly created myColorApp.xcworkspace. See image below.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/5.png "workspace")

## Geomatching with Matchmore
Matchmore SDK is implemented as a wrapper, so whenever we need to use Matchmore's features we need to add the import right at the top of the class.

Add the following lines to import `Matchmore SDK` and Apple's framework `CoreLocation` at the top of *AppDelegate.swift* file:
```swift
    import AlpsSDK
    import CoreLocation
```

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/6.png "import matchmore")

## Initialize Matchmore
Matchmore is a very malleable SDK. It is configured by default to work for general cases. But it is possible to configure it according to our needs.

For our `colors app`, we will initiate Matchmore with particular configurations, because our app does not need to update locations in the background.

```swift
// ...

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // 1. Create LocationManager
        let locationManager = CLLocationManager()
        // 2. Set LocationManager configurations
        locationManager.pausesLocationUpdatesAutomatically = true
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        
        // 3. Create your MatchMoreConfig
        // Generate your API-key in your app dashboard on https://matchmore.io
        let config = MatchMoreConfig(apiKey: "your api-key HERE", customLocationManager: locationManager)
        // 4. Configure Matchmore with your needs
        MatchMore.configure(config)
        
        // ...
```

Inside of `func didFinishLaunchingWithOptions()` in your `AppDelegate`.

1. Create an instance of `LocationManager`, which will detect user’s location changes.
2. We configure `LocationManager` to pause automatically to save battery and location tracking for best accuracy. Also, we request permission for only when-in-use location tracking, because our app does not need to track location in background mode.
N.B.: For every app that needs to track location, it is required to have correct access rights. Usually, you need to add some lines of code but our SDK already does it for you.
3. To configure Matchmore SDK, you need to create an instance of `MatchMoreConfig` with the required parameters; the API-key and the customized `LocationManager`.
You can generate an API-key in your app dashboard on [https://matchmore.io](https://matchmore.io).
4. Set Matchmore SDK with the configuration we have predetermined in the `MatchMoreConfig` object.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/7.png "intialize complete")

## Ask permission request for location updates
Now you can run the app. But your app won't prompt location authorization alert, because you should go to `Info.plist` file and add the permission request.

1. Go to `Info.plist`
2. Add a new row and find `Privacy - Location When In Use Usage Description`.
3. Add value for this key, e.g. “Colors needs to access your location to spread the color.”. This key is required when we use `requestWhenInUseAuthorization()` method. Otherwise, the system will ignore location request. This key describes why your system wants to use user’s location.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/8.png "info.plist complete")

After adding this key you can run the app once again. Now the system will prompt authorization alert with our description.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/9.png "iphone for info.plist request")

## Feature proximity detection on the main device
Matchmore SDK can be used in different ways, but the most common way is to have a main device. Usually, this main device is the device on which the app is running.

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
// ...

// 1. Create the main device
        MatchMore.startUsingMainDevice { result in
            // 2. Unwrap the result
            guard case .success(let mainDevice) = result else { print(result.errorMessage ?? ""); return }
            print("🏔 Using device: 🏔\n\(mainDevice.encodeToJSON())")
            
            // 3. Start getting matches with Web Socket service
            MatchMore.startListeningForNewMatches()
            // 4. Start location track in Matchmore
            MatchMore.startUpdatingLocation()
            // 5. Create the socket subscription
            self.createSocketSubscription()
        }
        // ...
```

Inside of `func didFinishLaunchingWithOptions()` in your `AppDelegate`.

1. Use the wrapper `MatchMore` and call the method `startUsingMainDevice()` to start the registration app running device in Matchmore service.
2. MatchMore SDK's methods are generally having an asynchronous callback. To handle it, you need to declare closure.
`result` is an enum, you need to unwrap it. When it is a success the callback returns the object created in Matchmore backend service, else when it is a failure, the callback is an error containing a message that describes what happened.
3. Start the web socket service to get matches.
4. Start informing Matchmore service that your app is moving.
5. Add this line, you'll create a function called `createSocketSubscription`, explanation further.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/10.png "main device creation complete")

## Create a subscription to **start discovering near colors spread**
Now, you will create a subscription to the main device. Subscribers are the ones that are notified when matches occur.
In our case, when matches occur our background should change according to the color chosen by the publishers.

```swift
    // 1. Create Socket subscription function
    // Subscriptions
    func createSocketSubscription() {
        // 2. Retrieve main device ID
        guard let deviceId = MatchMore.mainDevice?.id else {return}
        // 3. Create a Subscription, set topic and selector.
        let subscription = Subscription(topic: "color", range: 5, duration: 5000, selector: "id <> '\(deviceId)'")
        // 4. Set websocket mode
        subscription.pushers = ["ws"]
        // 5. Create a Subscription for Main Device
        MatchMore.createSubscriptionForMainDevice(subscription: subscription, completion: { result in
            switch result {
            case .success(let sub):
                print("🏔 Socket Sub was created 🏔\n\(sub.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
```

In *AppDelegate.swift*, just above the last curly brace ( } ).

1. Create a function named `createSocketSubscription()` taking no parameter and returning nothing.
2. Retrieve main device ID, you'll need it in order to not change the color of your own screen (We don't want to match our own main device's publications).
3. Create a subscription to listen for the color changes sent by other devices.
The topic is our first filter, we set `color`. Every publication that is set on topic `color` will concern the color features.
Put range equals to 5 (meters), duration equals to 5000 (seconds).
Next, set the selector equals to `id <> '\(deviceId)'`. We are setting a property filter to match only with publications for which the id are not equal to ours.
N.B.: `<>` is `not equal`.
4. Since we will use web socket to get matches notification, we need to configure the pusher equals to `ws`.
5. Last but not least, use the wrapper `MatchMore` and call the method `createSubscriptionForMainDevice()` to send the creation request to Matchmore service.
N.B.: Don't forget we need to handle two cases, in case of success we retrieve the created object, and in case of failure, we retrieve an error.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/11.png "subscription complete")

## Create a publication to change the color of surroundings devices
To distribute the selected color on the screen of the surrounding devices, you must use publications.
When a device is a publisher, it is as if it broadcast its presence. The publications can contain a lot of information, all this information is grouped in the `property` value.
N.B .: A device can be both publisher and subscriber at the same time.

Let's create a publication.

```swift
    // 1. Create publication creation function
    // Create a publication
    func createPublication() {
        // 2. Retrieve selected picker row, selected range, and main device ID
        let selectedValue = pickerData[colorPicker.selectedRow(inComponent: 0)]
        let selectedRange = rangeSlider.value
        guard let deviceId = MatchMore.mainDevice?.id else {return}
        // 3. Create a Publication, set topic and properties
        let publication = Publication(topic: "color", range: Double(Int(selectedRange)), duration: 100, properties: ["color": selectedValue, "id": deviceId])
        // 4. Create a Publication for Main Device
        MatchMore.createPublicationForMainDevice(publication: publication, completion: { result in
            switch result {
            case .success(let publication):
                print("🏔 Pub was created: 🏔\n\(publication.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
```

In *ViewController.swift*, just above the last curly brace ( } ).

1. Create a function named `createPublication()` taking no parameter and returning nothing.
2. Retrieve selected picker row, selected range, and main device ID. You'll need it in order to not change the color of your own screen (We don't want to match our own main device's publications).
3. Create a publication to spread the chosen color.
Remember the topic is our first filter, to have matches both publications and subscriptions need to be created on the same unique topic.
The topic is `color`. 
Then, the range is filled with the selected range by the user.
Set duration to `100` (seconds).
Now, you can set properties to transmit either some supplement information or to allow finer filtering for the subscribers of topic `color`. Obviously, a property key is named `color` and contains the value of selected color the user wants to spread.
And one more property key is `id`, to allow finer filtering to not match our own publications.
4. Finally, use the wrapper `MatchMore` and call the method `createPublicationForMainDevice()` to send the creation request to Matchmore service.
N.B.: Don't forget we need to handle two cases, in case of success we retrieve the created object, and in case of failure, we retrieve an error.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/12.png "publication complete")

## Add the actions
With `createPublication()` function ready, we can set the actions for our `UIActions` objects.

1. Find func `changeColor(_ sender: Any)`.
2. Add `createPublication()` in it.

3. Find func `rangeSliderChanged(_ sender: Any)`
4. Add the following line:
`self.rangeLabel.text = "\(Int(rangeSlider.value)) m"`

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/13.png "Action complete")

## Handle matches
All that is left is to handle matches.
When matches occur, you'll need to find the publication in it and get the color which your screen should adopt. Let's handle matches.

1. Make your class `ViewController` conform to the `MatchDelegate` protocol.
Also, add var `onMatch` which is a closure and the array `colors` which contains the `UIColor` object.

Just like code below:
```swift
class ViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource, MatchDelegate { 
// ...
// MARK: Properties
// ...
var onMatch: OnMatchClosure?
let colors = ["yellow": UIColor.yellow,
                  "red": UIColor(red: 255/255, green: 106/255, blue: 93/255, alpha: 1),
                  "orange": UIColor(red: 255/255, green: 179/255, blue: 70/255, alpha: 1),
                  "magenta": UIColor(red: 255/255, green: 116/255, blue: 217/255, alpha: 1),
                  "lightgray": UIColor.lightGray,
                  "green": UIColor(red: 134/255, green: 255/255, blue: 150/255, alpha: 1),
                  "cyan": UIColor.cyan,
                  "teal": UIColor(red: 20/255, green: 229/255, blue: 204/255, alpha: 1),
                  "pink": UIColor(red: 255/255, green: 173/255, blue: 171/255, alpha: 1),
                  "white": UIColor(red: 255/255, green: 255/255, blue: 255/255, alpha: 1)
    ]
// ...
```

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/14.png "Handle Matches one of two complete")

2. By adding the following lines inside of the method `viewDidLoad()`, you'll make `ViewController` conform to `MatchDelegate` protocol, plus you'll be able to describe how it should process matches:

```swift
        // Handle Matches
        self.onMatch = { [weak self] matches, _ in
            // 1. Get most recent Match
            let mostRecentDate = matches.max(by: {
                $0.createdAt! < $1.createdAt!
            })
            
            // 2. Unwrap properties and color
            guard let properties = mostRecentDate?.publication?.properties else {
                print("No properties.")
                return
            }
            guard let color = properties["color"] as? String else {return}
            
            // 3. Color Background of the screen
            self?.view.backgroundColor = self?.colors[color]
        }
        // 4. Add View as a supplement match delegate to Matchmore
        MatchMore.matchDelegates += self
    }
```

Inside of `func viewDidLoad()` in your `ViewController.swift` file.

You'll create the delegate function for `onMatch` listener. `onMatchClosure` are triggered every time you get a new match.
The callback is composed of an array of hundred last matches, plus the concerned device.

1.  Filter the matches based on their `createdAt` timestamp to retrieve the most recent match.
2.  Safely unwrap the value you'll use.
3.  Call `self.view` and color the background with the spread color.
4.  Earlier, we have made `ViewController` conform to `MatchDelegate` protocol. In order to be informed of every match, you'll need to add `ViewController` to Matchmore wrapper match delegates list.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/15.png "Handle matches two of two complete")

## Launch simulator(s)
Before trying the app in the simulator, don't forget to provide a valid API-key to `MatchmoreConfig` object in the `AppDelegate.swift`.

Launch two simulators, and try to spread the color across the devices.
N.B.: Be sure that both simulators are set to locations close enough, so they can match. To set location, go to `Simulator menu/Debug/Location/Custom Location...`.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180411/img/16.gif "Simulations")

## What's next?
In this tutorial, you learned how to use Matchmore and get a quick working proof-of-concept proximity detection app.

I hope you enjoyed it as much as I did, and that you will be able to use Matchmore in many others of your projects!

Cheers!
