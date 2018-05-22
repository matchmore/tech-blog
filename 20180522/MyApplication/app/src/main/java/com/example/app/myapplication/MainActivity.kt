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
import io.matchmore.sdk.MatchMore
import io.matchmore.sdk.api.models.Publication
import io.matchmore.sdk.api.models.Subscription
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    private val API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiODU4MjdiOGMtNzZiYS00ZDM2LThjM2QtZWE5M2NkNmM1ZjRmIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MjY5MTczMzksImlhdCI6MTUyNjkxNzMzOSwianRpIjoiMSJ9.FFYY7AXdj8wX-kyIjtSRt0QtByaw40rpxmOI2pdJJ7DCgrMbXn7KMXAaCX1d-hg5sh4ZVw87Out6Mr2rdD2VTQ"
    private val TAG = "MatchMore"
    private var matchText: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        MatchMore.config(context = this, apiKey = API_KEY, debugLog = false)

        val pub_btn = findViewById(R.id.pub) as Button
        val sub_btn = findViewById(R.id.sub) as Button

        registerDevice()

        pub_btn.setOnClickListener {
            addPub()
        }
        sub_btn.setOnClickListener {
            addSub()
        }
        matchText = findViewById(R.id.match_text) as TextView
    }

    fun addPub() {
        // Create publication
        MatchMore.instance.apply {
            val publication = Publication("Test Topic", 1.0, 0.0)
            publication.properties = hashMapOf("test" to "true")
            createPublication(publication, { result ->
                Log.i(TAG, "Publication created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }

    fun addSub() {
        // Create subscription
        MatchMore.instance.apply {
            val subscription = Subscription("Test Topic", 1.0, 0.0)
            subscription.selector = "test = 'true'"
            subscription.deviceId = this.main?.id
            createSubscription(subscription, { result ->
                Log.i(TAG, "Subscription created ${result.topic}")
            }, Throwable::printStackTrace)
        }
    }

    private fun registerDevice() {
        MatchMore.instance.apply {
            startUsingMainDevice({ device ->
                Log.i(TAG, "start using device ${device.name}")

                // Start getting matches
                matchMonitor.addOnMatchListener { matches, _ ->
                    Log.i(TAG, "Matches found: ${matches.size}")
                    matchText?.text = "got ${matches.size} matches"
                }
                matchMonitor.startPollingMatches()
            }, Throwable::printStackTrace)
        }
    }

    private fun checkLocationPermission() {
        val permissionListener = object : PermissionListener {
            @SuppressLint("MissingPermission")
            override fun onPermissionGranted() {
                MatchMore.instance.apply {
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
        MatchMore.instance.matchMonitor.startPollingMatches()
    }

    override fun onPause() {
        super.onPause()
        MatchMore.instance.matchMonitor.stopPollingMatches()
    }

    override fun onDestroy() {
        super.onDestroy()
        MatchMore.instance.apply {
            stopRanging()
            stopUpdatingLocation()
        }
    }
}
