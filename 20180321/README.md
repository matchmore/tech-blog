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
```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  let config = MatchMoreConfig(apiKey: "paste_API_key_from_portal_here")
  MatchMore.configure(config)

  return true
}
```

also, I have to add `import AlpsSDK` import at the top of `AppDelegate.swift` file.
