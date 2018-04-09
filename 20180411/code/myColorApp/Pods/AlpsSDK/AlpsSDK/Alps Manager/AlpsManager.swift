//
//  AlpsManager.swift
//  Alps
//
//  Created by Rafal Kowalski on 04/10/2016
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import CoreLocation
import Foundation
import UIKit

public typealias OnMatchClosure = (_ matches: [Match], _ device: Device) -> Void
public protocol MatchDelegate: class {
    var onMatch: OnMatchClosure? { get }
}

public class AlpsManager: MatchMonitorDelegate, ContextManagerDelegate, RemoteNotificationManagerDelegate {
    public var delegates = MulticastDelegate<MatchDelegate>()
    
    let apiKey: String
    let worldId: String
    
    var baseURL: String {
        set {
            AlpsAPI.basePath = newValue
        } get {
            return AlpsAPI.basePath
        }
    }
    
    lazy var contextManager = ContextManager(id: worldId, delegate: self, locationManager: locationManager)
    lazy var matchMonitor = MatchMonitor(delegate: self)
    lazy var remoteNotificationManager = RemoteNotificationManager(delegate: self)
    
    lazy var publications = PublicationStore(id: worldId)
    lazy var subscriptions = SubscriptionStore(id: worldId)
    
    lazy var mobileDevices: MobileDeviceStore = {
        let mobileDevices = MobileDeviceStore(id: worldId)
        mobileDevices.delegates += publications
        mobileDevices.delegates += subscriptions
        return mobileDevices
    }()
    
    lazy var pinDevices: PinDeviceStore = {
        let pinDevices = PinDeviceStore(id: worldId)
        pinDevices.delegates += publications
        pinDevices.delegates += subscriptions
        return pinDevices
    }()
    
    lazy var locationUpdateManager = LocationUpdateManager()
    private let locationManager: CLLocationManager

    internal init(apiKey: String, baseURL: String? = nil, customLocationManager: CLLocationManager?) {
        self.apiKey = apiKey
        self.worldId = apiKey.getWorldIdFromToken()
        if let customLocationManager = customLocationManager {
            self.locationManager = customLocationManager
        } else {
            self.locationManager = CLLocationManager()
            self.locationManager.desiredAccuracy = kCLLocationAccuracyBest
            self.locationManager.requestAlwaysAuthorization()
            self.locationManager.requestWhenInUseAuthorization()
        }
        self.setupAPI()
        if let baseURL = baseURL {
            self.baseURL = baseURL
        }
    }
    
    private func setupAPI() {
        let device = UIDevice.current
        let headers = [
            "api-key": self.apiKey,
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json",
            "user-agent": "\(device.systemName) \(device.systemVersion)"
        ]
        AlpsAPI.customHeaders = headers
    }
    
    // MARK: - Match Monitor Delegate
    
    func didFind(matches: [Match], for device: Device) {
        delegates.invoke { $0.onMatch?(matches, device) }
    }
    
    // MARK: - Context Manager Delegate
    
    func didUpdateLocation(location: CLLocation) {
        mobileDevices.findAll { (result) in
            result.forEach {
                guard let deviceId = $0.id else { return }
                self.locationUpdateManager.tryToSend(location: Location(location: location), for: deviceId)
            }
        }
    }
    
    // MARK: - Remote Notification Manager Delegate
    
    func didReceiveMatchUpdateForDeviceId(deviceId: String) {
        matchMonitor.refreshMatchesFor(deviceId: deviceId)
    }
    
    func didReceiveDeviceTokenUpdate(deviceToken: String) {
        mobileDevices.findAll { (result) in
            result.forEach {
                guard let deviceId = $0.id else { return }
                let deviceUpdate = DeviceUpdate()
                deviceUpdate.deviceToken = deviceToken
                DeviceAPI.updateDevice(deviceId: deviceId, device: deviceUpdate, completion: { (_, _) in })
            }
        }
    }

}
