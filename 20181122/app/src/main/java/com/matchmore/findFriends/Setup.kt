package com.matchmore.findFriends

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast

class Setup : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup)

        val NAME = findViewById<EditText>(R.id.name)
        val GROUPNAME = findViewById<EditText>(R.id.groupName)
        val NEXT = findViewById<Button>(R.id.next)

        NAME.requestFocus()

        supportActionBar?.setDisplayHomeAsUpEnabled(true)


        NEXT.setOnClickListener {
            val NAMEVAL : String = NAME.text.toString()
            Log.d("debug", NAMEVAL)
            if (!NAMEVAL.equals("")) {
                intent.setClass(this, Live::class.java)
                intent.putExtra("name", NAMEVAL)
                    .putExtra("groupName", GROUPNAME.text.toString())
                startActivity(intent)
            } else {
                Toast.makeText(this@Setup, "The name should be filed", Toast.LENGTH_SHORT).show()
            }
        }

    }
}
