package com.matchmore.newsapp


import android.Manifest
import android.annotation.SuppressLint
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.gun0912.tedpermission.PermissionListener
import com.gun0912.tedpermission.TedPermission
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Match
import io.matchmore.sdk.api.models.Publication
import io.matchmore.sdk.api.models.Subscription

class ReadActivity : AppCompatActivity() {

    private val API_KEY = "YOUR_API_KEY_HERE"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.read)

        if (!Matchmore.isConfigured())
        {
            Matchmore.config(this, API_KEY, false)
        }
        checkLocationPermission()
        addSub()
        checkMatches()
    }

    private fun checkMatches() {

        //Declare our ListView
        val listView = findViewById (R.id.list) as ListView

        // Empty Array that will used to store the properties of the publications
        var rsl: ArrayList<String> = ArrayList()

        Log.d("debug", "Check matches")

        Matchmore.instance.apply {
            startUsingMainDevice ({ device ->
                matchMonitor.addOnMatchListener { matches, _ ->

                    //We should get there every time a match occur
                    Log.d("debug", "We got ${matches.size} matches")

                    val first = matches.first()

                    //Let's fill our Array with the properties of the publication
                    rsl.add(first.publication!!.properties["content"].toString())

                    val adapter = ArrayAdapter(this@ReadActivity, android.R.layout.simple_list_item_1, rsl)
                    listView.adapter = adapter
                }

                matchMonitor.startPollingMatches()
            }, Throwable::printStackTrace)

        }
    }


    private fun addSub()
    {
        Matchmore.instance.apply {
            startUsingMainDevice ({ d ->
                val sub = Subscription ("news2", 100.0, 180.0)
                createSubscriptionForMainDevice(sub, {result ->
                    Log.d("debug", "Subscription made successfully with topic ${result.topic}")

                }, Throwable::printStackTrace)
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
                Toast.makeText(this@ReadActivity, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
        }
        TedPermission.with(this)
                .setPermissionListener(permissionListener)
                .setDeniedMessage("Permission Denied")
                .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
                .check()
    }
}
