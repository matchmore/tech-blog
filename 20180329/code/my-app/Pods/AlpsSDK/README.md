# Alps iOS SDK

`AlpsSDK` is a contextualized publish/subscribe model which can be used to model any geolocated or proximity based mobile application. Save time and make development easier by using our SDK. We are built on Apple Core Location technologies and we also provide iBeacons compatibility.

## Versioning

SDK is written using Swift 4.

Alps SDK requires iOS 9+.

## Installation

Alps is available through [CocoaPods](http://cocoapods.org), simply add the following
line to your Podfile:

    pod 'AlpsSDK'

## Usage

Please refer to documentation "tutorial" to get a full explanation on this example:

Setup application API key and world, get it for free from [http://matchmore.io/](http://matchmore.io/).
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    let config = MatchMoreConfig(apiKey: "YOUR_API_KEY")
    MatchMore.configure(config)
    return true
}
```

Create first device, publication and subscription. Please note that we're not caring about errors right now.
```swift
MatchMore.startUsingMainDevice { _ in
    let publication = Publication(topic: "Test Topic", range: 20, duration: 100, properties: ["test": "true"])
    MatchMore.createPublicationForMainDevice(publication: publication, completion: { _ in
        print("🏔 Created Pub")
    })
    let subscription = Subscription(topic: "Test Topic", range: 20, duration: 100, selector: "test = 'true'")
    MatchMore.createSubscriptionForMainDevice(subscription: subscription, completion: { _ in
        print("🏔 Created Sub")
    })
}
```

Define an object that's `AlpsManagerDelegate` implementing `OnMatchClojure`.
```swift
class ExampleMatchHandler: MatchDelegate {
    var onMatch: OnMatchClosure?
    init(_ onMatch: @escaping OnMatchClosure) {
        self.onMatch = onMatch
    }
}
```

Start listening for main device matches changes.
```swift
let exampleMatchHandler = ExampleMatchHandler { matches, _ in
    print(matches)
}
MatchMore.matchDelegates += exampleMatchHandler
```

## Set up APNS: Certificates for push notifications

Alps iOS SDK uses Apple Push Notification Service (APNS) to deliver notifications to your iOS users.

If you already know how to enable APNS, don't forget to upload the certificate in our portal.

Also, you need to add the following lines to your project `AppDelegate`.

These callbacks allow the SDK to get the device token.

```swift
// Called when APNS has assigned the device a unique token
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // Convert token to string
    let deviceTokenString = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})
    MatchMore.registerDeviceToken(deviceToken: deviceTokenString)
}

// Called when APNS failed to register the device for push notifications
func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
    MatchMore.processPushNotification(pushNotification: userInfo)
}
```

Else, you can find help on [how to setup APNS](https://github.com/matchmore/alps-ios-sdk/blob/master/ApnsSetup.md).

## Example

in `AlpsSDK/Example/` you will find working simple example.

## Documentation

See the [http://matchmore.io/documentation/api](http://matchmore.io/documentation/api) or consult our website for further information [http://matchmore.io/](http://matchmore.io/)

## Authors

- @tharpa, rk@matchmore.com
- @wenjdu, jean-marc.du@matchmore.com
- @maciejburda, maciej.burda@matchmore.com


## License

`AlpsSDK` is available under the MIT license. See the LICENSE file for more info.
