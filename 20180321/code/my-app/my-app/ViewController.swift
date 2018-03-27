//
//  ViewController.swift
//  my-app
//
//  Created by Adam Smolarek on 21.03.2018.
//  Copyright © 2018 Adam. All rights reserved.
//

import UIKit
import AlpsSDK

class ViewController: UIViewController , MatchDelegate {
    @IBOutlet weak var label: UILabel!
    @IBAction func subscribe() {
        //range 20 meters duration 100 seconds
        let subscription = Subscription(topic: "Test Topic", range: 20, duration: 100, selector: "test = true")
        subscription.pushers = ["ws"]
        MatchMore.createSubscriptionForMainDevice(subscription: subscription, completion: { result in
            switch result {
            case .success(let sub):
                print("🏔 Socket Sub was created 🏔\n\(sub.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
    @IBAction func publish() {
        // range 20 meters duration 100 seconds
        let properties: [String: Any] = ["test": true]
        MatchMore.createPublicationForMainDevice(publication: Publication(topic: "Test Topic", range: 20, duration: 100, properties: properties), completion: { result in
            switch result {
            case .success(let publication):
                print("🏔 Pub was created: 🏔\n\(publication.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
    
    var onMatch: OnMatchClosure?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.onMatch = { [weak self] matches, _ in
            print("🏔 You've got new matches!!! 🏔\n\(matches.map { $0.encodeToJSON() })")
            self?.label.text = "🏔 You've got new matches!!! 🏔"
        }
        MatchMore.startUsingMainDevice { result in
            guard case .success(let mainDevice) = result else { print(result.errorMessage ?? ""); return }
            print("🏔 Using device: 🏔\n\(mainDevice.encodeToJSON())")
            MatchMore.matchDelegates += self
            MatchMore.startListeningForNewMatches()
            MatchMore.startUpdatingLocation()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}

