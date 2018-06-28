# Simple mobile app for android

In my previous post, I described how to set up Matchmore integration for iOS (link here), in this post I will show you how to use Matchmore SDK on Android.

## Get API key

As for iOS, you will need an API key, to get it login into your Matchmore account:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/create-app.gif "create app")

## Android studio mobile app

Let's create new Android studio project with Kotlin support, Set minimum SDK to Phone and Tablet `API 22` and add empty Activity.
Next lets edit `build.gradle` file for module app and add dependencies for Matchmore SDK.

```
    //for SDK
    implementation 'com.github.matchmore.android-sdk:sdk:0.7.0'
    implementation 'com.github.matchmore.android-sdk:rx:0.7.0'
    //for permissions
    implementation 'gun0912.ted:tedpermission:2.2.0'
```
After you save the changes Android studio will ask you if you want to sync the project, click yes.

## SDK configuration

Next, you have to configure SDK with your API key, and you can do this in `onCreate` method of main activity of your app.

```kotlin
    private val API_KEY = "key_here"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Matchmore.config(context = this, apiKey = API_KEY, debugLog = false)
    }
```

## Simple UI

Now let's create a view with two buttons and a label to make testing easier.
It can look like this:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180710/8.png "simple view")

## Main device setup

Before you will be able to create publication or subscription you have to have a device that you can attach them on. For that, you will use device representing your mobile phone.
While setting up the primary device for your phone, you can also set up match listener - the function that application calls when there is a match between publication and subscription.
The code may look like this:

```kotlin
private fun setupDevice() {
        Matchmore.instance.apply {
            startUsingMainDevice({ device ->
                Log.i(TAG, "start using main device ${device.name} ${device.id}")
                // Start fetching matches
                matchMonitor.addOnMatchListener { matches, _ ->
                    Log.i(TAG, "Matches found: ${matches.size}")
                    matches.map { m -> Log.i(TAG, "${m.createdAt}") }
                    matchText?.text = "⛰️got ${matches.size} matches⛰️"
                }
                matchMonitor.startPollingMatches(1000)
            }, Throwable::printStackTrace)
        }
    }
```

The registered listener will change the text of the label in your UI to the number of matches that your app received.

## Create publication and subscription

Now you are ready to create publication:

```kotlin
    fun addPub() {
        Matchmore.instance.apply {
            val publication = Publication("Test Topic", 2.0, 600.0)
            publication.properties = hashMapOf("color" to "red")
            createPublicationForMainDevice(publication, { result ->
                Log.i(TAG, "Publication created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }
```

This creates a publication on the primary device with a range of 2 meters and 10 minutes duration, and this publication will have property color set to red.
You set this method as on click listener for publish button.

Next, create a similar method for subscription:

```kotlin
    fun addSub() {
        Matchmore.instance.apply {
            val subscription = Subscription("Test Topic", 2.0, 600.0)
            subscription.selector = "color = 'red'"
            createSubscriptionForMainDevice(subscription, { result ->
                Log.i(TAG, "Subscription created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }
```

Subscription does not have properties instead it has selector which uses SQL like syntax to define which publication will match with this subscription.
If the match happens, a device with given subscription will get it.

As both publication and subscription are on the same topic and properties in publication satisfies conditions in subscription selector we should get a match.
Since match for a mobile device is calculated based on its location, the last thing to do is to start updating phone location base on GPS.
But to get that information we have to request for GPC permission first, for that you have to add you can use `tedpermissions` and code can look like this:

```kotlin
private fun checkLocationPermission() {
        val permissionListener = object : PermissionListener {
            @SuppressLint("MissingPermission")
            override fun onPermissionGranted() {
                Matchmore.instance.apply {
                    startUpdatingLocation()
                    startRanging()
                }
            }

            override fun onPermissionDenied(deniedPermissions: ArrayList<String>) {
                Toast.makeText(this@MainActivity, R.string.if_you_reject, Toast.LENGTH_SHORT).show()
            }
        }
        TedPermission.with(this)
                .setPermissionListener(permissionListener)
                .setDeniedMessage(R.string.if_you_reject)
                .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
                .check()
    }
```

This method also starts location updates and beacons ranging (in case you want to use publications attached to iBeacons).
Since publication and subscription are created on the same device, the distance between them is 0 meters so they will match instantly.

Now let's hook up everything together, this is how onCreate looks like:

```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Matchmore.config(context = this, apiKey = API_KEY, debugLog = false)
        val pub_btn = findViewById(R.id.pub) as Button
        val sub_btn = findViewById(R.id.sub) as Button
        setupDevice()

        pub_btn.setOnClickListener {
            addPub()
        }
        sub_btn.setOnClickListener {
            addSub()
        }
        matchText = findViewById(R.id.match_text) as TextView
        checkLocationPermission()
    }
```

## Final result

Next start application in simulator and check if you got a match:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180710/match.gif "match on simulator")

Android SDK is similar to iOS SDK and as you saw easy to use, happy hacking and see you in next post.

Code for the post is [here](https://github.com/matchmore/tech-blog/tree/master/20180710/MyApplication)