/*
 * tiler.js - tiling actions
 * 
 * Florian Dejonckheere <florian@floriandejonckheere.be>
 * 
 * */

var palettes = ['colors03', 'platinum'];
var current = 1;
var tiles = [{
	"title":		"Ideas",
	"content":	"This is a tile for ideas"
},{
	"title":		"Notes",
	"content":	"Write your notes here"
},{
	"title":		"Todo",
	"content":	"Things to do before completing this list"
},{
	"title":		"Dump",
	"content":	"Dump your brain's content here"
}];

$(document).ready(function(){
	/* Load color palette */
	var loadPalette = function(name){
		$.getJSON('colors/' + name + '.json', function(data){
			// Assign colors
			$.each(data.tiles, function(index, value){
				$('.color-' + index).css('background-color',	data.tiles[index].bgColor);
				$('.color-' + index).css('color',		(data.tiles[index].textColor ? data.tiles[index].textColor : '#FFFFFF'));
			});
			$('.bg-color').css('background-color',	data.bgColor);
			$('.text-color').css('color',		data.textColor);
		});
	}

	var init = function(){
		loadPalette(palettes[current]);
		$.each(tiles, function(index, value){
			console.log('Adding ' + value);
			$('.wrapper tr').append('<td class="tile animated tile-inactive color-' + index + '"><span class="tile-title">' + value.title + '</span></td>');
		});
	}

	/* MIME type hack */
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType){
			xhr.overrideMimeType("application/json");
		}}
	});

	/* Load color palettes */
	loadPalette(palettes[current]);

	$('.wrapper tr td').last().hover(function(){
		$('.tile-add').css('right', 0);
	}, function(){
		$('.tile-add').css('right', '-10%');
	});

	$('.tile').click(function(){
		$('.tile').removeClass('tile-active').addClass('tile-inactive');
		$(this).removeClass('tile-inactive').addClass('tile-active');
	});

	Mousetrap.bind('c',	function(){
		loadPalette(palettes[(++current % palettes.length)]);
	});

	init();
});
