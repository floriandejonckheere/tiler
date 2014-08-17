/*
 * tiler.js - tiling actions
 * 
 * Florian Dejonckheere <florian@floriandejonckheere.be>
 * 
 * */

var palettes = ['colors03', 'platinum'];
var colors = [];

$(document).ready(function(){
	var loadPalette = function(name){
		$.getJSON('colors/' + name + '.json', function(data){
				colors = data.colors;
				// Assign colors
				$.each(colors, function(index, value){
					$('.color-' + index).css('background-color',	colors[index].bgColor);
					$('.color-' + index).css('color',		(colors[index].textColor ? colors[index].textColor : '#FFFFFF'));
				});
			});
	}

	/* MIME type hack */
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType){
			xhr.overrideMimeType("application/json");
		}}
	});

	/* Load color palettes */
	//$.each(palettes, function(index, value){
		//loadPalette(value);
		loadPalette(palettes[1]);
	//});
	
	$('.tile').click(function(){
		$('.tile').removeClass('tile-active').addClass('tile-inactive');
		$(this).removeClass('tile-inactive').addClass('tile-active');
	});
});
