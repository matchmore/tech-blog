using System;
using Xamarin.Forms;
using shared_economy_app.Views;
using Xamarin.Forms.Xaml;
using Matchmore.SDK;
using System.Linq;
using sharedeconomyapp;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]
namespace shared_economy_app
{
    public partial class App : Application
    {

        public App()
        {
            InitializeComponent();

            MainPage = new MainPage();
        }

        protected override void OnStart()
        {
            Matchmore.SDK.Matchmore.ConfigureAsync(new GenericConfig
            {
                LocationService = new MyLocationService(),
                StateManager = new MobileStateManager(),
                ApiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJhbHBzIiwic3ViIjoiMjVjYWEyNWQtYjM4NC00NGNiLWFlY2EtYjAzYThhNmY2NjZhIiwiYXVkIjpbIlB1YmxpYyJdLCJuYmYiOjE1MjkzMjk5NzYsImlhdCI6MTUyOTMyOTk3NiwianRpIjoiMSJ9.hdheCPatHukTDyWqv74gNrAMlBkBTBTopIgrOJPEZqSDEHLkFZ66hLXdkfAfycCocXxy8oQunjfE1ER9ZSP1Yw",

            }).GetAwaiter().GetResult();
            var instance = Matchmore.SDK.Matchmore.Instance;
            instance.SetupMainDeviceAsync().GetAwaiter().GetResult();

            instance.StartLocationService();
              
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
