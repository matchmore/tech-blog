//
//  ContextManager.swift
//  Alps
//
//  Created by Rafal Kowalski on 28.09.16.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation
import CoreLocation

protocol ContextManagerDelegate: class {
    func didUpdateLocation(location: CLLocation)
}

class ContextManager: NSObject, CLLocationManagerDelegate {
    
    private weak var delegate: ContextManagerDelegate?
    
    let proximityHandler = ProximityHandler()

    var locationManager: CLLocationManager?
    
    let beaconTriples: BeaconTripleStore

    init(id: String, delegate: ContextManagerDelegate, locationManager: CLLocationManager) {
        self.beaconTriples = BeaconTripleStore(id: id)
        super.init()
        self.delegate = delegate
        self.locationManager = locationManager
        self.locationManager?.delegate = self
    }

    // MARK: - Core Location Manager Delegate

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let lastLocation = locations.last else { return }
        delegate?.didUpdateLocation(location: lastLocation)
    }

    // MARK: - Beacons
    
    func startRanging() {
        beaconTriples.findAll { result in
            result.forEach {
                let beaconRegion = CLBeaconRegion(proximityUUID: UUID(uuidString: $0.proximityUUID!)!, identifier: $0.deviceId!)
                self.locationManager?.startRangingBeacons(in: beaconRegion)
            }
        }
    }
    
    // MARK: - Proximity Handler Delegate

    func locationManager(_ manager: CLLocationManager, didRangeBeacons beacons: [CLBeacon], in region: CLBeaconRegion) {
        beaconTriples.findAll { result in
            self.proximityHandler.rangeBeacons(beacons: beacons, knownBeacons: result)
        }
    }
}
