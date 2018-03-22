# From 0 to Match - Set Up Everything with Apple Xcode

In this post, I will go through setting up an iOS application with Matchmore SDK, from registration on the portal to obtaining a match.

Matchmore SDK is distributed with cocoapods. It is `pod 'AlpsSDK', '~> 0.6'`, to install cocoapods I can execute in terminal:
```
sudo gem install cocoapods
```

What I have to do is create a new application on developer portal and obtain API key that I will later use in SDK.
After loging in / registering I do:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/create-app.gif "create app")

Then I create new iOS single view swift application in Xcode after that I close Xcode go to main application directory with terminal (in this case my-app) and execute `pod init` which creates `Podfile` file. To add AlpsSDK to my application, I have to add `pod 'AlpsSDK', '~> 0.6'` to `Podfile` 

After the edit, it may look like this
```
target 'my-app' do
  # Comment the next line if you're not using Swift...
  use_frameworks!

  pod 'AlpsSDK', '~> 0.6'
  ...
```

After that I can install AlpsSDK and its dependencies by executing `pod install`, this will also generate `my-app.xcworkspace` that from now on I will use to open this project in Xcode (the old my-app.xcodeproj will not work properly).

After importing `my-app.xcworkspace` into Xcode I have to add SDK initialization to `AppDelegate.swift`, so I change `application` funtion to look like this:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  let config = MatchMoreConfig(apiKey: "paste_API_key_from_portal_here")
  MatchMore.configure(config)

  return true
}
```

Above I pass API key to configuration. Also, I have to add `import AlpsSDK` import at the top of `AppDelegate.swift` file.

Now that I have SDK set up will create label and 2 buttons in `Main.storyboard`.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/app-main-page.png "app main view")

Lets write the code that will create publication and subscription after clicking on those buttons and code that will update label when application will get a match.

So first I create `IBAction` for publish and subscribe button. Code for creating pblication looks like this:
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

This will create publication attached to phone location with range 20 meters and duration 100 seconds, this publication will be on topic `Test Topic` which means that it will only match with subscriptions on the same topic, this publication also have property named `test` set to `true`, I can have arbitrary number of properties with arbitrary names that can be used to store informations in publications and to further restrict when match should happen.


Code for creating subscription loks like this:
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

This will create subscrption attached to phone location with range 20 meters and duration 100 seconds on topic `Test Topic`, this publication also have a selector that will allow match only with publications that have property test and this property is set to true. Selector can be more complex than this for example `test = true and (color = 'red' or size > 10)` this selector will allow match only with publication that has property test set to true and also have property color and size and one of them has to satisife the condition. Additional property that is set on subscription is `pusher` this tels backend how it should deliver matches to application, ws means that it should use web sockets, SDK also supports delivery with Apple push notifications and polling. For this example I chose web sockets because they requires no set up (like APNs certs and so on).

Last Pice is the code responsible for processing matches that are delivered to application, in my case it looks like this:
```swift
class ViewController: UIViewController , MatchDelegate {
  var onMatch: OnMatchClosure?
...

  override func viewDidLoad() {
      super.viewDidLoad()
      MatchMore.startUsingMainDevice { result in
          guard case .success(let mainDevice) = result else { print(result.errorMessage ?? ""); return }
          // Start Monitoring Matches
          self.onMatch = { [weak self] matches, _ in
              print("🏔 You've got new matches!!! 🏔\n\(matches.map { $0.encodeToJSON() })")
              self?.label.text = "🏔 You've got new matches!!! 🏔"
          }
          MatchMore.matchDelegates += self
          MatchMore.startListeningForNewMatches()
          MatchMore.startUpdatingLocation()
      }
  }
```
