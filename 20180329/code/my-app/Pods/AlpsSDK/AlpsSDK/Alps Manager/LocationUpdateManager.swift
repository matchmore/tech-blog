//
//  LocationUpdateManager.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 27/10/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

/// filters location data update
final public class LocationUpdateManager {
    private(set) var lastLocation: Location?
    
    func tryToSend(location: Location, for deviceId: String) {
        if location == lastLocation { return }
        LocationAPI.createLocation(deviceId: deviceId, location: location, completion: { _, _ in
            self.lastLocation = location
        })
    }
}
