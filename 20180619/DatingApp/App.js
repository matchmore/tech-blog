/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Image
} from "react-native";

import {
  Manager,
  LocalStoragePersistenceManager,
  PlatformConfig
} from "@matchmore/matchmore";
import Storage from "./storage";

const apiKey =
  "YOUR_API_KEY";

type Props = {};
export default class App extends Component<Props> {
  manager = null;
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      coords: false
    };
  }

  async componentDidMount() {
    PlatformConfig.storage = Storage;
    const localPersistenceManager = new LocalStoragePersistenceManager();
    await localPersistenceManager.load();
    this.manager = new Manager(apiKey, undefined, localPersistenceManager);

    if (!this.manager.defaultDevice)
      await this.manager.createMobileDevice(
        "me",
        "my iphone",
        "TOKEN FOR MATCH DELIVERY"
      );

    this.manager.startUpdatingLocation();
  }

  onStartMatches = async () => {
    if (this.manager.subscriptions.length == 0) {
      this.datingSubscription = await this.manager.createSubscription(
        "Dating App", //topic specific to your applications, you can have multiple topic per app, it is up to you how will you model it, we will provide some insights about this soon
        10000, //range of subscriptions in meters, lets start of with 10km
        1000, //duration of how long the subscription will last, in seconds, lets put in 24 hours
        "age >= 18" // matching selector
      );
    } else {
      this.datingSubscription = this.manager.subscriptions[0];
    }

    let pub = this.manager.publications.find(
      pub => pub.properties.name == "Lucas"
    );
    if (!pub) {
      this.datingPublication = await this.manager.createPublication(
        "Dating App",
        10000, //m
        1000, //s
        { age: 29, name: "Lucas" } //publication properties
      );
    } else {
      console.log("Publication already setup!");
      this.datingPublication = pub;
    }

    this.manager.startMonitoringMatches();
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

      console.log(match);
      this.setState(previousState => {
        return { matches: [...previousState.matches, match] };
      });
    };

    this.manager.onLocationUpdate = async location => {
      this.setState(_ => {
        coords: location.coords;
      });
      this.setupPins(location);
    };
    console.log(this.manager.publications);
  };

  async setupPins(location) {
    if (!this.manager.devices.find(device => device.name == "pin-clara")) {
      console.log("Setting up pins");
      await this.makePerson(
        "clara",
        {
          name: "Clara",
          age: 18,
          img:
            "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?auto=compress&cs=tinysrgb&h=426&w=645"
        },
        location
      );
      await this.makePerson(
        "sam",
        {
          name: "Sam",
          age: 24,
          img:
            "https://images.pexels.com/photos/756453/pexels-photo-756453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=426&w=645"
        },
        location
      );
      await this.makePerson(
        "alex",
        {
          name: "Alex",
          age: 23,
          img:
            "https://images.pexels.com/photos/555790/pexels-photo-555790.png?auto=compress&cs=tinysrgb&dpr=2&h=426&w=645"
        },
        location
      );
      await this.makePerson(
        "clover",
        {
          name: "Clover",
          age: 27,
          img:
            "https://images.pexels.com/photos/371160/pexels-photo-371160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=426&w=645"
        },
        location
      );
    } else {
      console.log("Pins already set");
    }
  }

  async makePerson(name, properties, location) {
    let pin = await this.manager.createPinDevice(
      `pin-${name}`,
      location.coords
    );

    let publication = await this.manager.createPublication(
      "Dating App",
      10000, //m
      1000, //s
      properties,
      pin.id //last argument is explicit device id to which we with to attach the publication or
    );
    console.log(`Made publication ${publication.id}`);
  }
  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.onStartMatches}
          title="Find dates"
          accessibilityLabel="Starting looking matches for you"
        />
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
}

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
