//
//  PersistancyManager.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 02/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

class PersistenceManager {
    
    private class func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
    
    class func save<T>(object: T?, to file: String) -> Bool {
        guard let object = object else { return PersistenceManager.delete(file: file) }
        let data = NSKeyedArchiver.archivedData(withRootObject: object)
        let fullPath = getDocumentsDirectory().appendingPathComponent(file)
        do {
            try data.write(to: fullPath)
        } catch {
            return false
        }
        return true
    }
    
    class func read<T>(type: T.Type, from file: String) -> T? {
        let fullPath = getDocumentsDirectory().appendingPathComponent(file)
        guard let readObject = NSKeyedUnarchiver.unarchiveObject(withFile: fullPath.path) as? T else { return nil }
        return readObject
    }
    
    class func delete(file: String) -> Bool {
        let fullPath = getDocumentsDirectory().appendingPathComponent(file)
        do {
            try FileManager.default.removeItem(at: fullPath)
        } catch {
            return false
        }
        return true
    }
}
