package com.matchmore.newsapp


import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.annotation.RequiresPermission
import android.util.Log
import android.widget.Button

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val read= findViewById(R.id.read) as Button
        val write= findViewById(R.id.write) as Button
        var intent = Intent ()

        read.setOnClickListener()
        {
            intent.setClass(this, ReadActivity::class.java)
            startActivity(intent)
        }

        write.setOnClickListener()
        {
            intent.setClass(this, WriteActivity::class.java)
            startActivity(intent)
        }
    }
}
