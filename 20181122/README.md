In my previous blog post, I showed you [how to create a simple location-based News App on Android using Matchmore SDK and Kotlin](https://blog.matchmore.io/getting-started-with-matchmore-a-proximity-detection-based-location-app-with-kotlin/). Today, we're going to create a location-based app with additional functionalities from scratch. To make the app richer, we will add a real-world context by integrating beacons. 

We will create an event app which can be used for a festival, or any other event including tons of people. Let's call the app __Matchmore Festival__! Don't forget to have a look at our previous blog post for events where we outline [smart location-based functionalities for event mobile apps](http://blog.matchmore.io/smart-location-based-functionalities-for-event-mobile-apps/). 

But for now, grab a beer or a coffee and let's start! 

## Goal of the app
In our app, we will focus on two main functionalities: 
* The first one will embed a __Find my friends__ function. With our app, the user is be able to create a cluster, or join an existing cluster. The users will then broadcast their positions to their friends in a predefined area.
* The second one will be a __Festival Guide__ which will allow the users to receive information about nearby food stands in a festival area. In this case, we suppose that each stand has a beacon in order to get a proximity event (discounts, number of people in a waiting line,...)

## Requirements
For you to move on smoothly with this tutorial, you should have some basic knowledge of Kotlin. If you are used to Java, you can find some good tutorials on how to switch from Java to Kotlin [here](http://developer.android.com/kotlin/get-started#java). You are also expected to have:

* Android Studio with Kotlin support installed on your computer. Download Android Studio for free [here](http://developer.android.com/studio/).
* A Matchmore account to start using the service. You can register for free [here](https://matchmore.io/account/register/).
* At least two Android phones running on Android 6.0+ (API level 23), if you want to test the app in real life. Else, you can test it via the Android Emulator.
* Creativity! This blog post will guide you through the potential of using Matchmore for your location-based app. You are intended to improve the layouts and the scenario in order to adapt it to your own needs.

## Setting up the tools
On Android Studio, create a new android project with an empty activity. We will call our project _Event_. In order to start creating our app, we have to set up the tools that we are going to use. In this project, we will use the recommended way to check the permissions, the Matchmore Android SDK and Google Maps SDK as a mapping service.

### Check permissions
Since our project will be highly location's dependant, we have to ensure that the app have all the permissions required to work properly. In order to do that, we will edit the Android Manifest to add the permissions we will need. In the project navigator, edit the `Manifest` file by adding these lines:

```XML
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
```


### Matchmore Android SDK
To start using Matchmore in your project, you have to [create an account](http://matchmore.io/account/register/) on the portal. After you have created an account, you have to create a new app and get the API key.
![create-app-1](/content/images/2018/09/create-app-1.gif)
Once it's done, you have to edit your top-level gradle file (`build.gradle (project: Event)`) and add this line in the repositories:
``` Gradle
maven {url "https://jitpack.io"}
```
Then, in the module's `build.gradle` file, add the dependencies of Matchmore:
``` gradle
//for SDK
    implementation 'com.github.matchmore.android-sdk:sdk:0.7.0'
    implementation 'com.github.matchmore.android-sdk:rx:0.7.0'
```
In your source code, please make sure to always setting up Matchmore's SDK before using the tool. In order to do it, we have to create a function called `confMatchmore` that we are going to call everytime we need to use the Matchmore's SDK:
```kotlin
fun confMatchmore() {
        val API_KEY =
  YOUR_API_KEY"
        if (!Matchmore.isConfigured()) {
            Matchmore.config(this, API_KEY, true)
        }
    }
```

### Maps SDK


__Google Maps__ is a commercial mapping platform developped by Google. It allows us to create customized maps. To use the Maps SDK, we need to follow the steps below:

1. Add Google Play services to Android Studio:
    - Open the `build.gradle file` inside your application module directory.
    - Add a new build rule under dependencies for the latest version of play-services, using one of the APIs listed below.
    - Ensure that your top-level `build.gradle` contains a reference to the google() repo or to maven ```{ url "https://maven.google.com" }```
    - Save the changes, and click __Sync Project with Gradle Files__ in the toolbar
2. Create a Google Maps Activity named live, then follow the instructions in the `google_maps_api.xml` file to add a Google Maps API key. This new activity will be use later in this tutorial.

## Layout's overview
First of all, we have to create the layouts of the app. Since it's not the main goal of this blog post, I will make it as simple as possible. You can download the layouts on the link below:

https://github.com/alphasldiallo/Find-your-friends-Kt/tree/master/app/src/main/res/layout

The overall project UI should look like this:

![schema_design_horizontal-copy](/content/images/2018/11/schema_design_horizontal-copy.png)

**The path throughout this app will be the following:**
On the landing page, the user have to select a functionality. Either he chooses a find your friends function or decides to go for the festival guide.

*Find your friends*

1. If the users choose to go for the _Find your friends_ option, they will identify themselves and provide their group name. The group name will be use to make the pub/sub that will allow us to create a match between the users.

2. When there is a match between the users based on their group name, we can collect their information such as their GPS position and broadcast them on a map.

*Festival guide*

1. The Festival guide is expected to be as simple as possible. The main purpose of this part is to learn how to integrate and use the beacons.

2. In this step, we will show you how to setup the beacons and how to use them in your app. After setting them up, we will advert information based on the proximity of the user's phone and the beacons. For this part, we will only need one layout:
    - This layout will show the information linked to the close beacons

In summary, we will have 4 layouts:
- 1 layout for the homepage
- 2 layouts for the **Find your friends** functionnality: One called _setup_ and the other one called _live_
- 1 layout for the **festival guide**

# Building the layouts
Basically, our landing page will contain of two main buttons which will redirect us either on the *Find your friends* functionality or on the *Festival guide*. I created a simple layout for the landing page.

```XML
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".Home">


    <ImageView
        android:id="@+id/background"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:alpha="0.3"
        android:background="@drawable/applause"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintCircleRadius="8dp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:layout_marginEnd="36dp"
        android:layout_marginTop="71dp"
        android:fontFamily="@font/lobster"
        android:text="Matchmore Festival"
        android:textColor="@android:color/black"
        android:textSize="35sp"
        app:layout_constraintBottom_toTopOf="@+id/subtitle"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/subtitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="72dp"
        android:text="Rock your life !"
        android:textSize="17sp"
        app:layout_constraintBottom_toTopOf="@+id/findFriends"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.501"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/title" />

    <Button
        android:id="@+id/touringGuide"
        android:layout_width="200dp"
        android:layout_height="45dp"
        android:layout_marginBottom="189dp"
        android:background="@drawable/button"
        android:fontFamily="@font/montserrat"
        android:padding="10dp"
        android:text="Festival Guide"
        android:textAlignment="center"
        android:textAllCaps="false"
        android:textColor="@color/white"
        android:textSize="17dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/findFriends" />
    
    <Button
        android:id="@+id/findFriends"
        android:layout_width="200dp"
        android:layout_height="45dp"
        android:layout_marginBottom="30dp"
        android:background="@drawable/button"
        android:fontFamily="@font/montserrat"
        android:padding="10dp"
        android:text="Find your friends"
        android:textAlignment="center"
        android:textAllCaps="false"
        android:textColor="@color/white"
        android:textSize="17dp"
        app:layout_constraintBottom_toTopOf="@+id/touringGuide"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/subtitle" />
</android.support.constraint.ConstraintLayout>
```
Do not hesitate to take a look at the other layouts on [this link] (https://github.com/alphasldiallo/Find-your-friends-Kt/tree/master/app/src/main/res/layout)

# Part I: Find your friends
The goal of this functionality is to help the user to find his/her friends within a particular range. The user wil also be able to receive a notification when one of his/her friend enters the predefined range. 

To achieve that, we have to create clusters of people who are friends. The user will only be able to detect people if they are members of the same cluster. To make it simple, we will allow any user to join any group just by typing the groupname in the corresponding textfield. In order to identify each user on a map, we will ask them to add before joining a group.

Once it's done, we will use the information sent by the users to broadcast their position on a map. But before starting, we need to make sure that we have all the required permissions to get the user location.

To request the user's permission, we can refer to the following Google's guideline: https://developer.android.com/training/permissions/requesting
After requesting the permissions, we can create a function to handle the permissions request response:

```Kotlin

override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>, grantResults: IntArray
    ) {
        when (requestCode) {
            MY_PERMISSIONS_REQUEST_LOCATION -> {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    // permission was granted, yay! Do the
                    // location-related task you need to do.
                    if (ContextCompat.checkSelfPermission(
                            this,
                            Manifest.permission.ACCESS_FINE_LOCATION
                        ) == PackageManager.PERMISSION_GRANTED
                    ) {
                        Matchmore.instance.apply {
                            startUpdatingLocation()
                            startRanging()
                        }
                    }
                } else {
                    Toast.makeText(this, "Permission denied", Toast.LENGTH_LONG)
                }
                return
            }
        }
    }
```
If the required permissions are granted, we start updating the device location.


After building the layouts and setting up the permissions, we can broadcast the user's location and listen if there's a user with the same groupname in the device's range.
To do so, we have to create a publication with the groupname as a topic and the username as an optional argument:
```Kotlin
private fun createPub(groupName: String, username: String) {
        Log.d(TAG, "create Pub")

        // We consider a cluster as being a publication with his ID as a property
        Matchmore.instance.apply {
            startUsingMainDevice({ d ->
                val PUB = Publication(groupName, 5000.0, 172800.0)
                PUB.properties = hashMapOf("created_by" to username)
                PUB.properties = hashMapOf("created_by" to username)
                Matchmore.instance.createPublicationForMainDevice(
                    PUB, { result ->
                        Toast.makeText(this@Live, "Refreshing...", Toast.LENGTH_LONG).show()
                        Log.d(TAG, "Publication made successfully: " + PUB.toString())
                    }, Throwable::printStackTrace
                )
            })
        }
    }
```
As you can see, we created a publication that will last for 2 days (172 800 seconds) and within a wide range (5 000 m). Feel free to edit the values depending on your needs. 

Once the publication is made, we can subscribe to any publication which correspond to our criterias such as the location and the group name. In order to do that, we have to create a subscription to the groupname:
```Kotlin
private fun createSub(groupName: String) {
        // The subscription is use to find the other devices
        // This subscription, used as an acknowledgement will embed the cluster ID in his topic
        Matchmore.instance.apply {
            startUsingMainDevice({ d ->
                // Duration set to 2 days
                val SUBSCRIPTION = Subscription(groupName, 5000.0, 172800.0)
                SUBSCRIPTION.matchDTL = 5.0
                Matchmore.instance.createSubscriptionForMainDevice(SUBSCRIPTION, { result ->
                    Log.d(TAG, "Subscription made successfully on topic ${result.topic}")
                }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }
    }

```
The parameter `matchDTL` (in meter) says if the subscription will get a match again when the position of publication or subscription changes.

When everything is done, we can start getting some matches by calling this function:
```Kotlin

    private fun getMatches(groupName: String) {
        val LISTVIEW = findViewById<ListView>(R.id.list_members)
        var buddy: String
        var buddy_location: String
        var person = HashMap<String, Marker>()

        // Empty Array that will be used to store the properties of the publications
        var location: ArrayList<String> = ArrayList()
        
        Matchmore.instance.apply {
            // Start fetching matches
            matchMonitor.addOnMatchListener { matches, _ ->
                // We should get there every time a match occur

                var rsl: ArrayList<String> = ArrayList()
                Log.d(TAG, "We got ${matches.size} matches")

                // Select Distinct in order to take only the relevant matches only once
                var m = matches.distinctBy { it.publication!!.properties["created_by"] }

                for (it in m) {
                    if ((it.publication!!.topic.toString()).equals(groupName)) {

                        // Let's fill our Array with the properties of the publication
                        buddy = it.publication!!.properties["created_by"].toString()
                        Log.d(TAG, "created by " + buddy)

                        buddy_location = it.publication!!.location.toString()
                        rsl.add(buddy)
                        location.add(buddy_location)

                        var adapter = ArrayAdapter(this@Live, android.R.layout.simple_list_item_1, rsl)
                        LISTVIEW.adapter = adapter

                        // Let's put the data on a map
                        var positionLat = it.publication!!.location!!.latitude
                        var positionLong = it.publication!!.location!!.longitude
                        var latLong: LatLng = LatLng(positionLat!!, positionLong!!)

                        val MARKEROPTIONS = MarkerOptions().position(latLong).title(buddy).snippet("Team Member")
                        val CAMERAPOSITION = CameraPosition.Builder()
                            .target(latLong)
                            .zoom(18f)                   // Sets the zoom
                            .bearing(90f)                // Sets the orientation of the camera to east
                            .tilt(60f)                   // Sets the tilt of the camera to 30 degrees
                            .build()

                        mMap.animateCamera(CameraUpdateFactory.newCameraPosition(CAMERAPOSITION))

                        if (person.containsKey(buddy)) {
                            Log.d(TAG, "updating marker")
                            val OLDMARKER: Marker? = person[buddy]
                            OLDMARKER!!.remove()
                            var newMarker = mMap.addMarker(MARKEROPTIONS)
                            person.replace(buddy, newMarker)
                            Log.d("debug - Position of it1 = ", person[buddy]!!.position.toString())
                        } else {
                            val MARKER = mMap.addMarker(MARKEROPTIONS)
                            Log.d(TAG, "Creating a new Marker " + buddy + " " + MARKER)
                            person.put(buddy, MARKER)
                        }
                    }
                }
            }
            matchMonitor.startPollingMatches(5000)
        }
    }
    
```


# Part II: Festival Guide
As explained before, the second functionality of our sample app is a festival guide that will allow the user to get information on shops along a festival journey. The main purpose of this part is to show you how to set up the beacons and integrate them with Matchmore. Here we go!

1. Creating the layouts

The only functionality of this guide will be to show some information about a shop. We will use some basics informations like:
- The name of the shop
- A description
- List of the most sold items
- A picture

Many other functionalities could be added such as the number of people close to the shop, the average waiting time,... Be creative, I let you think about it.

Since formatting is not our priority, we will add a simple list to our layout. This list will be populated every time a new shop is detected nearby.

## Set up the beacons
Before using the beacons, you need to register your beacon devices on the portal. After logging in, click on [Beacons](https://matchmore.io/account/beacons/) and register a new beacon by adding the beacon's name, its UUID, Major and Minor. 
Then you will have to link each beacon that you need to your app. Click on the app link in the menu, add the registered beacon in the appropriate space (Attached beacons) by clicking on this button ![Screenshot-2018-11-19-at-12.13.52](/content/images/2018/11/Screenshot-2018-11-19-at-12.13.52.png)

## Add data to the beacons

For our scenario, let's assume that there is a beacon placed at the entrance of each shop. Every beacon will be linked to specific information. Using Matchmore, these information will be advert through publications in the properties. 
To create a publication on a beacon, go on the portal, then click on the Tools, then __Create a publication__. Set up a topic, the range, the duration and the properties of your publication. Please, be aware of the maximum range of your beacon before setting up the range in the publication.
The aspect of the publication attached on the beacons should look like this:
```JSON
{
    "duration": 300,
    "id": "7a7d994d-7fd5-4d9e-b600-f136f2bd1095",
    "properties": {
        "shop_name": "Bio Shop",
        "description": "We offer a varied choice of vegan products, gluten-free and lactose-free under special diets!",
        "img_url": "https://cdn.pixabay.com/photo/2016/07/22/09/59/fruit-1534494_960_720.jpg"
    },
    "range": 100,
    "createdAt": 1542648138588,
    "topic": "beacon131",
    "deviceId": "6084885b-9cae-4154-9023-26fda308a39a"
}
```
You can also create a publication and attach it to your beacon with HTTP requests using CURL. Take a look at this blog post for more details: https://blog.matchmore.io/how-to-use-beacons-with-matchmore/

After setting up the beacons and discovering how they work, we can keep working on our app.
To get the information sent by the beacons, we have to create a subscription based on the topic that we want to use.
```Kotlin
Matchmore.instance.apply {
            startUsingMainDevice({ device ->
                val SUBSCRIPTION = Subscription("beacon131", 500.0, 300.0)
                createSubscriptionForMainDevice(SUBSCRIPTION, {
                    Log.d("debug", "Subscription made successfully on this device ${device.id}")
                }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }

```

When it's done, we can start getting the matches when we cross a beacon's range which have our linked publication if they share the same topic. The getMatches() function will look like the first one that we used on our findYourFriend part:
```
        private fun getMatches() {
        var rsl: ArrayList<String> = ArrayList()
        val LISTVIEW = findViewById<ListView>(R.id.cv)
        Matchmore.instance.apply {
            // Start fetching matches
            matchMonitor.addOnMatchListener { matches, _ ->
                // We should get there every time a match occur
                Log.d("debug", "We got ${matches.size} matches")
                val FIRST = matches.first()

                // Let's fill our Array with the properties of the publication
                rsl.add(FIRST.publication!!.toString())

                var a1 = ArrayList<Shop>()
                var s1 = Shop()
                s1.shop_name = FIRST.publication!!.properties["shop_name"] as String
                s1.description = FIRST.publication!!.properties["description"] as String
                s1.img_url = FIRST.publication!!.properties["img_url"] as String

                a1.add(s1)

                val ADAPTER = BeaconAdapter(this@TouringGuide, a1)
                LISTVIEW.adapter = ADAPTER
                LISTVIEW.setOnItemClickListener { parent, view, position, id ->
                    Toast.makeText(this@TouringGuide, view.toString(), Toast.LENGTH_SHORT).show()
                }
            }
            matchMonitor.startPollingMatches(1000)
        }
    }
```

<br>
**HERE I WILL ADD THE OFFICIAL GIT REPO ONCE IT'S VALIDATED**
<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>