package com.matchmore.newsapp

import android.Manifest
import android.annotation.SuppressLint
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.gun0912.tedpermission.PermissionListener
import com.gun0912.tedpermission.TedPermission
import io.matchmore.sdk.Matchmore
import io.matchmore.sdk.api.models.Publication


class WriteActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.write)

        val API_KEY = "YOUR_API_KEY_HERE"
        if (!Matchmore.isConfigured())
        {
            Matchmore.config(this,API_KEY,false)
        }

        val title_txt = findViewById(R.id.title) as EditText
        val content_txt = findViewById(R.id.content) as EditText
        val status_txt = findViewById(R.id.status) as TextView
        val submit_btn = findViewById(R.id.submit) as Button

        val title = title_txt.text
        val content = content_txt.text

        submit_btn.setOnClickListener()
        {
            Matchmore.instance.apply {
                startUsingMainDevice ({ device ->
                    val pub = Publication("news2", 500.0, 180.0)
                    pub.properties = hashMapOf("title" to title.toString(), "content" to content.toString())
                    createPublicationForMainDevice(pub,
                            { result ->
                                Log.d("debug","Publication made successfully with topic "+pub.topic.toString())
                                status_txt.setText("Publication made successfully")
                            }, Throwable::printStackTrace)
                }, Throwable::printStackTrace)
            }
        }
        checkLocationPermission()
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
                Toast.makeText(this@WriteActivity, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
        }
        TedPermission.with(this)
                .setPermissionListener(permissionListener)
                .setDeniedMessage("Permission Denied")
                .setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
                .check()
    }
}
