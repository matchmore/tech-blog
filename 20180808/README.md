# Quick and easy way to start with Matchmore: Xamarin

We previouly covered SDK for _Swift_, _Kotlin_ and _Javascript_, now we will cover Xamarin, the favourite tools in the .NET developers toolbelt for mobile applications!

We will be making a app for localized borrowing of items, like you want to install a shelf and you need a drill just for one job. Maybe somebody nearby will have one and will lend it to you for a beer or a hug?

The examples will be done in Visual Studio for Mac, but most steps should be similar in case of the classical Visual Studio for Windows.

Create a new multiplatform *Forms App*

![create-project](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180808/img/1-create-project.png "create-project")


Lets opt in for use of .NET Standard and skip generating the mobile backend. We want to use Matchmore for this.

![create-project-2](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180808/img/2-create-project-2.png "create-project-2")

Follow the wizard until you get to your created project.

# Install Matchmore SDK

The Matchmore SDK is available as a NUGET package.

## NuGet package

A NuGet-walkthrough can be found here https://docs.microsoft.com/en-us/visualstudio/mac/nuget-walkthrough

Make sure to choose the pure .NET Standard, *Matchmore.SDK* not, *Matchmore.Xamarin.SDK*. The latter is useful for older projects using Shared Code and contain some bridging code but we will show you how to circumvent it in this blog post.


## Running the app

Lets run the app for the first time, I've selected the iOS version as the startup project and hit Command + Enter.

![4-emulator-list](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180808/img/4-emulator-list.png "4-emulator-list")

We will update the template to leverage Matchmore!

Lets create a borrowing app. 

## Get API key

Now let's create a new application on Matchmore Portal and obtain the API key that we will use to configure SDK later on.
After logging in ([register for free here](http://matchmore.com/account/register/)) you do the following:

![alt text](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180329/img/create-app.gif "create app")

And now lets use the key, in the application. An good place is the App.xaml.cs file in the Project which is shared for both platforms.


```csharp
protected override void OnStart()
        {
            //1
            Matchmore.SDK.Matchmore.ConfigureAsync(new GenericConfig
            {
                ApiKey = "<YOUR API KEY>"
            }).GetAwaiter().GetResult();

            //2
            Matchmore.SDK.Matchmore.Instance.SetupMainDeviceAsync().GetAwaiter().GetResult();

            //3
            Matchmore.SDK.Matchmore.Instance.StartLocationService();
        }

```

1. Setting up the general static instance of the SDK
2. Setting up the default device of the SDK. I will persist some metadata locally on the client device as well create a device in the Matchmore service.

3. Starting the location service.
And here there are couple of cavets we need to touch upon.

We mentioned earlier about the Xamarin specific version of the SDK, and that we are using the .NET Standard.

So we need to fill in some piecies and gives better control over this from your application.

We implement the `ILocationService` interface

```csharp
    public class MyLocationService : ILocationService
    {

        public event EventHandler<LocationUpdatedEventArgs> LocationUpdated;

        public void Start()
        {
            
        }

        public void Stop()
        {
            
        }
    }
    
```

Lets use a [class](https://github.com/matchmore/net-sdk/blob/master/Matchmore.SDK.Xamarin.Shared/GeoPluginLocationService.cs) we already implemented and using the Geolocator plugin written for Xamarin. Add the the geolocator via nuget, try searching for `Xam.Plugin.Geolocator`. This is an example how to do it, if your application already has some infrastructure for obtaining location, you can adapt it and plug it into the Matchmore SDK.

Last step is using the Location Service

```csharp
Matchmore.SDK.Matchmore.ConfigureAsync(new GenericConfig
            {
                ApiKey = "<YOUR API KEY>",
                LocationService = new MyLocationService()
            }).GetAwaiter().GetResult();
```

In similar fashion you might want to implement your own persistence mechanisms, just implement the `IStateRepository` and wire it in. [Example implementation specific for Xamarin](https://github.com/matchmore/net-sdk/blob/master/Matchmore.SDK.Xamarin.Shared/MobileStateManager.cs)

## Device privileges

You might get an exception concerning device privileges, it is perfectly normal. [Read up this section from our documentation page.](https://docs.matchmore.io/#net-configuration)

## Using Matchmore

We got here! We are wired up and ready to roll!

Lets start from adding ability to tell people that we have a lendable item.

Navigate to `MockDataSource.cs` and rename it to `MatchmoreDataSource.cs` and continue refactoring it to leverage Matchmore. Remove the mocking code and create a monitor to get matches.

```csharp
        List<Item> items;
        private Matchmore.SDK.Matchmore matchmore;

        public MatchmoreDataStore()
        {
            items = new List<Item>();
            matchmore = Matchmore.SDK.Matchmore.Instance;
            var monitor = matchmore.SubscribeMatches();
            monitor.MatchReceived += (sender, e) =>
            {
                //fill here later
            };
        }

```

To no produce to much boilerplate for our example, lets hijack the `Item` class and make it do some more work for us.

Change the `List` to a `HashSet` to handle duplication and modify the `Item` class accordingly.

```csharp
    public class Item
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
        Publication _publication;

        public Publication Publication
        {
            get
            {
                return _publication;
            }

            set
            {
                _publication = value;
                this.Id = value.Id;
            }
        }

        public Item() {
        }

        public Item(Publication publication){
            this.Publication = publication;
            this.Id = Publication.Id;
            this.Description = Publication.Properties["description"].ToString();
            this.Text = Publication.Properties["name"].ToString();
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Item))
                return false;
            var i = obj as Item;
           return  i.Id == this.Id;
        }
    }
```

And then we modify the event delegate to add Items.

```csharp
monitor.MatchReceived += (sender, e) =>
            {
                foreach (var match in e.Matches)
                {
                    items.Add(new Item(match.Publication));
                }
            };
monitor.Start();
```

Now lets modify the storage to update create a `Publication` when we add an Item.

```csharp
        public async Task<bool> AddItemAsync(Item item)
        {
            var pub = await matchmore.CreatePublicationAsync(new Publication
            {
                Range = 1000,
                Duration = 24 * 60  * 60,
                Properties = new Dictionary<string, object>{
                    {"name", item.Text},
                    {"description", item.Description}
                },
                Topic = "shared-economy-app"
            });

            item.Publication = pub;

            items.Add(item);

            return await Task.FromResult(true);
        }
```

We added Publication Ids to track these entities later in an easer fasshion.

Similarly we can update other CRUD methods, for example getting all matches

```csharp
 public async Task<IEnumerable<Item>> GetItemsAsync(bool forceRefresh = false)
        {
            var matches = await matchmore.GetMatchesAsync();
            foreach (var match in matches)
            {
                items.Add(new Item(match.Publication));
            }
            return await Task.FromResult(items);
        }
```

Great, now we need to subscribe to other postings

For now lets add a simple subscription, lets get everything published in our vicinity.

In the App.xaml.cs, OnStart method add

```csharp
if (!Matchmore.SDK.Matchmore.Instance.ActiveSubscriptions.Any()){
               var sub = Matchmore.SDK.Matchmore.Instance.CreateSubscriptionAsync(new Subscription
                {
                    Range = 1000,
                    Duration = 24 * 60 * 60,
                    Topic = "shared-economy-app",
                    Selector = ""
                }).GetAwaiter().GetResult();  
            }
```

Here immediatally you can notice that adding a new publication will get you a *match*, you were matched with your own publication. Since we are using a HashSet we are worry-free.

Ok, we got a simple sharing app done and ready, but now we search for everything. Better to add a functionality to narrow down the lendable items.

In the `ItemsPage.xaml` in the outer StackLayout add
```xml
<SearchBar x:Name="SearchBar" SearchCommand="{Binding SearchCommand}" SearchCommandParameter="{Binding Text, Source={x:Reference SearchBar}}"></SearchBar>
```

And in the `ItemsViewModel.cs` add the bounded search command

```csharp
        private ICommand _searchCommand;
        public ICommand SearchCommand
        {
            get
            {
                return _searchCommand ?? (_searchCommand = new Command<string>(async(text) => await UpdateSearch(text)));
            }
        }
```

And then the method

```csharp
 private async Task UpdateSearch(String text) {
            //1
            var searchSub = Matchmore.SDK.Matchmore.Instance.ActiveSubscriptions.FirstOrDefault();
            if (searchSub != null)
            {
                await Matchmore.SDK.Matchmore.Instance.DeleteSubscriptionAsync(searchSub.Id);
            }
            //2
            var selector = "";

            //3
            var sub = await Matchmore.SDK.Matchmore.Instance.CreateSubscriptionAsync(new Subscription
            {
                Range = 1000,
                Duration = 24 * 60 * 60,
                Topic = "shared-economy-app",
                Selector = selector
            });
        }
```

1 is about removing the old subscription.
2 is the Selector and (3) creating subscription.

The Selector is a SQL conditional following the SQL92 specification.

So lets write a query to find publications where the term is in the name or description

```csharp
var selector = $"name LIKE \"{text}\" OR description LIKE \"{text}\"";
```

Great, now we can subscribe for other publications and borrow stuff from out neighbours!

![5-list](https://raw.githubusercontent.com/matchmore/tech-blog/master/20180808/img/5-list.png "5-list")

Thats it for today! From here we can extrapolate and create an awesome application using Xamarin and Matchmore!