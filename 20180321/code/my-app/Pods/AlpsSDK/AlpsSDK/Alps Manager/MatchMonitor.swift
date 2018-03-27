//
//  MatchMonitor.swift
//  Alps
//
//  Created by Rafal Kowalski on 28/02/2017
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

import Starscream

protocol MatchMonitorDelegate: class {
    func didFind(matches: [Match], for device: Device)
}

public class MatchMonitor {
    private(set) weak var delegate: MatchMonitorDelegate?
    private(set) var monitoredDevices = Set<Device>()
    private(set) var deliveredMatches = Set<Match>()
    
    private var timer: Timer?
    private var socket: WebSocket?

    init(delegate: MatchMonitorDelegate) {
        self.delegate = delegate
    }
    
    // MARK: - Device Monitoring
    
    func startMonitoringFor(device: Device) {
        monitoredDevices.insert(device)
    }
    
    func stopMonitoringFor(device: Device) {
        monitoredDevices.remove(device)
    }
    
    // MARK: - Polling
    
    func startPollingMatches(pollingTimeInterval: TimeInterval) {
        if timer != nil { return }
        timer = Timer.scheduledTimer(timeInterval: pollingTimeInterval, target: self, selector: #selector(getMatches), userInfo: nil, repeats: true)
    }
    
    func stopPollingMatches() {
        timer?.invalidate()
        timer = nil
    }
    
    // MARK: - Socket
    
    // TODO: start new socket after adding new device ?
    func openSocketForMatches() {
        if socket != nil { return }
        guard let deviceId = monitoredDevices.first?.id else { return }
        let worldId = MatchMore.config.apiKey.getWorldIdFromToken()
        var url = MatchMore.config.serverUrl
        url = url.replacingOccurrences(of: "https://", with: "")
        url = url.replacingOccurrences(of: "http://", with: "")
        url = url.replacingOccurrences(of: "/v5", with: "")
        let request = URLRequest(url: URL(string: "ws://\(url)/pusher/v5/ws/\(deviceId)")!)
        socket = WebSocket(request: request, protocols: ["api-key", worldId])
        socket?.disableSSLCertValidation = true
        socket?.onText = { text in
            if text != "ping" && text != "" && text != "pong" { // empty string or "ping" just keeps connection alive
                self.getMatches()
            }
        }
        socket?.onDisconnect = { error in
            self.socket?.connect()
        }
        socket?.onPong = { _ in
            self.socket?.write(ping: "ping".data(using: .utf8)!)
        }
        socket?.connect()
    }
    
    func closeSocketForMatches() {
        socket?.disconnect()
        socket = nil
    }
    
    // MARK: - Getting Matches
    
    @objc private func getMatches() {
        self.monitoredDevices.forEach {
            getMatchesForDevice(device: $0)
        }
    }
    
    private func getMatchesForDevice(device: Device) {
        guard let deviceId = device.id else { return }
        MatchesAPI.getMatches(deviceId: deviceId) { (matches, error) in
            guard let matches = matches, matches.count > 0, error == nil else { return }
            let union = self.deliveredMatches.union(Set(matches))
            if union != self.deliveredMatches {
                self.deliveredMatches = union
                self.delegate?.didFind(matches: matches, for: device)
            }
        }
    }
    
    // MARK: - Remote Notification Manager Delegate
    
    func refreshMatchesFor(deviceId: String) {
        getMatches()
    }
}
