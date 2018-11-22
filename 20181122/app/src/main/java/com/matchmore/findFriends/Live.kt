package com.matchmore.findFriends

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AlertDialog
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Publication
import io.matchmore.sdk.api.models.Subscription
import java.util.ArrayList
import kotlin.collections.HashMap


class Live : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mMap: GoogleMap
    val MY_PERMISSIONS_REQUEST_LOCATION = 100
    private var update: Boolean = true
    private var TAG = "Alpha"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val MAPFRAGMENT = supportFragmentManager
            .findFragmentById(R.id.mapView) as SupportMapFragment
        MAPFRAGMENT.getMapAsync(this)

        // Configure Matchmore
        confMatchmore()
        Matchmore.instance.startUsingMainDevice()

        // Enter fullscreen mode
        hideSystemUI()
    }

    fun confMatchmore() {
        val API_KEY =
            "YOUR_API_KEY"
        if (!Matchmore.isConfigured()) {
            Matchmore.config(this, API_KEY, true)
        }
    }

    override fun onResume() {
        super.onResume()
        checkLocationPermission()
        Matchmore.instance.apply {
            startUpdatingLocation()
            startRanging()
            Matchmore.instance.matchMonitor.startPollingMatches()
        }
    }

    override fun onPause() {
        super.onPause()
        Matchmore.instance.apply {
            stopUpdatingLocation()
            stopRanging()
            Matchmore.instance.matchMonitor.stopPollingMatches()
        }
    }

    private fun createPub(groupName: String, username: String) {
        Log.d(TAG, "create Pub")

        // We consider a cluster as being a publication with his ID as a property
        Matchmore.instance.apply {
            startUsingMainDevice({ d ->
                val PUB = Publication(groupName, 5000.0, 172800.0)
                PUB.properties = hashMapOf("created_by" to username)
                PUB.properties = hashMapOf("created_by" to username)
                Matchmore.instance.createPublicationForMainDevice(
                    PUB, { result ->
                        Toast.makeText(this@Live, "Refreshing...", Toast.LENGTH_LONG).show()
                        Log.d(TAG, "Publication made successfully: " + PUB.toString())
                    }, Throwable::printStackTrace
                )
            })
        }
    }

    private fun createSub(groupName: String) {
        // The subscription is use to find the other devices
        // This subscription, used as an acknowledgement will embed the cluster ID in his topic
        Matchmore.instance.apply {
            startUsingMainDevice({ d ->
                // Duration set to 2 days
                val SUBSCRIPTION = Subscription(groupName, 5000.0, 172800.0)
                SUBSCRIPTION.matchDTL = 5.0
                Matchmore.instance.createSubscriptionForMainDevice(SUBSCRIPTION, { result ->
                    Log.d(TAG, "Subscription made successfully on topic ${result.topic}")
                }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }
    }


    override fun onMapReady(googleMap: GoogleMap) {

        mMap = googleMap
        // Move the camera to Lausanne
        val LAUSANNE = LatLng(46.521, 6.583)
        // mMap.addMarker(MarkerOptions().position(lausanne).title("Marker in Sydney"))
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(LAUSANNE, 5F))
        mMap.mapType = GoogleMap.MAP_TYPE_SATELLITE

        mMap.isBuildingsEnabled = true

        Toast.makeText(this@Live, "Loading, please wait...", Toast.LENGTH_LONG)
        val BUNDLE = intent.extras
        var name: String = BUNDLE.get("name").toString()
        var groupName: String = BUNDLE.get("groupName").toString()

        // sendLocation()
        val CLUSTERNAME = findViewById<TextView>(R.id.groupId)
        val ID = groupName
        CLUSTERNAME.text = ID.toString()

        createSub(groupName)
        createPub(groupName, name)
        getMatches(groupName)


        val TOGGLE = findViewById<com.github.clans.fab.FloatingActionButton>(R.id.toggle)
        val HELP = findViewById<com.github.clans.fab.FloatingActionButton>(R.id.help)
        val TRACKING = findViewById<com.github.clans.fab.FloatingActionButton>(R.id.tracking)

        var sv = findViewById<ConstraintLayout>(R.id.sv)

        var heightSet = false
        var trackingSet = true

        TOGGLE.setOnClickListener {
            var layoutParam = sv.layoutParams

            if (!heightSet) {
                layoutParam.height *= 2
                sv.layoutParams = layoutParam
                heightSet = true
                TOGGLE.labelText = "Less details"
            } else {
                layoutParam.height /= 2
                sv.layoutParams = layoutParam
                heightSet = false
                TOGGLE.labelText = "More details"
            }
        }
        HELP.setOnClickListener {
            Toast.makeText(
                this,
                "Tell your friends to join you in the same group. \n Your position is refreshed every time you move up to 5 meters",
                Toast.LENGTH_LONG
            ).show()
        }
        TRACKING.setOnClickListener {
            if (trackingSet) {
                trackingSet = false
                update = false
                Log.d(TAG, update.toString())
                Toast.makeText(this@Live, "Tracking disabled", Toast.LENGTH_LONG).show()
                TRACKING.labelText = "Start tracking"
                Matchmore.instance.stopUpdatingLocation()
            } else {
                trackingSet = true
                update = true
                Toast.makeText(this@Live, "Tracking enabled", Toast.LENGTH_LONG).show()
                TRACKING.labelText = "Stop tracking"
                Matchmore.instance.startUpdatingLocation()

            }

        }

    }

    private fun getMatches(groupName: String) {
        val LISTVIEW = findViewById<ListView>(R.id.list_members)
        var buddy: String
        var buddy_location: String
        var person = HashMap<String, Marker>()

        // Empty Array that will be used to store the properties of the publications
        var location: ArrayList<String> = ArrayList()

        Matchmore.instance.apply {
            // Start fetching matches
            matchMonitor.addOnMatchListener { matches, _ ->
                // We should get there every time a match occur

                var rsl: ArrayList<String> = ArrayList()
                Log.d(TAG, "We got ${matches.size} matches")

                // Select Distinct in order to take only the relevant matches only once
                var m = matches.distinctBy { it.publication!!.properties["created_by"] }

                for (it in m) {
                    if ((it.publication!!.topic.toString()).equals(groupName)) {

                        // Let's fill our Array with the properties of the publication
                        buddy = it.publication!!.properties["created_by"].toString()
                        Log.d(TAG, "created by " + buddy)

                        buddy_location = it.publication!!.location.toString()
                        rsl.add(buddy)
                        location.add(buddy_location)

                        var adapter = ArrayAdapter(this@Live, android.R.layout.simple_list_item_1, rsl)
                        LISTVIEW.adapter = adapter

                        // Let's put the data on a map
                        var positionLat = it.publication!!.location!!.latitude
                        var positionLong = it.publication!!.location!!.longitude
                        var latLong: LatLng = LatLng(positionLat!!, positionLong!!)

                        val MARKEROPTIONS = MarkerOptions().position(latLong).title(buddy).snippet("Team Member")
                        val CAMERAPOSITION = CameraPosition.Builder()
                            .target(latLong)
                            .zoom(18f)                   // Sets the zoom
                            .bearing(90f)                // Sets the orientation of the camera to east
                            .tilt(60f)                   // Sets the tilt of the camera to 30 degrees
                            .build()

                        mMap.animateCamera(CameraUpdateFactory.newCameraPosition(CAMERAPOSITION))

                        if (person.containsKey(buddy)) {
                            Log.d(TAG, "updating marker")
                            val OLDMARKER: Marker? = person[buddy]
                            OLDMARKER!!.remove()
                            var newMarker = mMap.addMarker(MARKEROPTIONS)
                            person.replace(buddy, newMarker)
                            Log.d("debug - Position of it1 = ", person[buddy]!!.position.toString())
                        } else {
                            val MARKER = mMap.addMarker(MARKEROPTIONS)
                            Log.d(TAG, "Creating a new Marker " + buddy + " " + MARKER)
                            person.put(buddy, MARKER)
                        }
                    }
                }
            }
            matchMonitor.startPollingMatches(5000)
        }
    }

    private fun hideSystemUI() {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
    }

    private fun checkLocationPermission(): Boolean {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(
                    this,
                    Manifest.permission.ACCESS_FINE_LOCATION
                )
            ) {

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.
                AlertDialog.Builder(this)
                    .setTitle("Location permission")
                    .setMessage("You need the location permission for some things to work")
                    .setPositiveButton("OK") { _, i ->
                        // Prompt the user once explanation has been shown
                        ActivityCompat.requestPermissions(
                            this@Live,
                            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                            MY_PERMISSIONS_REQUEST_LOCATION
                        )
                    }
                    .create()
                    .show()
            } else {
                // No explanation needed, we can request the permission.
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                    MY_PERMISSIONS_REQUEST_LOCATION
                )
            }
            return false
        } else {
            return true
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>, grantResults: IntArray
    ) {
        when (requestCode) {
            MY_PERMISSIONS_REQUEST_LOCATION -> {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    // permission was granted, yay! Do the
                    // location-related task you need to do.
                    if (ContextCompat.checkSelfPermission(
                            this,
                            Manifest.permission.ACCESS_FINE_LOCATION
                        ) == PackageManager.PERMISSION_GRANTED
                    ) {
                        Matchmore.instance.apply {
                            startUpdatingLocation()
                            startRanging()
                        }
                    }
                } else {
                    Toast.makeText(this, "Permission denied", Toast.LENGTH_LONG)
                }
                return
            }
        }
    }
}
