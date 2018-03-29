//
//  DeviceDeleteDelegate.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 13/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Foundation

protocol DeviceDeleteDelegate: class {
    func didDeleteDeviceWith(id: String)
}
