# First mobile app with Matchmore

In this post, I will go through setting up an iOS application with Matchmore SDK, from registration on the portal to obtaining a match.

Matchmore SDK is distributed with cocoapods. It is `pod 'AlpsSDK', '~> 0.6'`, to install cocoapods execute in terminal:
```
sudo gem install cocoapods
```

Now lets create new application on developer portal and obtain API key that we will later use in SDK.
After loging in (you can register for free) I do:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/create-app.gif "create app")

Then create new iOS single view application in Xcode (select swift as laguage) after that close Xcode and go to main application directory with terminal (in this case my-app) and execute `pod init` which creates `Podfile` file. To add AlpsSDK to application, add `pod 'AlpsSDK', '~> 0.6'` to `Podfile` 

After the edit, it may look like this
```
target 'my-app' do
  # Comment the next line if you're not using Swift...
  use_frameworks!

  pod 'AlpsSDK', '~> 0.6'
  ...
```

After that execute `pod install`, this will download AlpsSDK and generate `my-app.xcworkspace` that from now on we will use to open project in Xcode (the old my-app.xcodeproj will not work properly).

After importing `my-app.xcworkspace` into Xcode, we will add necessary permissions for the app in `info.plist` file. Right click on `info.plist` select `Open As > Source Code` and add two keys at the end:

```
...
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>This app needs your current location</string>
    
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs your current location</string>
</dict>
</plist>
```

Next we have to initialize SDK to do that in `AppDelegate.swift` in `application` funtion add thos two lines:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  let config = MatchMoreConfig(apiKey: "paste_API_key_from_portal_here")
  MatchMore.configure(config)

  return true
}
```
This is the place where we have to pass application key that was generated in portal for ours app.
There will be compilation erro because Xcode does not know what `MatchMoreConfig` is, to fix that add `import AlpsSDK` import.

Now that SDK is set up we will create a label and two buttons in `Main.storyboard`.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/app-main-page.png "app main view")

Let's write the code that will create publication and subscription after clicking on those buttons and code that will update label when the application will get a match.

So first I create `IBAction` for publish and subscribe button. Code for creating publication looks like this:
```swift
@IBAction func publish() {
    MatchMore.createPublicationForMainDevice(publication: Publication(topic: "Test Topic", range: 20, duration: 100, properties: ["test": "true"]), completion: { result in
        switch result {
        case .success(let publication):
            print("🏔 Pub was created: 🏔\n\(publication.encodeToJSON())")
        case .failure(let error):
            print("🌋 \(String(describing: error?.message)) 🌋")
        }
    })
}
```

This code will create publication attached to phone location with range 20 meters and duration 100 seconds (this publication will be deleted after 100 seconds). This publication will be on topic `Test Topic` which means that it will only match with subscriptions on the same topic, this publication also has a property named `test` set to `true`. I can have arbitrary number of properties with arbitrary names that can be used to store information in publications and to restrict further when the match should happen.


Code for creating subscription looks like this:
```swift
@IBAction func subscribe() {
    let subscription = Subscription(topic: "Test Topic", range: 20, duration: 100, selector: "test = true")
    subscription.pushers = ["ws"]
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

This code will create subscription attached to phone location with range 20 meters and duration 100 seconds on topic `Test Topic`, this subscription also have a selector that will allow match only with publications that have property test and this property is set to true. The selector can be more complex than this for example `test = true and (color = 'red' or size > 10)` this selector will allow match only with a publication that has property test set to true and also has property color and size and one of them has to satisfy the condition. Additional property that is set on subscription is `pusher` this tells backend how it should deliver matches to the application, `ws` means that it should use web sockets, SDK also supports delivery with Apple push notifications and polling. For this example, I chose web sockets because they require no set up (like APNs certs and so on).

The last pice is the code responsible for processing matches that are delivered to the application, in my case, it looks like this:
```swift
class ViewController: UIViewController , MatchDelegate {
  var onMatch: OnMatchClosure?

...

override func viewDidLoad() {
    super.viewDidLoad()
    self.onMatch = { [weak self] matches, _ in
        print("🏔 You've got new matches!!! 🏔\n\(matches.map { $0.encodeToJSON() })")
        self?.label.text = "🏔 You've got new matches!!! 🏔"
    }
    MatchMore.startUsingMainDevice { result in
        guard case .success(let mainDevice) = result else { print(result.errorMessage ?? ""); return }
        print("🏔 Using device: 🏔\n\(mainDevice.encodeToJSON())")
        MatchMore.matchDelegates += self
        MatchMore.startListeningForNewMatches()
        MatchMore.startUpdatingLocation()
    }
}
```

First I implement protocol `MatchDelegate` in `ViewController` and inside `viewDidLoad` assign what should happen when the application gets a match (log message and change label text). Next, I am starting the main device that will represent my phone on the backend, and after checking that it was created I add match delegate, start listening to matches and start sending location updates.

Now I can start two simulators and check if I get a match:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/match.gif "match")

The match is instant because both simulators are in the same location when this app is on the phone it will only get a match if both phones are in no further than 20 meters away from each other.
So what happened on that gif is: first I created a subscription on one phone and then publication on the other phone. Since publication, and subscription ware in range of each other match occurred instantly. The application that created the subscription received the match that contains all information about the publication that was matched including publication properties.
