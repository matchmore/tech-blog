//
//  ViewController.swift
//  myColorApp
//
//  Created by Wen on 22.03.18.
//  Copyright © 2018 Matchmore. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {
    
    
    // MARK: Properties
    @IBOutlet weak var colorPicker: UIPickerView!
    @IBOutlet weak var rangeSlider: UISlider!
    @IBOutlet weak var rangeLabel: UILabel!
    @IBOutlet weak var changeButton: UIButton!
    var pickerData: [String] = [String]()
    
    
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
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: Action
    @IBAction func changeColor(_ sender: Any) {
        return
    }
    @IBAction func rangeSliderChanged(_ sender: Any) {
        return
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
}

