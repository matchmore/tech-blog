//
//  ModelExtensions.swift
//  Alps
//
//  Created by Rafal Kowalski on 04/10/2016
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import CoreLocation

extension IBeaconDevice {
    public convenience init(name: String, proximityUUID: String, major: NSNumber, minor: NSNumber) {
        self.init()
        self.name = name
        self.deviceType = DeviceType.ibeacondevice
        self.proximityUUID = proximityUUID
        self.major = major as? Int32
        self.minor = minor as? Int32
    }
}

extension MobileDevice {
    public convenience init(name: String, platform: String, deviceToken: String, location: Location?) {
        self.init()
        self.name = name
        self.deviceType = DeviceType.mobileDevice
        self.platform = platform
        self.deviceToken = deviceToken
        self.location = location
    }
}

extension PinDevice {
    public convenience init(name: String, location: Location) {
        self.init()
        self.name = name
        self.deviceType = DeviceType.pinDevice
        self.location = location
    }
}

extension Device: Hashable {
    public var hashValue: Int {
        return id!.hashValue
    }
    
    public static func == (lhs: Device, rhs: Device) -> Bool {
        return lhs.id! == rhs.id!
    }
}

public extension Publication {
    public convenience init(deviceId: String? = nil, topic: String, range: Double, duration: Double, properties: [String: Any]) {
        self.init()
        self.deviceId = deviceId
        self.topic = topic
        self.range = range
        self.duration = duration
        self.properties = properties
    }
}

public extension Subscription {
    public convenience init(deviceId: String? = nil, topic: String, range: Double, duration: Double, selector: String) {
        self.init()
        self.deviceId = deviceId
        self.topic = topic
        self.range = range
        self.duration = duration
        self.selector = selector
    }
}

public extension Location {
    public convenience init(latitude: Double, longitude: Double, altitude: Double? = 0, horizontalAccuracy: Double? = nil, verticalAccuracy: Double? = nil) {
        self.init()
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.horizontalAccuracy = horizontalAccuracy
        self.verticalAccuracy = verticalAccuracy
    }
    
    internal convenience init(location: CLLocation) {
        self.init()
        self.latitude = location.coordinate.latitude
        self.longitude = location.coordinate.longitude
        self.altitude = location.altitude
        self.horizontalAccuracy = location.horizontalAccuracy
        self.verticalAccuracy = location.verticalAccuracy
        self.createdAt = Int64(location.timestamp.timeIntervalSince1970 * 1000)
    }
    
    public static func == (lhs: Location, rhs: Location?) -> Bool {
        guard let rhsLatitude = rhs?.latitude else { return false }
        guard let rhsLongitude = rhs?.longitude else {return false}
        return lhs.latitude! == rhsLatitude && lhs.longitude! == rhsLongitude
    }
    
    public var clLocation: CLLocation? {
        guard
            let latitude = latitude,
            let longitude = longitude,
            let altitude = altitude,
            let horizontalAccuracy = horizontalAccuracy,
            let verticalAccuracy = verticalAccuracy,
            let createdAt = createdAt
        else { return nil }
        let timestamp = Date(timeIntervalSince1970: TimeInterval(createdAt)/1000.0)
        let clLocation = CLLocation(coordinate: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
                                       altitude: altitude,
                                       horizontalAccuracy: horizontalAccuracy,
                                       verticalAccuracy: verticalAccuracy,
                                       timestamp: timestamp)
        return clLocation
    }
}

extension Match: CustomStringConvertible, Hashable {
    
    public var hashValue: Int {
        return id!.hashValue
    }

    public static func == (lhs: Match, rhs: Match) -> Bool {
        return lhs.id! == rhs.id!
    }

    public var description: String {
        return "Match: (\(id!), \(createdAt!))"
    }
}

extension ProximityEvent {
    internal convenience init(deviceId: String, distance: Double) {
        self.init()
        self.deviceId = deviceId
        self.distance = distance
    }
}

extension CLProximity {
    func rawValueString() -> String {
        switch self {
        case .unknown: return "unknown"
        case .immediate: return "immediate"
        case .near: return "near"
        case .far: return "far"
        }
    }
    
    var distance: Double {
        switch self {
        case .immediate: return 0.5
        case .near: return 3.0
        case .far: return 50.0
        case .unknown: return 200.0
        }
    }
}

extension CLBeacon {
    static func == (lhs: CLBeacon, rhs: IBeaconTriple) -> Bool {
        guard let proximityUUID = rhs.proximityUUID, let major = rhs.major, let minor = rhs.minor else { return false }
        return lhs.proximityUUID.uuidString.caseInsensitiveCompare(proximityUUID) == ComparisonResult.orderedSame && (lhs.major as? Int32) == major && (lhs.minor as? Int32) == minor
    }
}

extension Date {
    func nowTimeInterval() -> Int64 {
        return Int64(Date().timeIntervalSince1970 * 1000)
    }
}
