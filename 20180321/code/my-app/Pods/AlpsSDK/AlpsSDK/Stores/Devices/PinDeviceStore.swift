//
//  PinDeviceStore.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 20/10/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

final public class PinDeviceStore: CRD {
    var kPinDevicesFile: String {
        return  "kPinDevicesFile.Alps_" + id
    }
    typealias DataType = PinDevice
    
    internal private(set) var delegates = MulticastDelegate<DeviceDeleteDelegate>()
    
    internal private(set) var items = [PinDevice]() {
        didSet {
            _ = PersistenceManager.save(object: self.items.map { $0.encodablePinDevice }, to: kPinDevicesFile)
        }
    }
    
    let id: String
    internal init(id: String) {
        self.id = id
        self.items = PersistenceManager.read(type: [EncodablePinDevice].self, from: kPinDevicesFile)?.map { $0.object } ?? []
    }
    
    public func create(item: PinDevice, completion: @escaping (Result<PinDevice>) -> Void) {
        DeviceAPI.createDevice(device: item) { (device, error) -> Void in
            if let pinDevice = device as? PinDevice, error == nil {
                self.items.append(pinDevice)
                completion(.success(pinDevice))
            } else {
                completion(.failure(error as? ErrorResponse))
            }
        }
    }
    
    public func find(byId: String, completion: @escaping (PinDevice?) -> Void) {
        completion(items.filter { $0.id ?? "" == byId }.first)
    }
    
    public func findAll(completion: @escaping ([PinDevice]) -> Void) {
        completion(items)
    }
    
    public func delete(item: PinDevice, completion: @escaping (ErrorResponse?) -> Void) {
        guard let id = item.id else { completion(ErrorResponse.missingId); return }
        DeviceAPI.deleteDevice(deviceId: id) { (error) in
            if error == nil {
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
