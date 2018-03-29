In this post, we will go through setting up an iOS application with AlpsSDK, from registration on the portal to obtaining a match.

## Before you start
We will use CocoaPods. In order to install this package manager you'll need to execute this command in the terminal:
```
sudo gem install cocoapods
```

## Get API key
Now let's create a new application on Matchmore Portal and obtain the API key that we will use to configure SDK later on.
After logging in ([register for free here](http://matchmore.com/account/register/)) you do the following:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/create-app.gif "create app")

## Xcode mobile app
Now let's create a fresh single view project in Xcode (I highly recommend using Swift🤓). After that, close Xcode and go to the main application directory with terminal, in this case my-app. Execute `pod init` which will create `Podfile` file. To add AlpsSDK to application, add `pod 'AlpsSDK', '~> 0.6'` to `Podfile`. 

After the edit, it may look like this:
```
target 'my-app' do
  # Comment the next line if you're not using Swift ...
  use_frameworks!

  pod 'AlpsSDK', '~> 0.6'
  ...
```

Afterwards, execute `pod install`, this will download the AlpsSDK and generate `my-app.xcworkspace` which you have to open in Xcode (the old my-app.xcodeproj will not work correctly).

After importing `my-app.xcworkspace` into Xcode, we will add necessary permissions for the app in `Info.plist` file. Right-click on `info.plist` select `Open As > Source Code` and add two keys at the end:

```
...
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>This app needs your current location</string>
    
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs your current location</string>
</dict>
</plist>
```

## SDK configuration
Next we have to initialize the SDK. To do so in `AppDelegate.swift` in `application(_:didFinishLaunchingWithOptions:)` function, you have to add those two lines:
```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  let config = MatchMoreConfig(apiKey: "paste_API_key_from_portal_here")
  MatchMore.configure(config)

  return true
}
```
The first line creates a configuration with your API key, and the second configures the AlpsSDK.

There will be a compilation error because Xcode does not know what `MatchMoreConfig` is. To fix this, add `import AlpsSDK` import.

Now that the SDK is set up, we will create a label and two buttons in the main application view in `Main.storyboard`.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/app-main-page.png "app main view")

## Create a publication
Let's write the code that will create a publication and a subscription when clicking on the buttons. The first step is to create `IBAction` for the publish button:
```swift
@IBAction func publish() {
    let properties: [String: Any] = ["test": true]
    MatchMore.createPublicationForMainDevice(publication: Publication(topic: "Test Topic", range: 20, duration: 100, properties: properties), completion: { result in
        switch result {
        case .success(let publication):
            print("🏔 Pub was created: 🏔\n\(publication.encodeToJSON())")
        case .failure(let error):
            print("🌋 \(String(describing: error?.message)) 🌋")
        }
    })
}
```

This function will create a publication attached to the phone location with a range of 20 meters and a duration of 100 seconds (the publication will be removed after 100 seconds). This publication will be the topic `Test Topic` which means that it will only match with subscriptions with the same topic. 

It also has a property named `test` set to `true`. Publications can have an arbitrary number of properties with arbitrary names which can be used to store information in them. They can also be used to further restrict when the match should happen by adjusting the selector in the subscription.

## Create subscription
The next step is to add `IBAction` for the subscribe button:
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

This function creates a subscription with similar parameters like the publication. Instead of properties, the subscription has a selector. In the case of this selector, it will allow matches only with publications that have property `test` and this property is set to `true`. 

The selector can be more complex, for example it may looks like this: `test = true and (color = 'red' or size > 10)`, it requires additional properties `color` and `size`. 

Another difference for subscription is that it receives matches, so we have to set how they will be delivered to the mobile device. You have to use `pusher` for that. Here it is set to `ws` which means that the SDK will use web sockets to get matches. Apple push notifications and polling are also supported. For this example, we chose web sockets because they require no set up (like APNs certs and so on).

## Handle matches
Now that we can create publications and subscriptions on devices, the last piece is the code responsible for processing matches that are delivered to the application. In our case, it looks like this:
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

First, we implement the `MatchDelegate` protocol in `ViewController` and inside `viewDidLoad` we define what should happen when the application gets a match (change label text). 

Next, we start the main device that will represent the phone on the backend. After checking that it was created, we add match delegate, start to listen to matches and start to send location updates.

## Test
The scenario is like this:
1. Create a subscription
2. Create a publication
3. Move phones/simulators to be no further than 40 meters from each other within 100 seconds
4. Observe a match

Now lets start two simulators and check how it works:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/match.gif "match")

The match is instant because both simulators are in the same location.

So what happened on the gif was: 

First we created a subscription on one phone and then a publication on the other phone. Since the publication and the subscription were on the same topic and in range of each other, a match occurred instantly. The application that created the subscription received the match that contains all information about the publication that was matched including publication properties. We can see how a full match looks like in the log:

```
🏔 You've got new matches!!! 🏔
[["subscription": 
  [
  "selector": "test = true", 
  "range": 20.0, 
  "location": ["latitude": 37.785834000000001, "longitude": -122.406417, "altitude": 0.0], 
  "id": "19ba2264-af6a-4b4f-b3d7-07dc386c24b3", 
  "createdAt": 1521647756912, 
  "deviceId": "f5e73fa1-399c-42f9-88d9-a92ef5b22c74", 
  "topic": "Test Topic", 
  "duration": 100.0, 
  "pushers": ["ws"]
  ],
"publication": 
  [
  "range": 20.0, 
  "location": ["latitude": 37.785834000000001, "longitude": -122.406417, "altitude": 0.0], 
  "id": "710a18a5-648a-444f-87b3-b6c5d941fe84", 
  "createdAt": 1521647746694, 
  "deviceId": "f5e73fa1-399c-42f9-88d9-a92ef5b22c74", 
  "topic": "Test Topic", 
  "duration": 100.0, 
  "properties": ["test": true]
  ]
]]
```

## What's next?
So to sum up:

AlpsSDK allows us to quickly attach pieces of information to phones, iBeacons and static locations (but this is for another blog post) in the form of publications and query them with subscriptions. Information is delivered to the device that has attached a subscription when it is in the proximity of a matching publication.

Subscription and publication are matching if they are on the same topic, they are in proximity and properties in the publication are valid for the selector in the subscription.

One way to simplify this is to treat publication like database records that are attached to physical objects that move around (like a phone). A subscription is like a query that gets results in the form of the match when it is in the proximity of publication. As with a database, you can model many business cases with publications and subscriptions. 

For example, the publication could be on a taxi driver's phone and the subscription on a passenger's phone, so that the passenger can see available drivers within a range of 3'000 meters. 

Another example could be a publication with promotion information that is attached to a location which expires after 5 hours, and a subscription could be attached to a customer's phone which will get a notification if he or she is near the location before the publication expires.

The last example could be a publication attached to a phone that adjusts the heating when you leave and enter the house.

Possibilities are endless.

Full code of demo described above is [here](https://github.com/matchmore/tech-blog/tree/master/20180329/code).
