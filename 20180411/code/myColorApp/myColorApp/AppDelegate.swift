//
//  AppDelegate.swift
//  myColorApp
//
//  Created by Wen on 22.03.18.
//  Copyright © 2018 Matchmore. All rights reserved.
//

import UIKit
import AlpsSDK
import CoreLocation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // 1. Create LocationManager
        let locationManager = CLLocationManager()
        // 2. Set LocationManager configurations
        locationManager.pausesLocationUpdatesAutomatically = true
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        
        // 3. Create your MatchMoreConfig
        // Generate your API-key in your app dashboard on https://matchmore.io
        let config = MatchMoreConfig(apiKey: "Your API-key HERE", customLocationManager: locationManager)
        // 4. Configure Matchmore with your needs
        MatchMore.configure(config)
        
        // 1. Create a main device
        MatchMore.startUsingMainDevice { result in
            // 2. Unwrap the result
            guard case .success(let mainDevice) = result else { print(result.errorMessage ?? ""); return }
            print("🏔 Using device: 🏔\n\(mainDevice.encodeToJSON())")
            
            // 3. Start getting matches with Web Socket service
            MatchMore.startListeningForNewMatches()
            // 4. Start location track in Matchmore
            MatchMore.startUpdatingLocation()
            // 5. Create the socket subscription
            self.createSocketSubscription()
        }
        return true
     }
    
    // 1. Create Socket subscription function
    // Subscriptions
    func createSocketSubscription() {
        // 2. Retrieve main device ID
        guard let deviceId = MatchMore.mainDevice?.id else {return}
        // 3. Create a Subscription, set topic and selector.
        let subscription = Subscription(topic: "color", range: 5, duration: 5000, selector: "id <> '\(deviceId)'")
        // 4. Set websocket mode
        subscription.pushers = ["ws"]
        // 5. Create a Subscription for Main Device
        MatchMore.createSubscriptionForMainDevice(subscription: subscription, completion: { result in
            switch result {
            case .success(let sub):
                print("🏔 Socket Sub was created 🏔\n\(sub.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
}

