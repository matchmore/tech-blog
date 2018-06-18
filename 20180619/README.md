# Quick and easy way to start with Matchmore: React-native

We already showed you how to do it in Swift iOS, now it is time for the new kid on the block: _React-Native_.
After this you will have a good understanding how to make your own Dating App with Matchmore!

Before starting, it will be beneficial to have some React Native know-how before. And we will use Yarn!

Lets start of with creating a React-Native app

```
react-native init DatingApp
cd DatingApp
react-native run-ios --simulator
```

And you should see the normal Welcome screen

![welcome](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180619/img/1-welcome.png "welcome")

Now lets add Matchmore into the mix!

## Install the Matchmore SDK

```
yarn add "@matchmore/matchmore"
```

## Get API key

Now let's create a new application on Matchmore Portal and obtain the API key that we will use to configure SDK later on.
After logging in ([register for free here](http://matchmore.com/account/register/)) you do the following:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/create-app.gif "create app")

## Setup persistence

You need to wire in the persistence, of your choice.

It is small, for example for React-Native it would look like this

```javascript
const { AsyncStorage } = require("react-native");

const save = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const load = async key => {
  return await AsyncStorage.getItem(key);
};

const remove = async key => {
  return await AsyncStorage.removeItem(key);
};

module.exports = {
  save,
  load,
  remove
};
```

Save this file as a `storage.js`.
You can find these snippets [here](https://github.com/matchmore/js-sdk/tree/master/platform).

This will be used later in while wiring the manager.

## Setup the manager

For simplicity, we will do everything in the App.js file, so lets setup _Matchmore_!

In your App.js add these imports

```javascript
import { Manager, LocalStoragePersistenceManager } from "@matchmore/matchmore";
import "./storage";
```

Put somewhere you Api key handy like

```javascript
const apiKey = "YOUR_API_KEY";
```

Now on the start of the application we should initialize the manager and wire in the persistence.

In our App component let do

```javascript
async componentDidMount() {
    PlatformConfig.storage = Storage;
    const localPersistenceManager = new LocalStoragePersistenceManager();
    await localPersistenceManager.load();
    this.manager = new Manager(
      apiKey, undefined, localPersistenceManager
    );
  }
```

And we need to setup our device as the _main device_, first created device is our main.

```javascript
let myDevice = await this.manager.createMobileDevice(
    "me", //your device name, specific for the application
    "ios", //platform
    "DEVICE_TOKEN"); //token to route matches, like apns, fcm, websockets
```

## Make it work!

Great! Now we are up and running!
Now, we would want to know who is nearby, to do that, lets create a subscription.

```javascript
let datingSubscription = await this.manager.createSubscription(
      "Dating App", //topic specific to your applications, you can have multiple topic per app, it is up to you how will you model it, we will provide some insights about this soon
      10000, //range of subscriptions in meters, lets start of with 10km
      86400, //duration of how long the subscription will last, in seconds, lets put in 24 hours
      "age >= 18" // matching selector
    );
```

The matching selector is a selector which will filter out only publications which you are interested in. Think of it as SQL for publications you will receive! Here we are saying we are looking only for publications with a property `age` greater or equal.

Cool! Now we are waiting for that one! But we are missing one thing... We need to go out too! We need to _Publish_ ourself! Lets create a Publication!

```javascript
let datingPublication = await this.manager.createPublication(
      "Dating App",
      10000, //m
      86400, //s
      {age: 29, name: "Lucas"} //publication properties
);
```

As we mentioned before, publication properties are the data we want to be searched by, our interests, picture url, age... whatever makes sense for your app.

Ok, lets be real - we are just starting, nobody is our there, we need to create some "people" to test our and develop against.

We can create virtual pins, which here we will mimic other people looking for their second half.

```javascript
async makePerson(name, properties) {
    let pin = await this.manager.createPinDevice(`pin-${name}`, this.state.coords);
    let publication = await this.manager.createPublication(
      "Dating App",
      10000, //m
      86400, //s
      properties,
      pin.id //last argument is explicit device id to which we with to attach the publication or subscription
    );
}
```

Ok, pins are static usually, and the need a location, lets cheat a little and supply our own location.

Lets add a placeholder for our state.

```javascript
  constructor(props) {
    super(props);
    this.state = {
      coords: {},
    };
  }
```

And attach our self to the listener and when we will know were we are, lets create pins and publications

```javascript
this.manager.onLocationUpdate = async location => {
  this.setState({ coords: location.coords });
  await this.makePerson("clara", { name: "Clara", age: 18 });
  await this.makePerson("sam", { name: "Sam", age: 24 });
  await this.makePerson("alex", { name: "Alex", age: 23 });
  await this.makePerson("clover", { name: "Clover", age: 27 });
};
```

Now we have "people" around. We can wait for matches!
We usually should do that at the very beginning just after setting up the main device, but lets do it now.

```javascript
this.manager.startMonitoringMatches();
this.manager.onMatch = match => {
  this.setState(previousState => {
    return { matches: [...previousState.matches, match] };
  });
};
```

Now we are rolling! Every time we get a match we will fire the closure which will update our component state.
Now what are matches?
Bluntly speaking its _publication_ + _subscription_ + _match id_.

So when you get a match, then it will have a publication field, and it will have _properties_.

What are properties again?

```json
{ "name": "Clover", "age": 27 }
```

What we can do with this knowledge? Show it to the user!

Lets modify the `render` function.

```javascript
render() {
    return (
      <View style={styles.container}>
        {this.state.matches.map(match => (
          <Text key={match.id}>Matched with {match.publication.properties.name}!</Text>
        ))}
      </View>
    );
  }
```

When we run the app, we see

![matches](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180619/img/2-matches.png "matches")

Ok, so what does it mean:

- We get our own publication
- We get we got some of them multiple times

This is because we check publication and subscriptions multiple times, on every location update.

Lets reduce the duplications.
First lets remove our self.

We will refactor the publication code to look like the following

```javascript
let pub = this.manager.publications.find(
   pub => pub.properties.name == "Lucas"
);
if (!pub) {
  this.datingPublication = await this.manager.createPublication(
    "Dating App",
    10000, //m
    86400, //s
    { age: 29, name: "Lucas" } //publication properties
  );
} else {
  this.datingPublication = pub;
}

if (this.manager.subscriptions.length == 0) {
  this.datingSubscription = await this.manager.createSubscription(
    "Dating App",
    10000, //m
    86400, //s
    "age >= 18" // matching selector
  );
} else {
  this.datingSubscription = this.manager.subscriptions[0];
}
```

The manager instance has `publications`, `subscription` and `devices` properties, which let us access locally cached entities.

Now we can use the `datingPublication` to filter out the received matches.

Next step is reduce our duplicate potential dates.

Lets filter out only the ones tied to our publication.

```javascript
this.manager.onMatch = match => {
  if (
    match.publication.id == this.datingPublication.id &&
    match.subscription.id == this.datingSubscription.id
  )
    return;
  if (match.subscription.id != this.datingSubscription.id) return;
  let alreadyExists = this.state.matches.filter(
    m => m.publication.id == match.publication.id
  );
  if (alreadyExists.length > 0) return;

  this.setState(previousState => {
    return { matches: [...previousState.matches, match] };
  });
};
```

Now we got only the matches which are relevant for out application.

## Lets make it nice

Lets add a pictures to our dates(we will use awesome (Pexels.com)[https.pexels.com])

We put the image url into properties of a publications. These are for querying but also for putting some data for your app to work with.

```json
{
  "name": "Clover",
  "age": 27,
  "img":
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?auto=compress&cs=tinysrgb&h=426&w=645"
}
```

And lets use some React Native components

```javascript
 render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.matches.map(m => {
            m.key = m.id;
            return m;
          })}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                style={styles.image}
                source={{ uri: item.publication.properties.img }}
              />
              <Text style={styles.label}>{item.publication.properties.name}</Text>
            </View>
          )}
        />
      </View>
    );
  }
//...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  label: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  item: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
    height: 144
  },

  image: { width: 144, height: 144 }
});
```

And we get a nice looking list which is live updated with your local potential dates

![list](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180619/img/3-list.png "list")

Really easy! You can go and review the code of the app we made [here](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180619).

Happy coding!