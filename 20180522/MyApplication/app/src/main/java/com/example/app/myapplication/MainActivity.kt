package com.example.app.myapplication

import android.Manifest
import android.annotation.SuppressLint
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.gun0912.tedpermission.PermissionListener
import com.gun0912.tedpermission.TedPermission
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Publication
import io.matchmore.sdk.api.models.Subscription
import io.matchmore.sdk.rx.rxDelete
import io.matchmore.sdk.rx.rxDeleteAll
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    private val API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiODU4MjdiOGMtNzZiYS00ZDM2LThjM2QtZWE5M2NkNmM1ZjRmIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MjY5MTczMzksImlhdCI6MTUyNjkxNzMzOSwianRpIjoiMSJ9.FFYY7AXdj8wX-kyIjtSRt0QtByaw40rpxmOI2pdJJ7DCgrMbXn7KMXAaCX1d-hg5sh4ZVw87Out6Mr2rdD2VTQ"
    private val TAG = "MatchMore"
    private var matchText: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Matchmore.config(context = this, apiKey = API_KEY, debugLog = false)

        val pub_btn = findViewById(R.id.pub) as Button
        val sub_btn = findViewById(R.id.sub) as Button

        setupDevice()

        pub_btn.setOnClickListener {
            addPub()
        }
        sub_btn.setOnClickListener {
            addSub()
        }
        matchText = findViewById(R.id.match_text) as TextView
        checkLocationPermission()
    }

    fun addPub() {
        // Create publication
        Matchmore.instance.apply {
            val publication = Publication("Test Topic", 2.0, 600.0)
            publication.properties = hashMapOf("color" to "red")
            createPublicationForMainDevice(publication, { result ->
                Log.i(TAG, "Publication created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }

    fun addSub() {
        // Create subscription
        Matchmore.instance.apply {
            val subscription = Subscription("Test Topic", 2.0, 600.0)
            subscription.selector = "color = 'red'"
            createSubscriptionForMainDevice(subscription, { result ->
                Log.i(TAG, "Subscription created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }

    private fun setupDevice() {
        Matchmore.instance.apply {
            startUsingMainDevice({ device ->
                Log.i(TAG, "start using main device ${device.name} ${device.id}")
                // Start fetching matches
                matchMonitor.addOnMatchListener { matches, _ ->
                    Log.i(TAG, "Matches found: ${matches.size}")
                    matches.map { m -> Log.i(TAG, "${m.createdAt}") }
                    matchText?.text = "⛰️got ${matches.size} matches⛰️"
                }
                matchMonitor.startPollingMatches(1000)
            }, Throwable::printStackTrace)
        }
    }

    private fun checkLocationPermission() {
        val permissionListener = object : PermissionListener {
            @SuppressLint("MissingPermission")
            override fun onPermissionGranted() {
                Matchmore.instance.apply {
                    startUpdatingLocation()
                    startRanging()
                }
            }

            override fun onPermissionDenied(deniedPermissions: ArrayList<String>) {
                Toast.makeText(this@MainActivity, R.string.if_you_reject, Toast.LENGTH_SHORT).show()
            }
        }
        TedPermission.with(this)
                .setPermissionListener(permissionListener)
                .setDeniedMessage(R.string.if_you_reject)
                .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
                .check()
    }

    override fun onResume() {
        super.onResume()
        Matchmore.instance.matchMonitor.startPollingMatches()
    }

    override fun onPause() {
        super.onPause()
        Matchmore.instance.matchMonitor.stopPollingMatches()
    }

    override fun onDestroy() {
        super.onDestroy()
        Matchmore.instance.apply {
            stopRanging()
            stopUpdatingLocation()
        }
    }
}
