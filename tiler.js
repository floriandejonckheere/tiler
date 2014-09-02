/*
 * tiler.js - tiling actions
 * 
 * Florian Dejonckheere <florian@floriandejonckheere.be>
 * 
 * */

var palettes = ['platinum', 'colors03', 'pauling'];
var current = 0;
// TODO: solve palette data problem
var color_max = 5;

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

if(!localStorage["data"]) localStorage["data"] = JSON.stringify(data);

$(document).ready(function(){
	$('#palette-author').fadeOut(2000);

	/* Knockout stuff */
	function Tile(title, text){
		var self = this;

		self.title =	ko.observable(title);
		self.text =	ko.observable(text);
		self.text.subscribe(function(value){
			console.log('Updated value: ' + value);
		});
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

		self.exportData = function(){
			return ko.toJSON(self.tiles());
		};

		self.importData = function(data){
			self.tiles.removeAll();
			self.add(JSON.parse(data));
		};

		self.tiles.subscribe(function(newTiles){
			localStorage["data"] = self.exportData();
		});

	};

	var tileViewModel = new TileViewModel();
	tileViewModel.importData(localStorage["data"]);
	ko.applyBindings(tileViewModel);

	Mousetrap.bind('c',	function(){
		if(tileViewModel.active() == -1){
			var basePath = 'colors/' + palettes[(++current % palettes.length)];
			$('#css-palette').attr('href', basePath + '.css');
			$.getJSON(basePath + '.json', function(data){
				$('#palette-author').html(data.title + ' by ' + localdata.author);
				color_max = data.colors;
				$('#palette-author').show().fadeOut(2000);
			});
		}
	});

	Mousetrap.bind('a',	function(){
		if(tileViewModel.active() == -1){
			tileViewModel.add([{
				"title":	'New tile',
				"text":		"Scribble away"
			}]);
		}
	});

	// Overwrite callback when an input field is focused
	Mousetrap.stopCallback = function(e, element, combo){ return false; };
	Mousetrap.bind('esc',	function(){
		// Update fields, should _really_ be done with a knockout binding
		var el = $('.tile').eq(tileViewModel.active());
		tileViewModel.tiles()[tileViewModel.active()].title(el.find('.tile-title').html());
		tileViewModel.tiles()[tileViewModel.active()].text(el.find('.tile-text').html());

		// Export data to localStorage
		console.log('Exporting data');
		localStorage["data"] = tileViewModel.exportData();
		console.log(localStorage["data"]);

		// Blur tile
		tileViewModel.active(-1);
		$('.tile-title').blur();
	});

	Mousetrap.bind('s',	function(){
		if(tileViewModel.active() == -1){
			window.prompt('Copy your data here', tileViewModel.exportData());
		}
	});

	Mousetrap.bind('l',	function(){
		if(tileViewModel.active() == -1){
			var importData = window.prompt('Paste your data here');
			if(JSON.parse(importData)) tileViewModel.importData(importData);
		}
	});

	Mousetrap.bind('r',	function(){
		if(tileViewModel.active() == -1){
			if(window.confirm('Are you sure you wish to erase all tiles?') == true){
				localStorage["data"] = JSON.stringify(data);
				tileViewModel.importData(localStorage["data"]);
			}
		}
	});
});
