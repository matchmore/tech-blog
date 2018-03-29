//
//  SubscriptionStore.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 27/10/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

final public class SubscriptionStore: CRD {
    var kSubscriptionFile: String {
        return "kSubscriptionFile.Alps_" + id
    }
    typealias DataType = Subscription
    
    internal private(set) var items: [Subscription] {
        get {
            return _items.withoutExpired
        }
        set {
            _items = newValue
        }
    }
    
    private var _items = [Subscription]() {
        didSet {
            _ = PersistenceManager.save(object: self._items.withoutExpired.map { $0.encodableSubscription }, to: kSubscriptionFile)
        }
    }
    
    let id: String
    internal init(id: String) {
        self.id = id
        self.items = PersistenceManager.read(type: [EncodableSubscription].self, from: kSubscriptionFile)?.map { $0.object }.withoutExpired ?? []
    }
    
    public func create(item: Subscription, completion: @escaping (Result<Subscription>) -> Void) {
        guard let deviceId = item.deviceId else { return }
        SubscriptionAPI.createSubscription(deviceId: deviceId, subscription: item) { (subscription, error) in
            if let subscription = subscription, error == nil {
                self.items.append(subscription)
                completion(.success(subscription))
            } else {
                completion(.failure(error as? ErrorResponse))
            }
        }
    }
    
    public func find(byId: String, completion: @escaping (Subscription?) -> Void) {
        completion(items.filter { $0.id ?? "" == byId }.first)
    }
    
    public func findAll(completion: @escaping ([Subscription]) -> Void) {
        completion(items)
    }
    
    public func delete(item: Subscription, completion: @escaping (ErrorResponse?) -> Void) {
        guard let id = item.id else { completion(ErrorResponse.missingId); return }
        guard let deviceId = item.deviceId else { completion(ErrorResponse.missingId); return }
        SubscriptionAPI.deleteSubscription(deviceId: deviceId, subscriptionId: id, completion: { (error) in
            if error == nil {
                self.items = self.items.filter { $0.id != id }
            }
            completion(error as? ErrorResponse)
        })
    }
    
    public func deleteAll(completion: @escaping (ErrorResponse?) -> Void) {
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

extension SubscriptionStore: DeviceDeleteDelegate {
    func didDeleteDeviceWith(id: String) {
        self.items = self.items.filter { $0.deviceId != id }
    }
}
