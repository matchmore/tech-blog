//
//  ViewController.swift
//  myColorApp
//
//  Created by Wen on 22.03.18.
//  Copyright © 2018 Matchmore. All rights reserved.
//

import UIKit
import AlpsSDK

class ViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource, MatchDelegate {
    
    
    // MARK: Properties
    @IBOutlet weak var colorPicker: UIPickerView!
    @IBOutlet weak var rangeSlider: UISlider!
    @IBOutlet weak var rangeLabel: UILabel!
    @IBOutlet weak var changeButton: UIButton!
    var pickerData: [String] = [String]()
    var onMatch: OnMatchClosure?
    let colors = ["yellow": UIColor.yellow,
                  "red": UIColor(red: 255/255, green: 106/255, blue: 93/255, alpha: 1),
                  "orange": UIColor(red: 255/255, green: 179/255, blue: 70/255, alpha: 1),
                  "magenta": UIColor(red: 255/255, green: 116/255, blue: 217/255, alpha: 1),
                  "lightgray": UIColor.lightGray,
                  "green": UIColor(red: 134/255, green: 255/255, blue: 150/255, alpha: 1),
                  "cyan": UIColor.cyan,
                  "teal": UIColor(red: 20/255, green: 229/255, blue: 204/255, alpha: 1),
                  "pink": UIColor(red: 255/255, green: 173/255, blue: 171/255, alpha: 1),
                  "white": UIColor(red: 255/255, green: 255/255, blue: 255/255, alpha: 1)
    ]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Additional setup for UI
        changeButton.layer.cornerRadius = 4
        rangeLabel.text = "1 m"
        rangeLabel.layer.masksToBounds = true
        rangeLabel.layer.cornerRadius = 8
        rangeLabel.layer.borderColor = UIColor(red: 211/255, green: 211/255, blue: 211/255, alpha: 1).cgColor
        rangeLabel.layer.borderWidth = 2.0
        rangeSlider.minimumValue = 1
        rangeSlider.setValue(1.0, animated: true)
        rangeSlider.maximumValue = 300
        
        // Connect data:
        self.colorPicker.delegate = self
        self.colorPicker.dataSource = self
        
        // Input data into the Array:
        pickerData = ["yellow", "red", "orange", "magenta", "lightgray", "green", "cyan", "teal", "pink", "white"]
    
        // Handle Matches
        self.onMatch = { [weak self] matches, _ in
            // 1. Get most recent Match
            let mostRecentDate = matches.max(by: {
                $0.createdAt! < $1.createdAt!
            })
            
            // 2. Unwrap properties and color
            guard let properties = mostRecentDate?.publication?.properties else {
                print("No properties.")
                return
            }
            guard let color = properties["color"] as? String else {return}
            
            // 3. Color Background of the screen
            self?.view.backgroundColor = self?.colors[color]
        }
        // 4. Add View as a supplement match delegate to Matchmore
        MatchMore.matchDelegates += self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: Action
    @IBAction func changeColor(_ sender: Any) {
        createPublication()
    }
    @IBAction func rangeSliderChanged(_ sender: Any) {
        self.rangeLabel.text = "\(Int(rangeSlider.value)) m"
    }
    
    // MARK: Picker view stubs
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickerData.count
    }
    
    // The data to return for the row and component (column) that's being passed in
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickerData[row]
    }
    
    // 1. Create publication creation function
    // Create a publication
    func createPublication() {
        // 2. Retrieve selected picker row, selected range, and main device ID
        let selectedValue = pickerData[colorPicker.selectedRow(inComponent: 0)]
        let selectedRange = rangeSlider.value
        guard let deviceId = MatchMore.mainDevice?.id else {return}
        // 3. Create a Publication, set topic and properties
        let publication = Publication(topic: "color", range: Double(Int(selectedRange)), duration: 100, properties: ["color": selectedValue, "id": deviceId])
        // 4. Create a Publication for Main Device
        MatchMore.createPublicationForMainDevice(publication: publication, completion: { result in
            switch result {
            case .success(let publication):
                print("🏔 Pub was created: 🏔\n\(publication.encodeToJSON())")
            case .failure(let error):
                print("🌋 \(String(describing: error?.message)) 🌋")
            }
        })
    }
}

