Beacons are becoming more popular solution for tracking onjects in our world. In this post I will talk about about the limitation of the technology in regards to security and how to over come it. I will discribe current solution for the Bluetooth 4.0 beacons and propose more efficient solution (in terms of backend required and phone battery consumption) for Bluetooth 5.0 which is now entering the market.

# Beacons

![beacons](https://raw.githubusercontent.com/matchmore/tech-blog/master/20181022/Beacons.jpg "beacons")

A beacon is a Bluetooth device that uses the Bluetooth advertisement packages (a part of GAP protocol) to send data instead of paring with another device.
There is an additional restriction on the format of broadcasted packages. 
Bluetooth in standard 4.x allows to send up to 32 bytes of data, and beacon standard uses those data to encode minor, major and UUID of the beacon with a combination of additional information required by GAP protocol.
It all there is, beacon sends 16-byte UUID combined with 2byte long minor and major identifiers (4 bytes in total).
Because of that, it is relatively easy to spoof beacons, all it is required is to obtain UUID, minor and major number, which are advertised in plain text.
There are Apps from companies that are producing microcontrollers for beacons to do so: [Nordic App](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp).

Spoofing is not a big issue if beacons are used for convenience - for example, the beacon is near the painting in the museum, and it will activate your museum app to show you the details about it.
It becomes a bigger issue if you have to rely on the beacon to ensure someones/something is present in a given location. For example, you are doing promotion, 
for everyone that will visit your museum you provide them with a voucher for some goods. Malicious third part can copy your beacon triple and prepare fake beacon.
So your application will think that someone is in the museum but in fact, he will be on the street selling your museum vouchers to other people ruining desired promotion outcome.

# Secure Beacons

![security](https://raw.githubusercontent.com/matchmore/tech-blog/master/20181022/security.jpg "security")

The solution for beacon spoofing is to add on top of existing GAP protocol additional logic that would prevent spoofing. We have to work in boundaries of Bluetooth standard to not lose compatibility with all standard beacon libraries.
One way to do this is to periodically change beacon UUID and minor/major numbers according to some algorithm then implement the same logic on the server side that would resolve underlying beacon based on ephemeral values scanned by a mobile application. This is what [Edistone](https://developers.google.com/beacons/eddystone-eid) and [kontakt.io](https://support.kontakt.io/hc/en-gb/articles/206762009-Kontakt-io-Secure-Shuffling) are doing

One way to implement it is to derive beacon triple from some hashing function - for example SHA3(seed + sequence) it requires setting up seed for beacon and backend server, this can be done using standard Bluetooth connection (usually beacons are based on chips that support standard operation besides beacon mode), or when preparing firmware for specific beacon. For obvious reasons seed cannot be part of a mobile application (it can be extracted, and all anty spoofing is for nothing since an attacker can recreate the sequence of beacons triples) and have to be stored and resolved on the server side.

It is also possible to use asymmetric cryptography to further secure communication between beacon and service application when exchanging seed that will be used for beacon triple generation.

While this solution works fine, it requires an additional call to the backend server (usually the beacon vendor one) to resolve which beacon is in proximity base on a received ephemeral triple.
Also on the backend, you have to implement resolving logic, Google Edistone solution [link](https://developers.google.com/beacons/eddystone-eid-preprint.pdf) (section 3.3) assumes that all ephemeral triples are generated on the backend and pairs real triple - ephemeral triple are kept in the database. This is another limitation for the frequency of triple rotation since with every tick you have to generate mapping for all your active beacons.
With Bluetooth new specification there can be a way to eliminate this dependency for beacon resolving.

# Bluetooth 5

New Bluetooth standard gives us more options - in the new standard length of the GAP package is extended from 32 to 255 bytes. This allows adding more information into the advertising package that beacon sends. Also, Bluetooth 5 allows chaining advertisement packages to allow even more data to push from beacon to edge device (Raspberry Pi/mobile phone).

This additional space for data can be used for transferring sensor data from sensors attached to a beacon, but it can be used for other purposes. For example to add some authentication data that changes over time to prove that person/application reading particular beacon is actually in near proximity of the beacon instead of spoofing it.

The idea is to transfer some signed data (concatenated with a sequence number and beacon triple to prevent replay attack) to make spoofing impossible without knowing the private key used for signing. This way there is no need of sharing secret seed, you are just sharing a public key which does not require any secure channel to do so.
This, of course, requires lookup for the public key on the server side to be sure that private/public key pair is recognized as valid for given beacon, none the less it eliminates the need of establishing secure channel communication with beacon device.

The solution that eliminates the need for lookup is to use Bluetooth GAP packages (optionally with chaining) to send with signature also certificate issued by beacon vendor for the key pair used for signing. This way mobile app on its own can validate if the beacon is spoofed or authentic (and in the process save network round trip to the server and reduce battery usage), it only needs one public key to validate the certificate.
This approach mimics one that is implemented (and widely tested) in web browsers where there are certification authorities issuing certificates for particular domains.
In the case of beacons certification, the authority can be beacon vendor or company developing the app.
To implement such solution there is a need for custom software on beacon side. Beacon has to prepare correctly formatted GAP package.
First pack necessary beacon triple data, after that signed data and certificate. Sounds complicated, let's see what hardware/software do you need to implement something like that.

# Open source hardware

First, let's look int hardware that is easy to prototype on. There are open source beacon designs like [ruuvitag](https://www.postscapes.com/open-source-bluetooth-5-beacon-ruuvitag) that you can order, or if you want you can use hardware design files to order PCB from services like [jlcpcb](https://jlcpcb.com/) and solder it yourself.

The mentioned board contains a Nordic nrf52 chip which is an ARM-based microcontroller (the same is used in kontakt.io beacons) which have to be flashed with firmware. The firmware which you have to implement. There is [SDK](https://www.nordicsemi.com/eng/Products/Bluetooth-low-energy/nRF5-SDK) provided by NordicSemiconductors that works with GCC compiler. There are also examples of Beacon firmware that you can use as a starting point for your project.

One last thing is to flash your firmware onto the chip. To do that you have to use JLink programmer. Which is an expensive tool if you are using it for commercial purposes. There is a workaround for this that should be fine in the prototyping phase. There is [development kit provided by Nordic](https://www.nordicsemi.com/eng/Buy-Online?search_token=nRF52840-DK) that costs around 50$ that besides nref52 chip that supports Bluetooth 5.0 has also integrated JLink with routed out programming pins so you can use it with some jumper wires and breadboard to program Ruuvitag and do some field testing.

In case of any issues, you can always search/ask on [stack](https://devzone.nordicsemi.com/).

# Open source software

Besides using open hardware you can also use open software for your beacon, there is very good and secure [library for ECC on the ARM](https://github.com/kmackay/micro-ecc) that is perfect for discussed example. It allows you to sign data and algorithms used in that library prevents side channel attacks. 

Android since version 8.0 [link](https://blog.bluetooth.com/what-bluetooth-developers-should-know-about-android-o) supports Bluetooth 5 GAP packages (the one used by beacons). To scan for them you have to start Bluetooth Low Energy [scanning](https://developer.android.com/reference/android/bluetooth/le/BluetoothLeScanner.html#startScan(android.bluetooth.le.ScanCallback)), and if you get Bluetooth 5 package, you will get a longer package in ScanCallback.

With that only thing that is left is to design package structure of additional data packed into GAP advertisement of a beacon.

As you can see with the new version of Bluetooth, there are many new opportunities to explore, and options to introduce familiar concepts in a new context.

Happy hacking!

# References

The chip that supports Bluetooth 5.0: https://www.nordicsemi.com/eng/Products/Bluetooth-5

Library for crypto on beacons: https://github.com/kmackay/micro-ecc

Open source beacon design https://www.postscapes.com/open-source-bluetooth-5-beacon-ruuvitag

Google Eddystone beacons https://developers.google.com/beacons/eddystone-eid

Details about new advertising packages for Bluetooth 5 http://blog.bluetooth.com/exploring-bluetooth5-whats-new-in-advertising