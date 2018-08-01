using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;
using Xamarin.Forms;

using shared_economy_app.Models;
using shared_economy_app.Views;
using System.Windows.Input;
using Matchmore.SDK;

namespace shared_economy_app.ViewModels
{
    public class ItemsViewModel : BaseViewModel
    {
        public ObservableCollection<Item> Items { get; set; }
        public Command LoadItemsCommand { get; set; }
        private ICommand _searchCommand;
        public ICommand SearchCommand => _searchCommand ?? (_searchCommand = new Command<string>(async (text) => await UpdateSearch(text)));

        private async Task UpdateSearch(String text) {
                    var searchSub = Matchmore.SDK.Matchmore.Instance.ActiveSubscriptions.FirstOrDefault();
            if (searchSub != null)
            {
                await Matchmore.SDK.Matchmore.Instance.DeleteSubscriptionAsync(searchSub.Id);
            }

            var selector = $"name LIKE \"{text}\" or description LIKE \"{text}\"";

            var sub = await Matchmore.SDK.Matchmore.Instance.CreateSubscriptionAsync(new Subscription
            {
                Range = 1000,
                Duration = 24 * 60 * 60,
                Topic = "shared-economy-app",
                Selector = selector
            });
        }

        public ItemsViewModel()
        {
            Title = "Browse";
            Items = new ObservableCollection<Item>();
            LoadItemsCommand = new Command(async () => await ExecuteLoadItemsCommand());

            MessagingCenter.Subscribe<NewItemPage, Item>(this, "AddItem", async (obj, item) =>
            {
                var _item = item as Item;
                Items.Add(_item);
                await DataStore.AddItemAsync(_item);
            });
        }

        async Task ExecuteLoadItemsCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                Items.Clear();
                var items = await DataStore.GetItemsAsync(true);
                foreach (var item in items)
                {
                    Items.Add(item);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}