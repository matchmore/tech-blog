using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Matchmore.SDK;
using shared_economy_app.Models;

[assembly: Xamarin.Forms.Dependency(typeof(shared_economy_app.Services.MatchmoreDataStore))]
namespace shared_economy_app.Services
{
    public class MatchmoreDataStore : IDataStore<Item>
    {
        HashSet<Item> items;
        private Matchmore.SDK.Matchmore matchmore;

        public MatchmoreDataStore()
        {
            items = new HashSet<Item>();
            matchmore = Matchmore.SDK.Matchmore.Instance;
            var monitor = matchmore.SubscribeMatches();
            monitor.MatchReceived += (sender, e) =>
            {
                foreach (var match in e.Matches)
                {
                    items.Add(new Item(match.Publication));
                }
            };
            monitor.Start();
        }

        public async Task<bool> AddItemAsync(Item item)
        {
            var pub = await matchmore.CreatePublicationAsync(new Publication
            {
                Range = 1000,
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

        public async Task<bool> UpdateItemAsync(Item item)
        {
            var _item = items.Where((Item arg) => arg.Id == item.Id).FirstOrDefault();
            items.Remove(_item);
            await matchmore.DeletePublicationAsync(_item.Publication.Id);

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

        public async Task<bool> DeleteItemAsync(string id)
        {
            var _item = items.Where((Item arg) => arg.Id == id).FirstOrDefault();
            items.Remove(_item);
            await matchmore.DeletePublicationAsync(_item.Publication.Id);

            return await Task.FromResult(true);
        }

        public async Task<Item> GetItemAsync(string id)
        {
            return await Task.FromResult(items.FirstOrDefault(s => s.Id == id));
        }

        public async Task<IEnumerable<Item>> GetItemsAsync(bool forceRefresh = false)
        {
            var matches = await matchmore.GetMatchesAsync();
            foreach (var match in matches)
            {
                items.Add(new Item(match.Publication));
            }
            return await Task.FromResult(items);
        }
    }
}