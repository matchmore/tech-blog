//
//  MobileDeviceStore.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 27/10/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

final public class MobileDeviceStore: CRD {
    
    var kMainDeviceFile: String {
        return "kMainDeviceFile.Alps_" + id
    }
    var kMobileDevicesFile: String {
        return "kMobileDevicesFile.Alps_" + id
    }
    
    typealias DataType = MobileDevice
    
    internal private(set) var delegates = MulticastDelegate<DeviceDeleteDelegate>()

    internal private(set) var items = [MobileDevice]() {
        didSet {
            _ = PersistenceManager.save(object: self.items.map { $0.encodableMobileDevice }, to: kMobileDevicesFile)
        }
    }
    public var main: MobileDevice? {
        didSet {
            _ = PersistenceManager.save(object: self.main?.encodableMobileDevice, to: kMainDeviceFile)
        }
    }
    
    let id: String
    internal init(id: String) {
        self.id = id
        self.main = PersistenceManager.read(type: EncodableMobileDevice.self, from: kMainDeviceFile)?.object
        self.items = PersistenceManager.read(type: [EncodableMobileDevice].self, from: kMobileDevicesFile)?.map { $0.object } ?? []
    }
    
    public func create(item: MobileDevice, completion: @escaping (Result<MobileDevice>) -> Void) {
        DeviceAPI.createDevice(device: item) { (device, error) -> Void in
            if let device = device as? MobileDevice, error == nil {
                self.items.append(device)
                if self.main == nil { self.main = device }
                completion(.success(device))
            } else {
                completion(.failure(error as? ErrorResponse))
            }
        }
    }
    
    public func find(byId: String, completion: @escaping (MobileDevice?) -> Void) {
        completion(items.filter { $0.id ?? "" == byId }.first)
    }
    
    public func findAll(completion: @escaping ([MobileDevice]) -> Void) {
        completion(items)
    }
    
    public func delete(item: MobileDevice, completion: @escaping (ErrorResponse?) -> Void) {
        guard let id = item.id else { completion(ErrorResponse.missingId); return }
        DeviceAPI.deleteDevice(deviceId: id) { (error) in
            if error == nil {
                if self.main?.id == id { self.main = nil }
                self.items = self.items.filter { $0.id != id }
                self.delegates.invoke { $0.didDeleteDeviceWith(id: id) }
            }
            completion(error as? ErrorResponse)
        }
    }
    
    func deleteAll(completion: @escaping (ErrorResponse?) -> Void) {
        var lastError: ErrorResponse?
        let dispatchGroup = DispatchGroup()
        items.forEach {
            dispatchGroup.enter()
            self.delete(item: $0, completion: { error in
                if error != nil { lastError = error }
                dispatchGroup.leave()
            })
        }
        dispatchGroup.notify(queue: .main) {
            completion(lastError)
        }
    }
}
