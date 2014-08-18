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
	Mousetrap.bind('c',	function(){
		$('#css-palette').attr('href', 'colors/' + palettes[(++current % palettes.length)] + '.css');
		$('#palette-author').show().fadeOut(2000);
	});
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
		self.active =	ko.observable(false);

		self.palette =	ko.observable();

		self.load = function(data){
			$.each(data, function(index, value){
				self.tiles.push(new Tile(value.title, value.text));
			});
		};

		self.activate = function(index){
			self.activate(index());
		}
	};

	var tileViewModel = new TileViewModel();
	tileViewModel.load(data);
	ko.applyBindings(tileViewModel);
});
