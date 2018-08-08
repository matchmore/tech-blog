using System;

using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

namespace shared_economy_app.Droid
{
    [Activity(Label = "shared_economy_app", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        protected override void OnCreate(Bundle bundle)
        {
            TabLayoutResource = Resource.Layout.Tabbar;
            ToolbarResource = Resource.Layout.Toolbar;

            base.OnCreate(bundle);

            global::Xamarin.Forms.Forms.Init(this, bundle);
            const string p1 = Android.Manifest.Permission.AccessFineLocation;
            const string p2 = Android.Manifest.Permission.AccessCoarseLocation;
            RequestPermissions(new string[] { p1, p2 }, 0);
            LoadApplication(new App());
        }
    }
}

