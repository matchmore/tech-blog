package com.matchmore.findFriends

import android.Manifest
import android.annotation.SuppressLint
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.ListView
import android.widget.Toast
import com.gun0912.tedpermission.PermissionListener
import com.gun0912.tedpermission.TedPermission
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Subscription


class TouringGuide : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_touring_guide)

        //Matchmore.com  - Test_app
        val API_KEY =
            "YOUR_API_KEY"
        if (!Matchmore.isConfigured()) {
            Matchmore.config(this, API_KEY, false)
        }
        Toast.makeText(this, "This layout will be updated if you come close to a Beacon", Toast.LENGTH_LONG).show()
        checkLocationPermission()
        createSub()
        getMatches()


    }

    private fun createSub() {
        Matchmore.instance.apply {
            startUsingMainDevice({ device ->
                val SUBSCRIPTION = Subscription("beacon131", 500.0, 300.0)
                createSubscriptionForMainDevice(SUBSCRIPTION, {
                    Log.d("debug", "Subscription made successfully on this device ${device.id}")
                }, Throwable::printStackTrace)
            }, Throwable::printStackTrace)
        }
    }


    private fun getMatches() {
        var rsl: ArrayList<String> = ArrayList()
        val LISTVIEW = findViewById<ListView>(R.id.cv)
        Matchmore.instance.apply {
            // Start fetching matches
            matchMonitor.addOnMatchListener { matches, _ ->
                // We should get there every time a match occur
                Log.d("debug", "We got ${matches.size} matches")
                val FIRST = matches.first()

                // Let's fill our Array with the properties of the publication
                rsl.add(FIRST.publication!!.toString())

                var a1 = ArrayList<Shop>()
                var s1 = Shop()
                s1.shop_name = FIRST.publication!!.properties["shop_name"] as String
                s1.description = FIRST.publication!!.properties["description"] as String
                s1.img_url = FIRST.publication!!.properties["img_url"] as String

                a1.add(s1)

                val ADAPTER = BeaconAdapter(this@TouringGuide, a1)
                LISTVIEW.adapter = ADAPTER
                LISTVIEW.setOnItemClickListener { parent, view, position, id ->
                    Toast.makeText(this@TouringGuide, view.toString(), Toast.LENGTH_SHORT).show()
                }
            }
            matchMonitor.startPollingMatches(1000)
        }
    }

    private fun checkLocationPermission() {
        val PERMISSIONLISTENER = object : PermissionListener {
            override fun onPermissionDenied(deniedPermissions: MutableList<String>?) {
                TODO("not implemented")
            }

            @SuppressLint("MissingPermission")
            override fun onPermissionGranted() {
                Matchmore.instance.apply {
                    startUpdatingLocation()
                    Log.d("debug", "start ranging")
                }
            }

            fun onPermissionDenied(deniedPermissions: ArrayList<String>) {
                Toast.makeText(this@TouringGuide, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
        }

        TedPermission.with(this)
            .setPermissionListener(PERMISSIONLISTENER)
            .setDeniedMessage("Permission Denied")
            .setPermissions(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN
            )
            .check()
    }
}
