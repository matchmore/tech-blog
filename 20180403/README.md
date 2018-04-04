# Getting Started with Matchmore: A Proximity detection based location app with Swift iOS [Part 1 of 2]
This tutorial will show you how to write an iOS app that changes the color of the screen of surrounding devices to match the most recent published value. We'll be working with Matchmore iOS SDK which encapsulates the well known CoreLocation framework. The code will be written in Swift 4 for iOS9 and Xcode 9.2.

The purpose of this tutorial is to show you how quick and easy it is to get a proof-of-concept **proximity detection based location app**.

All the code for this demo is also available at GitHub: [myColorApp](https://github.com/matchmore/tech-blog/tree/master/20180403/code/myColorApp)

I have divided this tutorial in two blog posts:

**1. Build the User Interface (UI) needed for this project (this post).**

2. Integrate Matchmore to create geomatching and put color on the screen of surrounding devices.

## Requirements

If you'd like to follow along, here's what you'll need:

* Xcode 9.2 or newer, so you can follow along with the Swift code.
* You'll need Cocoapods installed to pull Matchmore into the project.
* A Matchmore account to start the service. [You can register for free here](http://matchmore.com/account/register/).
* If you want to test the app in real life, you'll need at least two iPhones supporting iOS9. Else, you can test it via Xcode simulator.

# PART 1 Create the UI

In this first part, you'll create the single view needed for this app.

This is relatvely basic stuff, so if you are an advanced developer you might want to jump directly to the second blog post about Matchmore and geomatching.

Here is a [link](https://github.com/matchmore/tech-blog/tree/master/20180403/code/myColorApp) to download a ready-to-use UI, the project is explained in the fellowing tutorial.

## Project Setup

1. To get started, create a new project and choose the Single View Application template.

2. On the project option's screen, make sure you choose Swift as the language.

## Build the UI

Open your storyboard, in the project navigator, select *Main.storyboard*.

### Add a picker view to your scene

1. In the Object library, type picker view in the filter field to find the `Picker View` object quickly.

2. Drag a `Picker View` object from the `Object library` to your scene.

*Picker View will allow the user to pick the color of his surroundings devices screen.*

3. Drag the picker view so that it’s positioned in the top of the scene.

#### Add layout constraint to the picker view

1. Select the picker view.

2. On the bottom right of the canvas, open the `Add New Constraints` menu. Above `Spacing to nearest neighbour` click the two horizontal constraints and the top vertical constraint to select them. They become red when they are selected.

3. Type 0 in the top, left and right boxes. Press Return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/5.png "picker view")

### Add a slider to your scene

1. In the `Object library`, type slider in the filter field to find the `Slider` object quickly.

2. Drag a `Slider` object from the `Object library` to your scene.

3. Drag the `Slider` so that it’s right under the picker view and aligned with the left margin in the scene.

Stop dragging the slider when it snaps to the guidelines.

4. Resize the left and right edges of the slider until you see three vertical layout guides: the left margin alignment, the horizontal center alignment, and the right margin alignment.

#### Add layout constraint to the slider

1. Select the slider.

2. On the bottom right of the canvas, open the `Add New Constraints` menu. Above `Spacing to nearest neighbour` click the two horizontal constraints and the top vertical constraint to select them. They become red when they are selected.

3. Type 16 in the left and right boxes, and type 8 spacing in the top box. Press Return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/6.png "slider")

### Add a label to your scene

1. In the `Object library`, type label in the filter field to find the `Label` object quickly.

2. Drag a `Label` object from the `Object library` to your scene.

3. Drag the label so that it’s right under the slider and aligned with the left margin in the scene.

Stop dragging the label when it snaps to the guidelines.

4. Resize the left and right edges of the label until you see three vertical layout guides: the left margin alignment, the horizontal center alignment, and the right margin alignment.

5. While the label is selected, go in the `Attributes inspector`, find the field labeled `Alignment` and click on the centered icon.

#### Add layout constraint to the label

1. Select the label.

2. On the bottom right of the canvas, open the `Add New Constraints menu` again.

3. Above `Spacing to nearest neighbour` click the top vertical constraint to select it. It becomes red when it is selected.

4. Type 8 in the top box, set constraints Width equals to 90 and Height equals to 30, press return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/7.png "label constraint")

Keep the label selected.

5. On the bottom right of the canvas next to `Add New Constraints menu`, open the `Align menu`.

6. Tick the `Horizontally in Container`, and press return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/8.png "label horizontal constraint")

### Add a button to your scene

1. In the `Object library`, type button in the filter field to find the `Button` object quickly.

2. Drag a `Button` object from the `Object library` to your scene.

3. Drag the button so that it’s right below the label.

4. Stop dragging the button when it snaps to the guidelines.

5. With the button selected, open the `Attributes inspector` in the utility area.

6. In the `Attributes inspector`, find the field labeled `Text Color` and change it to White Color.

7. Stay in the `Attributes inspector`, under View, find the field labeled `Background` and change the color to HEX Color #0096FD.

8. Double-click on the button and type Change color.

9. Press Return to display the new text in the button. If needed, drag the button so that it’s right below the label.

#### Add layout constraint to the button

1. Select the button.

2. On the bottom right of the canvas, open the `Add New Constraints menu` again.

3. Above `Spacing to nearest neighbour` click the top vertical constraint to select it. It becomes red when it is selected.

4. Type 8 in the top box, set constraints Width equals to 160 and Height equals to 50, press return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/9.png "button constraint")

Keep the button selected.

5. On the bottom right of the canvas next to `Add New Constraints menu`, open the `Align` menu.

6. Tick the `Horizontally in Container`, and press return.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/5.png "button horizontal constraint")

Your UI is ready and should look like image below.
![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/3.png "UI Ready, not connected")

## Connect the UI to the code

Now you’ll connect the basic user interface (UI) to code and define some actions a user can perform in that UI.

Open your storyboard, *Main.storyboard*.

Click on the Assistant button in the Xcode toolbar near the top right corner of Xcode to open the assistant editor.

In *ViewController.swift*, find the class line, and add the following:
`// MARK: Properties`

### Connect the picker view
1. In your storyboard, select the `picker view`.

2. Control-drag from the `picker view` on your canvas to the code display in the editor on the right. Stop the drag at the line below the comment you just added in *ViewController.swift*.

3. In the dialog that appears, for `Name`, type `colorPicker`. Leave the rest of the options as they are. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/11.png "picker view connection")

### Connect the slider
1. In your storyboard, select the `slider`.

2. Control-drag from the `slider` on your canvas to the code display in the editor on the right, stopping the drag at the line just below your colorPicker property in *ViewController.swift*.

3. In the dialog that appears, for `Name`, type `rangeSlider`. Leave the rest of the options as they are. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/12.png "slider connection")

### Connect the label
1. In your storyboard, select the `label`.

2. Control-drag from the `label` on your canvas to the code display in the editor on the right. Stop the drag at the line just below your rangeSlider property in *ViewController.swift*.

3. In the dialog that appears, for `Name`, type `rangeLabel`. Leave the rest of the options as they are. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/13.png "label connection")

### Connect the button
1. In your storyboard, select the `button`.

2. Control-drag from the `button` on your canvas to the code display in the editor on the right. Stop the dragging at the line just below your rangeLabel property in *ViewController.swift*.

3. In the dialog that appears, for `Name`, type `changeButton`. Leave the rest of the options as they are. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/14.png "button connection")

### Connect actions to the UI
In *ViewController.swift*, just above the last curly brace ( } ), add the following:
`// MARK: Actions`

#### Connect the button to an action

1. In your storyboard, select the `Change Color button`.

2. Control-drag from the `Change Color button` on your canvas to the code display in the editor on the right. Stop the dragging at the line below the comment you just added in *ViewController.swift*.

3. In the dialog that appears, for `Connection` select `Action`.

4. For `Name`, type `changeColor`. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/15.png "button action")

#### Connect the slider to an action

1. In your storyboard, select the `rangeSlider slider`.

2. Control-drag from the `rangeSlider slider` on your canvas to the code display in the editor on the right, stopping the drag at the line just below your changeColor action just added in *ViewController.swift*.

3. In the dialog that appears, for `Connection` select `Action`.

4. For `Name`, type `rangeSliderChanged`. Click Connect.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/16.png "slider action")

Leave both actions empty for now.

### Populate the Picker view with Data

Let’s create the data that we’re going display in the `Picker control`.

1. Under changeButton variable at the top of *ViewController.swift*, add the following:

`var pickerData: [String] = [String]()`

This new Array variable will store the list of data.

Now that the Array is iniatialized, let's store some value in it.

2. Inside the method `viewDidLoad()`, copy-paste the following:

`pickerData = ["yellow", "red", "orange", "magenta", "lightgray", "green", "cyan", "teal", "pink", "white"]`

### Connect the Data with the Picker view

1. Go to *ViewController.swift*.

2. Make this class conform to the `UIPickerViewDelegate` and `UIPickerViewDataSource` protocols.

Just like code below:

`class ViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {
...`

3. Set this `ViewController` instance as the delegate and datasource of the `Picker View` by adding the following lines inside the method `viewDidLoad()`:

```swift
    override func viewDidLoad() {
        // ...
        // Connect data:
        self.colorPicker.delegate = self
        self.colorPicker.dataSource = self
        // ...
    }
```

4. In *ViewController.swift*, just above the last curly brace ( } ), add the following stubs to conform to the protocol:

```swift
class ViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {
    // ...
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
    // ...
}
```

The following lines are BONUS, I have added some supplements setup to have a better UI, you can just copy-paste these in the method `viewDidLoad()`:
```swift
    override func viewDidLoad() {
    // ...
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
     // ...
     }
```

You are now done with the UI (See image below) and we can now move on to implement the color feature based on geomatching.

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180403/img/4.png "final UI")

Have a look at the end of what your *ViewController.swift* file should contain.

Make sure it corresponds, else you can download the [completed part one](https://github.com/matchmore/tech-blog/tree/master/20180403/code/myColorApp)

I hope you enjoyed reading this tutorial and wish you good luck!

Make sure to not miss the second part. We will cover the integration of Matchmore, to make the app able to spread color to near detected devices screen!




*ViewController.swift* file:
```swift
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
    }
    @IBAction func rangeSliderChanged(_ sender: Any) {
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
```
