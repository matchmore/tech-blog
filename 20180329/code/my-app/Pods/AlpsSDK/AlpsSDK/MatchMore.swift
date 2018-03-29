//
//  MatchMore.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 14/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

/// `MatchMore` is a static facade for all public methods and properties available in the SDK.
public final class MatchMore {
    /// Configuration method.
    public class func  configure(_ config: MatchMoreConfig) {
        MatchMore.config = config
    }
    
    /// Main mobile device created by `startUsingMainDevice()`
    public static var mainDevice: MobileDevice? {
        return instance.mobileDevices.main
    }
    
    /// Async store of all created publications.
    public static var publications: PublicationStore {
        return instance.publications
    }
    
    /// Async store of all created subscriptions.
    public static var subscriptions: SubscriptionStore {
        return instance.subscriptions
    }
    
    /// Async store of all create mobile devices
    public static var mobileDevices: MobileDeviceStore {
        return instance.mobileDevices
    }
    
    /// Async store of all create pin devices.
    public static var pinDevices: PinDeviceStore {
        return instance.pinDevices
    }
    
    /// Async store of all known iBeacon Triples.
    public static var knownBeacons: BeaconTripleStore {
        return instance.contextManager.beaconTriples
    }
    
    /// Last ANPS token used by SDK.
    public static var deviceToken: String? {
        return instance.remoteNotificationManager.deviceToken
    }
    
    // MARK: - Private
    
    static var config: MatchMoreConfig!
    
    static var instance: AlpsManager = {
        assert(config != nil, "Please configure first.")
        let alpsManager = AlpsManager(apiKey: config!.apiKey, baseURL: config!.serverUrl, customLocationManager: config?.customLocationManager)
        return alpsManager
    }()
}
