//
//  ProximityHandler.swift
//  AlpsSDK
//
//  Created by Wen on 26.10.17.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import CoreLocation

final class ProximityHandler {
    
    var refreshTimer: Int = 5 * 1000 // timer is in milliseconds
    lazy var beaconsDetected: [CLProximity: [IBeaconTriple]] = [:]
    lazy var beaconsTriggered: [CLProximity: [String: ProximityEvent]] = {
        var beaconsTriggered = [CLProximity: [String: ProximityEvent]]()
        beaconsTriggered[.unknown] = [String: ProximityEvent]()
        beaconsTriggered[.immediate] = [String: ProximityEvent]()
        beaconsTriggered[.far] = [String: ProximityEvent]()
        beaconsTriggered[.near] = [String: ProximityEvent]()
        return beaconsTriggered
    }()
    
    func rangeBeacons(beacons: [CLBeacon], knownBeacons: [IBeaconTriple]) {
        let groupedBeacons = beacons.group { return $0.proximity }
        groupedBeacons.keys.forEach { key in
            beaconsDetected[key] = synchronizeBeacons(beacons: groupedBeacons[key]!, knownBeacons: knownBeacons)
            actionContextMatch(key: key, value: beaconsDetected[key]!)
        }
    }
    
    // When the proximity match is successful, action the context match in the backend service
    private func actionContextMatch(key: CLProximity, value: [IBeaconTriple]) {
        value.forEach { (iBeaconTriple) in
            guard let deviceId = iBeaconTriple.deviceId,
            let keys = beaconsTriggered[key]?.keys else { return }
            if keys.contains(deviceId) {
                refreshTriggers(key: key, deviceId: deviceId, distance: key.distance)
            } else {
                triggers(key: key, deviceId: deviceId, distance: key.distance)
            }
        }
    }
    
    // Trigger the proximity event
    private func triggers(key: CLProximity, deviceId: String, distance: Double) {
        guard let mainDeviceId = MatchMore.instance.mobileDevices.main?.id else { return }
        let proximityEvent = ProximityEvent(deviceId: deviceId, distance: distance)
        DeviceAPI.triggerProximityEvents(deviceId: mainDeviceId, proximityEvent: proximityEvent) {(proximityEvent, _) -> Void in
            guard let proximityEvent = proximityEvent else { return }
            self.beaconsTriggered[key]?[deviceId] = proximityEvent
        }
    }
    
    // Re-launch a proximity event depending on refreshTimer (Default : 60 seconds)
    private func refreshTriggers(key: CLProximity, deviceId: String, distance: Double) {
        guard let proximityEvent = beaconsTriggered[key]?[deviceId],
        let proximityEventCreatedAt = proximityEvent.createdAt,
        let mainDeviceId = MatchMore.instance.mobileDevices.main?.id else { return }
        
        let now = Date().nowTimeInterval()
        let gap = now - proximityEventCreatedAt
        let truncatedGap = Int(truncatingIfNeeded: gap)
        
        if truncatedGap > refreshTimer {
            // Send the refreshing proximity event based on the timer
            let newProximityEvent = ProximityEvent(deviceId: deviceId, distance: distance)
            DeviceAPI.triggerProximityEvents(deviceId: mainDeviceId, proximityEvent: newProximityEvent) {(proximityEvent, _) -> Void in
                guard let proximityEvent = proximityEvent else { return }
                self.beaconsTriggered[key]?[deviceId] = proximityEvent
            }
        }
    }
    
    // MARK: - Helper Function
    
    // List of beacons currently tracked by the application, means beacons are registered in portal
    private func synchronizeBeacons(beacons: [CLBeacon], knownBeacons: [IBeaconTriple]) -> [IBeaconTriple] {
        var result = [IBeaconTriple]()
        beacons.forEach { beacon in
            let b = knownBeacons.filter { beacon == $0 }
            if !b.isEmpty { result.append(b[0]) }
        }
        return result
    }
}
