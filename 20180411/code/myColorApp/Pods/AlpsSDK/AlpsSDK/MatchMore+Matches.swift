//
//  MatchMore+Matches.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 15/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

public extension MatchMore {
    
    /// List of all delivered Matches.
    public static var allMatches: [Match] {
        return Array(instance.matchMonitor.deliveredMatches)
    }
    
    /// List of all match delivery delegates. The delegate has to conform to `AlpsDelegate`. Adding new delegate can be achieved either by `+=` or `add()`.
    public static var matchDelegates = instance.delegates
    
    /// Starts polling matches every `pollingTimeInterval` seconds. All `matchDelegates` are notified about the change.
    public class func startPollingMatches(pollingTimeInterval: TimeInterval) {
        instance.matchMonitor.startPollingMatches(pollingTimeInterval: pollingTimeInterval)
    }
    
    /// Opens socket listening for new matches notifications. All `matchDelegates` are notified about the change.
    public class func startListeningForNewMatches() {
        instance.matchMonitor.openSocketForMatches()
    }
    
    /// Proceses MatchMore's remote push notification and checks for new matches. All `matchDelegates` are notified about the change.
    ///
    /// - Parameter pushNotification: a raw APNS dictionary.
    public class func processPushNotification(pushNotification: [AnyHashable: Any]) {
        instance.remoteNotificationManager.process(pushNotification: pushNotification)
    }
    
    /// Saves APNS deviceToken to keychain. Device token can be later used to create APNS notification trigger.
    ///
    /// - Parameter deviceToken: APNS device token represented as a `String`.
    public class func registerDeviceToken(deviceToken: String) {
        instance.remoteNotificationManager.registerDeviceToken(deviceToken: deviceToken)
    }
}
