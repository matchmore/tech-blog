package com.matchmore.findFriends

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import com.squareup.picasso.Picasso


class BeaconAdapter(private val context: Context, private val dataSource: ArrayList<Shop>) : BaseAdapter() {
    private val INFLATER: LayoutInflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater


    override fun getCount(): Int {
        return dataSource.size
    }


    override fun getItem(position: Int): Any {
        return dataSource[position]
    }


    override fun getItemId(position: Int): Long {
        return position.toLong()
    }


    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // Get view for row item
        val rowView = INFLATER.inflate(R.layout.list_item_shop, parent, false)

        // Get title element
        val titleTextView = rowView.findViewById(R.id.shop_list_title) as TextView

// Get subtitle element
        val subtitleTextView = rowView.findViewById(R.id.shop_list_subtitle) as TextView

// Get thumbnail element
        val thumbnailImageView = rowView.findViewById(R.id.shop_list_thumbnail) as ImageView


        val shop = getItem(position) as Shop


        titleTextView.text = shop.shop_name
        subtitleTextView.text = shop.description

        Picasso.with(context).load(shop.img_url).placeholder(R.mipmap.ic_launcher).into(thumbnailImageView)

        return rowView
    }

}