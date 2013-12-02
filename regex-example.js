Items = new Meteor.Collection("items");

if (Meteor.isClient) {
  Template.allItems.helpers({
    items: function () {
      return Items.find();
    },
    text: function () { return Session.get("text"); },
    skip: function () { return Session.get("skip"); },
    limit: function () { return Session.get("limit"); }
  });

  Template.allItems.events({
    "submit form": function (evt, templ) {
      evt.preventDefault();
      Session.set("text", templ.find("#text").value);
      Session.set("skip", +templ.find("#skip").value);
      Session.set("limit", +templ.find("#limit").value);
    }
  });

  Session.setDefault("skip", 0);
  Session.setDefault("limit", 3);
  Session.setDefault("text", "l");

  Deps.autorun(function () {
    Meteor.subscribe("items",
                     Session.get("text"),
                     Session.get("skip"),
                     Session.get("limit"));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Items.find().count() === 0) {
      ["Lock", "Halo", "kile", "lobster", "lazy"
      ].forEach(function (n) { Items.insert({name: n}); });
    }
  });

  Meteor.publish("items", function (text, skip, limit) {
    return Items.find(
      {name: {$regex: '.*' + text + '.*', $options: 'i'}},
      {skip: skip, limit: limit});
  });
}
