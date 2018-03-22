# First mobile app with Matchmore

In this post, I will go through setting up an iOS application with Matchmore SDK, from registration on the portal to obtaining a match.

## Befor you start
Matchmore SDK is distributed with cocoapods. It is `pod 'AlpsSDK', '~> 0.6'`, to install cocoapods execute in terminal:
```
sudo gem install cocoapods
```

## Get API key
Now lets create new application on developer portal and obtain API key that we will later use in SDK.
After loging in (you can register for free) I do:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/create-app.gif "create app")

## Xcode mobile app
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

## SDK configuration
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

## Create publication
Let's write the code that will create publication and subscription after clicking on buttons.

So first I create `IBAction` for publish button:
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

This function will create publication attached to phone location with range 20 meters and duration 100 seconds (this publication will be deleted after 100 seconds). This publication will be on topic `Test Topic` which means that it will only match with subscriptions on the same topic, it also has a property named `test` set to `true`. Publication can have arbitrary number of properties with arbitrary names that can be used to store information and to restrict further when the match should happen by adjusting selector in subscription.

## Create subscription
Next is `IBAction` for subscribe button:
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

This function creates subscription with range 20 meters and duration 100 seconds on topic `Test Topic`. Subscription also have a selector that will allow match only with publications that have property `test` and this property is set to `true`. 
The selector can be more complex than this and contains logical operators lik `and` and `or`.
More complex selector may looks like this: `test = true and (color = 'red' or size > 10)`, it requires additional properties `color` and `size`. 
New thing for subscription is `pusher`, as subscription receives matches we have to set how match will be delivered to mobile device, `ws` means that SDK will use web sockets. Delivery with Apple push notifications and polling is also supported. For this example, I chose web sockets because they require no set up (like APNs certs and so on).

## Handle matches
Now that we can create publications and subscriptions on devices last pice is the code responsible for processing matches that are delivered to the application, in our case, it looks like this:
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

First we implement protocol `MatchDelegate` in `ViewController` and inside `viewDidLoad` define what should happen when the application gets a match (change label text). Next, I am starting the main device that will represent phone on the backend, and after checking that it was created add match delegate, start listening to matches and start sending location updates.

## Test
The scenario is like this
1. Creaet subscription
2. Create publication
3. Move phones/simulators to be no further than 20m from eachother within 100 seconds
4. Obser a match

Now lets start two simulators and check:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/match.gif "match")

The match is instant because both simulators are in the same location.

So what happened on that gif is: first we created a subscription on one phone and then publication on the other phone. Since publication, and subscription ware on the same topic and in range of each other match occurred instantly. The application that created the subscription received the match that contains all information about the publication that was matched including publication properties. We can see how full match looks like in log:

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

## Whats next
So to sum up:

AlpsSDK allow us to easly attach pices of information to phones (also to iBeacons and static locations, but this is for other blog post) in form of publications and query them with subscriptions. Information is deliverd to the device that has subscription when it is in proximity of matching publication. 
One way of simplification is treat publications like database records that are attached to phosocal objects that moves around and are grouped by topic, and subscription is like query that get results in form of match when it is in proximity of publication.
As with database you can model many business cases with publications and subscriptions. For example publication can be on  taxi driver phone and subscription on passanger phone so she can see drivers in range of 3000 meters. Publication can hold promotion information that is attached to location that expires after 5 hours and subscription is on customer phone that will get notification if she is near.

Possibilities are endles.

Full code of demo described above is [here](https://github.com/matchmore/tech-blog/tree/post/match-setup/20180321/code/my-app)
