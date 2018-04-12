# Saving iPhones lives

You probably had battery frustration. New age sickness. Your phone died already several times, right? In the least expected moments. You started to wonder: who's fault is that? You go to the settings looking for the hog. There it is. An application that was doing something in the background, even worse GPS! You take it's permissions back. Now you're safe - never opening the app back again.

But when you are a developer - you don't want above to happen to the app you're working on, but still, you want to give these features, because they're cool and that's reasonable.

What can we do about it?

It appears best practices are out there, but none cares. Here I'd like to take a chance to overview them and apply them to real life scenario. For now only for iOS, but in the next post for Android, eventually ending up with a pretty robust comparison of both.

## What really drains the battery?

A general answer is pretty simple. Every CPU, GPU, disk, camera, GPS or network operation has a direct effect on battery consumption. If a developer sets up a location manager that triggers location update every second, stores in on disk and in addition enqueues API request we will end up with battery killer app. Though - sometimes - you may want something similar to that. For example, an application that records your car mileage or a game such as Pokemon go, where everything is related to you concrete position on a map. But in this scenario phone is either hooked to the car's electric system or a player ends up buying power bank.

The trick is that it takes a small effort to get background permissions on iOS. All you need to do is flick "using location" switch and fill in a couple of description strings.

The important part here is that it's always a good idea to explain the what are you


## How can we measure battery consumption?

In iOS it's quite tricky. There're a couple of solutions available in Cydia, but jailbreaking is less and less popular, making it quite hard to run on newest devices. Also, we could use Xcode's energy impact profiler, but here it might be really tricky to invent proper testing scenarios. Especially when you consider GPS based app that performs requests and receives data depending on its location.

The truth is that the best we can do is to really start using our app as if we were users. In Matchmore we created a number of scenarios and invited every member of the team to participate. Task 
was pretty simple: become one of the users of our app, start be active and see if you receive notifications with valuable data.

The general scenario was pretty simple. Create some offers with tickets you are interested in on your way to work and back home and see if you were able to be notified about them all while using your phone normally as you would.

Beginnings were awful. The first real-life app we developed was a location-based game and default setup of the SDK was updating location every second almost every time talking to our cloud. You can imagine how it went. It was a slaughter. iPhones were dying within hours. Tough to be completely honest with you, we expected that to happen. Having that test we learned how much we can squeeze in in terms of data quality, not caring about battery cost at all. After that our motivation was to figure out the best setup with which we could obtain proper balance. Minimize battery usage and maximize the usefulness of the features. To do so we needed to answer several questions.

## How to analyze your project needs?

We already established, that there're cases like location-based games or live tracking scenarios


## What are the tools to achieve low battery consumption?
