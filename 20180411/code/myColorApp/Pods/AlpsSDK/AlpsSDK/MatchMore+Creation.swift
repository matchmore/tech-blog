//
//  MatchMore+Creation.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 15/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation
import UIKit

public extension MatchMore {
    /// Creates or reuses cached mobile device object. Mobile device object is used to represent the smartphone.
    ///
    /// - Parameters:
    ///   - device: (Optional) Device object that will be created on MatchMore's cloud. When device is `nil` this function will use `UIDevice.current` properties to create new Mobile Device.
    ///   - shouldStartMonitoring: (Optional) flag that determines if created device should monitored for matches immediately after creating.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func startUsingMainDevice(device: MobileDevice? = nil, shouldStartMonitoring: Bool = true, completion: @escaping ((Result<MobileDevice>) -> Void)) {
        if let mainDevice = instance.mobileDevices.main, device == nil {
            instance.matchMonitor.startMonitoringFor(device: mainDevice)
            completion(.success(mainDevice))
            return
        }
        let uiDevice = UIDevice.current
        let mobileDevice = MobileDevice(name: device?.name ?? uiDevice.name,
                                        platform: device?.platform ?? uiDevice.systemName,
                                        deviceToken: device?.deviceToken ?? instance.remoteNotificationManager.deviceToken ?? "",
                                        location: device?.location ?? instance.locationUpdateManager.lastLocation)
        instance.mobileDevices.create(item: mobileDevice) { (result) in
            if let mainDevice = result.responseObject, shouldStartMonitoring {
                instance.matchMonitor.startMonitoringFor(device: mainDevice)
            }
            completion(result)
        }
    }
    
    /// Creates new pin device. Device created this way can be accessed via pin devices store: `MatchMore.pinDevices` or through callback's `Result`.
    ///
    /// - Parameters:
    ///   - device: Pin device object that will be created on MatchMore's cloud.
    ///   - shouldStartMonitoring: (Optional) flag that determines if created device should monitored for matches immediately after creating.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createPinDevice(pinDevice: PinDevice, shouldStartMonitoring: Bool = true, completion: @escaping ((Result<PinDevice>) -> Void)) {
        instance.pinDevices.create(item: pinDevice) { (result) in
            if let pinDevice = result.responseObject, shouldStartMonitoring {
                instance.matchMonitor.startMonitoringFor(device: pinDevice)
            }
            completion(result)
        }
    }
    
    /// Creates new publication attached to given device.
    ///
    /// - Parameters:
    ///   - publication: Publication object that will be created on MatchMore's cloud.
    ///   - forDevice: device on which publication is supposed to be created.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createPublication(publication: Publication, forDevice: Device, completion: @escaping ((Result<Publication>) -> Void)) {
        publication.deviceId = forDevice.id
        instance.publications.create(item: publication) { (result) in
            completion(result)
        }
    }
    
    /// Creates new publication attached to beacon.
    ///
    /// - Parameters:
    ///   - publication: Publication object that will be created on MatchMore's cloud.
    ///   - forBeacon: beacon on which publication is supposed to be created.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createPublication(publication: Publication, forBeacon: IBeaconTriple, completion: @escaping ((Result<Publication>) -> Void)) {
        publication.deviceId = forBeacon.deviceId
        instance.publications.create(item: publication) { (result) in
            completion(result)
        }
    }
    
    /// Creates new publication attached to main device.
    ///
    /// - Parameters:
    ///   - publication: Publication object that will be created on MatchMore's cloud and automatically attached to main mobile device.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createPublicationForMainDevice(publication: Publication, completion: @escaping ((Result<Publication>) -> Void)) {
        publication.deviceId = instance.mobileDevices.main?.id
        instance.publications.create(item: publication) { (result) in
            completion(result)
        }
    }
    
    /// Creates new subscription attached to device with given id.
    ///
    /// - Parameters:
    ///   - subscription: Subscription object that will be created on MatchMore's cloud.
    ///   - forDevice: device on which subscriptions is supposed to be created.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createSubscription(subscription: Subscription, forDevice: Device, completion: @escaping ((Result<Subscription>) -> Void)) {
        subscription.deviceId = forDevice.id
        instance.subscriptions.create(item: subscription) { (result) in
            completion(result)
        }
    }
    
    /// Creates new subscription attached to device with given id.
    ///
    /// - Parameters:
    ///   - subscription: Subscription object that will be created on MatchMore's cloud and automatically attached to main mobile device.
    ///   - completion: Callback that returns response from the MatchMore cloud.
    public class func createSubscriptionForMainDevice(subscription: Subscription, completion: @escaping ((Result<Subscription>) -> Void)) {
        subscription.deviceId = instance.mobileDevices.main?.id
        instance.subscriptions.create(item: subscription) { (result) in
            completion(result)
        }
    }
    
    /// Start monitoring matches for given device. In order to receive matches implement `MatchDelegate`.
    ///
    /// - Parameters:
    ///   - device: Device object that will be monitored.
    public class func startMonitoringMatches(forDevice: Device) {
        instance.matchMonitor.startMonitoringFor(device: forDevice)
    }
    
    /// Stop monitoring matches for given device. In order to receive matches implement `MatchDelegate`.
    ///
    /// - Parameters:
    ///   - device: Device object that will not be monitored anymore.
    public class func stopMonitoringMatches(forDevice: Device) {
        instance.matchMonitor.stopMonitoringFor(device: forDevice)
    }
}
