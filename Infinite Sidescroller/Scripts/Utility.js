String.prototype.toTitleCase = function (n) {
	var string = this;
	if (1 !== n) string = string.toLowerCase();
	return string.replace(/\b[a-z]/g, function (result) { return result.toUpperCase() });
}