/*
 * tiler.js - tiling actions
 * 
 * Florian Dejonckheere <florian@floriandejonckheere.be>
 * 
 * */

var palettes = ['platinum', 'colors03'];
var current = 0;

var data = [{
	"title":	"Ideas",
	"text":	"This is a tile for ideas"
},{
	"title":	"Notes",
	"text":	"Write your notes here"
},{
	"title":	"Todo",
	"text":	"Things to do before completing this list"
},{
	"title":	"Dump",
	"text":	"Dump your brain's content here"
}];

$(document).ready(function(){
	$('#palette-author').fadeOut(2000);

	/* Knockout stuff */
	function Tile(title, text){
		var self = this;

		self.title =	ko.observable(title);
		self.text =	ko.observable(text);
	};

	function TileViewModel(){
		var self = this;

		self.tiles =	ko.observableArray();
		self.active =	ko.observable(-1);

		self.add = function(data){
			$.each(data, function(index, value){
				self.tiles.push(new Tile(value.title, value.text));
			});
		};

		self.activate = function(element){
			// This is not really good for performance
			self.active(self.tiles.indexOf(element));
		};

		self.isActive = function(element){
			if(self.tiles.indexOf(element) == self.active())
				return true;
			return false;
		};
	};

	var tileViewModel = new TileViewModel();
	tileViewModel.add(data);
	ko.applyBindings(tileViewModel);

	// For some reason the last panel is activated on load without this line
	tileViewModel.activate(-1);

	Mousetrap.bind('c',	function(){
		if(tileViewModel.active() == -1){
			$('#css-palette').attr('href', 'colors/' + palettes[(++current % palettes.length)] + '.css');
			$('#palette-author').show().fadeOut(2000);
		}
	});

	Mousetrap.bind('a',	function(){
		if(tileViewModel.active() == -1){
			var titles = ['Panel', 'Paper', 'Sheet'];
			tileViewModel.add([{
				"title":	titles[Math.floor(Math.random()*titles.length)],
				"text":		""
			}]);
			// Same hack here
			tileViewModel.active(-1);
		}
	});

	// Overwrite callback when an input field is focused
	Mousetrap.stopCallback = function(e, element, combo){ return false; };
	Mousetrap.bind('esc',	function(){
		tileViewModel.active(-1);
	});
});
