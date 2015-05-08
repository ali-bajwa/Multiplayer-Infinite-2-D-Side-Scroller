// String toTitleCase function
String.prototype.toTitleCase = function (n) {
	var string = this;
	if (1 !== n) string = string.toLowerCase();
	return string.replace(/\b[a-z]/g, function (result) { return result.toUpperCase() });
}

var hideObj = function (objclass) {
  console.log(objclass);
    $(objclass).hide();
}