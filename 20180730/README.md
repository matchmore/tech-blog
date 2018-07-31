In this post, we'll go through how to create a simple app on Android Studio using Kotlin and Matchmore. The app we'll create is a location-based news app. It will enable news or information to be sent out to people within a defined range of distance. 

As a reminder, Matchmore introduced the notion of [Geomatching](http://blog.matchmore.io/what-is-geomatching/) which is implemented as an extension of the [publish–subscribe messaging pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

> Matchmore extend the publish-subscribe messaging pattern with the ability to filter information not only based on content but also on context: each publication (subscription) is valid for a given duration and within a certain geospatial area, which moves with the publication (subscription) if the corresponding device moves. When a matching publication and subscription have their areas overlaping, a match occurs and the subscriber receives the information.
> 

We are going to use the geomatching functionality of Matchmore to create a simple app that can be used to share news within a defined range. This simple and quite useful app can be used to advert a promotion or to spread news in a school campus.

This blog post will be divided into two parts:
- The first part will explain how to build your UI and how to set up your development environment.
- The second part will focus on how to use Matchmore for a location-based news app.

# Requirements 
- Android Studio with Kotlin support installed on your computer. Download Android Studio for free [here](http://developer.android.com/studio/). 
- Good knowledge of Kotlin. If you are used to Java, you can find some good tutorials on how to switch from Java to Kotlin [here](http://developer.android.com/kotlin/get-started#java). 
- A Matchmore account to start using the service. You can register for free [here](https://matchmore.io/account/register/).
- If you want to test the app in real life, you'll need at least two Android Phones running on Android 4.4+. Else, you can test it via the [Android Emulator](https://developer.android.com/topic/google-play-instant/getting-started/first-instant-app#set-up-emulator).
- Willingness to learn some new stuff.

This blog post is based on the previous tutorial [Create an Android app with Matchmore](https://blog.matchmore.io/first-android-app-with-matchmore/). The previous tutorial contains more details such as how to set up your tools and get the API key. If you feel that this tutorial is too difficult, we advise you to start with the previous one. 

# Part 1: Create the UI

For our project, we are going to create three different activities:
- The first one will be the Main Activity with a simple layout that will have only 2 buttons linked to the 2 other activities.
- The second one will be for the user who wants to advert news. We will make it simple, by adding two text fields and one submit button to the layout. The first text field will set the news title and the second one the news content.
- The third activity will be for the news subscribers and it will display all the news based on the matches gotten by the user.

## Let's start!

- Open Android Studio.
- Create a new project (let's call it `NewsApp`) with an empty activity. Don't forget to check the box related to adding Kotlin Support.

## Main Activity
The main activity will be the landing point of our app. As we want it to be simple, we are only going to add two buttons on the layout.

Each of these buttons will open an activity. In order to do that, we have to add an Intent in `MainActivity.kt`:

```Kotlin
val read= findViewById(R.id.read) as Button
val write= findViewById(R.id.write) as Button
var intent = Intent ()

write.setOnClickListener()
{
    intent.setClass(this, WriteActivity::class.java)
    startActivity(intent)
}
 read.setOnClickListener()
{
    intent.setClass(this, ReadActivity::class.java)
    startActivity(intent)
}  
```

## Write Activity

Now let's move to the `WriteActivity`. This activity will be used to publish news or information. To make the layout as simple as possible, we are just going to add two text fields, a submit button and one TextView. As we said before, one text field will be created for the title and the second one for the news content. The TextView will be used to provide the status of our actions.

_You can find the xml file of the layout on [this link](https://github.com/matchmore/tech-blog/blob/feature/news-app/20180730/app/src/main/res/layout/write.xml)_

The `WriteActivity` will be used by our app to create a location-based publication. In this example, we will set manually the range and the expiry date. However, it's possible to customize the range and expiry date in your app. 

## Read activity
The next activity will mostly be used by the subscribers of our app. The main goal of this activity will be to print out the list of all the matches. When the susbcriber enters into a news post range, there will be an instant match. All the matches will be displayed through this activity.

Just like the others layouts, we are going to make it simple. We will just add a _`list_view`_
```XML
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ReadActivity">

    <ListView
        android:id="@+id/list"
        android:layout_width="368dp"
        android:layout_height="487dp"
        tools:layout_editor_absoluteX="8dp"
        tools:layout_editor_absoluteY="8dp" />

</android.support.constraint.ConstraintLayout>
````

## Connect the UI to the code

Now, we have a minimalist user interface for our application, the next step is to link the UI to the code.

In the `WriteActivity`, we should declare all the UI elements that we are going to use by using this syntax:
`val "val_name" = findViewById("UI Element") as "UI element's type"`

We will repeat the same process for all the other UI elements. At the end, we should have this code:
```kotlin
val title_txt = findViewById(R.id.title) as EditText
val content_txt = findViewById(R.id.content) as EditText
val status_txt = findViewById(R.id.status) as TextView
val submit_btn = findViewById(R.id.submit) as Button
```
We need to create a new `val` that will get the data entered by the user in the two textfields.

```kotlin
val title = title_txt.text
val content = content_txt.text
```

It's almost done now! We have our UI, but it's quite useless for the moment. We will add a listener to our button and trigger an event when the user clicks on it. For that, we will use the code below:
```Kotlin
 submit_btn.setOnClickListener()
        {
        status_txt.setText("Publication made successfully")
        }   
```

In the second part of this blog post, we will create a publication when the user clicks on the submit button.

In the `ReadActivity` we will do the same thing for the ListView. This list will be used to print all the matches that we are going to receive.
```Kotlin
        val listView = findViewById (R.id.list) as ListView
```


# Part 2: Integrate Matchmore

In this second part of the blog post, we are going to integrate Matchmore to our minimalist app. In case you have missed the first part, you can download the code of the app on [this link](https://github.com/matchmore/tech-blog/tree/feature/news-app/20180730).

As a reminder, the goal of our app is to share news within a specific range and with an expiry date. The solution behind this location-based news app could also be used for geofencing marketing. The app would trigger a notification when a potential customer enters a shop, or the area close to the shop, where there is a special discount on a product for example. 

As you will see in the second part of this blog post, we will build our application easily using Matchmore. Here we go!

##Set up the tools

First of all, we have to create an account on Matchmore, sign up for free [here](https://matchmore.io/account/register/). Then we will create a new app and get the API key. See how to get the API key at Matchmore [here](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/create-app.gif). 

Once it's done, we have to edit the top-level gradle file (`build.gradle (project: NewsApp)`) and add this line in the repositories:
```gradle
maven { url "https://jitpack.io" } 
```

Then, we will edit the module's ```build.gradle``` file and add the dependencies of Matchmore and TedPermission:
```gradle
    //for SDK
    implementation 'com.github.matchmore.android-sdk:sdk:0.7.0'
    implementation 'com.github.matchmore.android-sdk:rx:0.7.0'
    //for permissions
    implementation 'gun0912.ted:tedpermission:2.2.0'
```

Add the permission for your app by editing the `AndroidManifest`. In the project navigator, find the file AndroidManifest.xml (App/manifests), double click on it. Then, inside the `<manifest>` tag, add the following lines:
```XML
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Take time to read the article of [Adam Smolarek](https://blog.matchmore.io/author/adam/) about the permission in your app, on this [link](https://blog.matchmore.io/first-android-app-with-matchmore/).

Since Matchmore is built around the publish-subscribe pattern, we must create a new publication in order to share the news. 

Before using Matchmore SDK, we have to configure it by adding these instructions inside each activity where we use Matchmore SDK:
```Kotlin

    val API_KEY = "YOUR-API-KEY"
    if (!Matchmore.isConfigured())
    {
        Matchmore.config(this,API_KEY,false)
    }
```

## Create a publication

A **publication** can be seen as a Java Messaging Service (JMS) publication extended with the notion of geographical zone. This zone is defined by a (center) location and a range around that location.

Our publication will have as arguments:
- The topic of our news (e.g: Campus Info, discount, etc.).
- The range of our publication (in meters).
- The duration: By default, we will do a publication that will last for 1 800 seconds (30 minutes).
- The properties: We can use the properties to pass information between devices when a match occurs. For our case, the properties will be used to send the title and the content of our news.

A publication will be created when the user clicks on the submit button. When the publication is made, we will update the status and inform the user that the publication has been made successful.

```kotlin

submit_btn.setOnClickListener()
        {
            Matchmore.instance.apply {
                startUsingMainDevice ({ _ ->
                val pub = Publication("news", 500.0, 180.0)
                    pub.properties = hashMapOf("title" to title.toString(), "content" to content.toString())
                    createPublicationForMainDevice(pub,
                            { result ->
                        Log.d("debug","Publication made successfully")
                        status_txt.setText("Publication made successfully")
                    }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }
    }
```

This will create a publication with a range of 500 meters around the user's device and the publication will expire after 180 seconds.

## Create a subscription
The subscription will be created with the same principles. Each subscription need to have at least a topic, a range and a duration.

When a subscriber enters inside a publication's range, if they have the same topic, a match will occurs. Since we are going the add a subscription and list the matches in the same activity, we will separate these two parts in our code and create two separate functions: addSub() and checkMatches().

Just like the publications, to create a subscription, we will use the following code:

```kotlin
private fun addSub()
{
        Matchmore.instance.apply {
            startUsingMainDevice ({ device ->
            val sub = Subscription ("news", 500.0, 180.0)
            createSubscriptionForMainDevice(sub, {result ->
                Log.d("debug", "Subscription made successfully with ID ${result.deviceId}")

            }, Throwable::printStackTrace)
        }, Throwable::printStackTrace)
    }
}
```
Please make sure to have the same topic as the publication!

##Handle the matches
Once it's done, we will create a new function that will check the matches with a refreshing time that we will define. If there is a match, we will collect the properties of our publication and insert them in our listView 

This is the code that we will use:

```kotlin
 private fun checkMatches() {
        //Declare our ListView
        val listView = findViewById (R.id.list) as ListView
        
        // Empty Array that will used to store the properties of the publications
        var rsl: ArrayList<String> = ArrayList()

Matchmore.instance.apply {
    startUsingMainDevice({ _ ->
        matchMonitor.addOnMatchListener { matches, _ ->
        
        //We should get there every time a match occur
        Log.d("debug", "We got ${matches.size} matches")
        val first = matches.first()
        
        //Let's fill our Array with the properties of the publication
        rsl.add(first.publication!!.properties["content"].toString())
    
val adapter = ArrayAdapter(this@ReadActivity, android.R.layout.simple_list_item_1, rsl)
            listView.adapter = adapter
        }
matchMonitor.startPollingMatches(1000)
    }, Throwable::printStackTrace)

        }
    }
```

The purpose of this function is to receive the matches and to extract what we need in the ListView.

The steps to get a match are:
1. Start using the device.
2. Set a MatchListener: Just like the `clickListener` that we set up before, the MatchListener will be triggered every time when there is a match.  
3. Browse the matches: As a Set Collection are unordered, `matches` will collect all the matches and put them into a collection. We will use the `.first` method to get the most recent match.     
4. Populate: Since we have the most recent match, we can add the information that we need into the ArrayList `rsl` that we have created by adding a new row.
 
5. ```startPollingMatches(1000)``` is used to interrogate Matchmore regularly depending on the refreshing time that we sets up. The argument of startPollingMatches is set in milliseconds.

Our `onCreate` method should now looks like this:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.read)

        if (!Matchmore.isConfigured())
        {
            Matchmore.config(this, API_KEY, false)
        }
        checkLocationPermission()
        addSub()
        checkMatches()
}
```

I hope you enjoyed this blog post! Don't hesitate to take a look at the code of this app at [Github](https://github.com/matchmore/tech-blog/tree/feature/news-app/20180730).

If you have any questions, feel free to contact [me](alpha.diallo@matchmore.com) by email or on [Gitter](https://gitter.im/matchmore).

