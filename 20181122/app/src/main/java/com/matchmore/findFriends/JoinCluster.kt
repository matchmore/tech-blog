package com.matchmore.findFriends

import android.Manifest
import android.annotation.SuppressLint
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.gun0912.tedpermission.PermissionListener
import com.gun0912.tedpermission.TedPermission
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Publication
import io.matchmore.sdk.api.models.Subscription

class JoinCluster : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_join_cluster)

        val API_KEY =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiNzVhYWNjNTgtMTQ5Ny00YWJkLTllZGYtYzMxYzc3ZmNjNjZhIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MzYzMzQwMjEsImlhdCI6MTUzNjMzNDAyMSwianRpIjoiMSJ9.axH0EzmeSlzaXNAbF_0IEo3uBSySaymT1jFi3-qo2hekSsJIai8SLc6AADK_3Zew-ptkqUPnrH_kxpRjS7gBuA"
        if (!Matchmore.isConfigured()) {
            Matchmore.config(this, API_KEY, false)
        }
        checkLocationPermission()


        val IDT = findViewById<EditText>(R.id.idJoin)
        val JOINBTN = findViewById<Button>(R.id.joinClusterBtn)
        val FIND = findViewById<Button>(R.id.find)
        FIND.visibility = View.GONE


        JOINBTN.setOnClickListener()
        {
            val id: String = IDT.text.toString()
            createSub("cluster", id, 180.0)
            val match = findViewById<TextView>(R.id.match)
            match.text = "No crew found with this ID\n Please wait..."
            checkMatches()
        }
    }

    private fun createSub(topic: String, cluster_ID: String, duration: Double) {
        Log.d("debug", "createSub")
        Matchmore.instance.apply {
            startUsingMainDevice({ d ->
                Log.d("debug", "location_sub" + d.location.toString())
                Matchmore.instance.locationManager.lastLocation
                val SUBSCRIPTION = Subscription(topic, 500.0, duration)
                SUBSCRIPTION.selector = "cluster_ID = '${cluster_ID}'"

                Log.d("debug", SUBSCRIPTION.selector.toString())
                createSubscriptionForMainDevice(SUBSCRIPTION, { result ->
                    Log.d("debug", "Subscription made successfully with topic ${result.topic}")

                }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }
    }

    private fun createPub(topic: String, name: String, room_name: String, duration: Double) {
        Matchmore.instance.apply {
            startUsingMainDevice({ device ->
                val PUB = Publication(topic, 500.0, duration)
                PUB.properties = hashMapOf(
                    "created_by" to name,
                    "room_name" to room_name,
                    "location" to Matchmore.instance.locationManager.lastLocation!!.toString()
                )
                createPublicationForMainDevice(PUB,
                    { result ->
                        Log.d("debug", "Publication made successfully on this topic " + PUB.topic)
                    }, Throwable::printStackTrace
                )
            }, Throwable::printStackTrace)
        }
    }

    private fun checkMatches() {
        var is_match: Boolean? = false
        val MATCH = findViewById<TextView>(R.id.match)
        val JOINBTN = findViewById<Button>(R.id.joinClusterBtn)
        val BUNDLE = intent.extras
        var name: String = BUNDLE.get("name").toString()
        val IDT = findViewById<EditText>(R.id.idJoin)
        val ROOM_NUMBER: String = IDT.text.toString()
        val FINDBTN = findViewById<Button>(R.id.find)

        Matchmore.instance.apply {
            //Start fetching matches
            matchMonitor.addOnMatchListener { matches, _ ->

                //We should get there every time a match occur
                Log.d("debug", "We got ${matches.size} matches")
                Log.d("debug", "Matches =  $matches")
                MATCH.text =
                        "You've successfully joined the crew of ${matches.first().publication!!.properties["created_by"]}!"

                //We hide the join button when the user join a group to avoid creating many subscriptions
                JOINBTN.visibility = View.GONE

                //We show the button that will allow the user to locate his mates
                FINDBTN.visibility = View.VISIBLE

                if (is_match != true) {
                    is_match = true
                    // If a match occur, we create only one publication of a short duration just to tell to the owner of the group that we've joined his group
                    createPub("cluster_joined_" + ROOM_NUMBER, name, ROOM_NUMBER, 1.0)
                    Log.d("debug", "cluster_joined_" + ROOM_NUMBER)
                }

                FINDBTN.setOnClickListener()
                {
                    intent.setClass(this@JoinCluster, Live::class.java)
                    intent.putExtra("name", name).putExtra("room_number", ROOM_NUMBER)
                    startActivity(intent)
                }

            }

            matchMonitor.startPollingMatches()

        }
    }


    private fun checkLocationPermission() {
        val PERMISSIONLISTENER = object : PermissionListener {
            override fun onPermissionDenied(deniedPermissions: MutableList<String>?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }

            @SuppressLint("MissingPermission")
            override fun onPermissionGranted() {
                Matchmore.instance.apply {
                    startUpdatingLocation()
                    startRanging()
                }
            }

            fun onPermissionDenied(deniedPermissions: ArrayList<String>) {
                Toast.makeText(this@JoinCluster, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
        }
        TedPermission.with(this)
            .setPermissionListener(PERMISSIONLISTENER)
            .setDeniedMessage("Permission Denied")
            .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
            .check()
    }

}
