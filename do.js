var images = $(".thumbnail");
for(var i = 0; i < images.length; i++){
	console.log($(images[i]).attr('src'));
	console.log($(images[i]).parent().next().text());
}