# From 0 to Match - Set Up Everything with Apple Xcode

In this post, I will go through setting up an iOS application with Matchmore SDK, from registration on the portal to obtaining a match.

Matchmore SDK is distributed with cocoapods. It is `pod 'AlpsSDK', '~> 0.6'`, to install cocoapods I can execute in terminal:
```
sudo gem install cocoapods
```

What I have to do is create a new application on developer portal and obtain API key that I will later use in SDK.
After loging in / registering I do:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/post/match-setup/20180321/img/create-app.gif "create app")

Then I create new iOS single view application `my app` in Xcode after that, I go to main application directory (in this case my-app) and execute `pod init` which creates `Podfile` file. To add AlpsSDK to my application, I have to add `pod 'AlpsSDK', '~> 0.6'` to `Podfile` 

After an edit, it may look like this
```
target 'my-app' do
  # Comment the next line if you're not using Swift and don't want to use dynamic frameworks
  use_frameworks!

  pod 'AlpsSDK', '~> 0.6'
```
