$(function() {

	var Person = Backbone.Model.extend({
		defaults : {
			username : 'empty username...',
			age : 'empty age...',
			address : 'empty address'
		},
		validate : function(attrs) {
			var str;
			if ($.trim(attrs.username) === '') {
				str = 'username must be entered!'
				alert(str);
			}
			return str;
		}
	});

	var Persons = Backbone.Collection.extend({
		model : Person,
		localStorage : new Store('persons')
	});

	var persons = new Persons();

	var PersonView = Backbone.View.extend({
		tagName : 'li',

		initialize : function() {
			_.bindAll(this, 'render', 'changeOne');
			this.model.bind('change', this.changeOne)
		},

		events : {
			'click [name="remove"]' : 'remove'
		},

		remove : function() {
			$(this.el).remove();
			this.model.destroy();
		},

		template : _.template($('#personView').html()),

		changeOne : function() {
			var element = this.template(this.model.toJSON());
			$(this.el).html(element);
			return this;
		},

		render : function() {
			var element = this.template(this.model.toJSON());
			$(this.el).append(element);
			return this;
		}
	});

	var AppView = Backbone.View.extend({

		initialize : function() {
			_.bindAll(this, 'showList');
			persons.bind('add', this.showList);
			persons.bind('reset', this.showAll);
			persons.fetch();
		},


		el : '#container',

		events : {
			'click #create' : 'addOne',
			'click #showLength' : 'showLength'
		},

		showLength : function() {
			alert('total person number:' + persons.length);
		},

		addOne : function() {
			var username = $.trim($(this.el).find('input[name="username"]').val());
			var age = $.trim($(this.el).find('input[name="age"]').val());
			var address = $.trim($(this.el).find('input[name="address"]').val());
			var obj = {
				username : username,
				age : age,
				address : address
			};

			var p = new Person();
			var result = p.set(obj);

			var temp = persons.findWhere({username : username});

			if (temp) {
				temp.save(obj);
			} else {
				persons.create(obj);
			}
		},

		showList : function(person) {
			var personView = new PersonView({model : person});
			this.$('#list').append(personView.render().el);
		},

		showAll : function(persons) {
			persons.each(function(person) {
				this.showList(person);
			});
		}
	});

	new AppView();
});