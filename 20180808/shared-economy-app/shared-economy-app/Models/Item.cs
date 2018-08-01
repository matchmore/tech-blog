using System;
using Matchmore.SDK;

namespace shared_economy_app.Models
{
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
}