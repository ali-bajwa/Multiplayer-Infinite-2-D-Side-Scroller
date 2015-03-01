function arrow_key_scrolling(flag){
	if(flag == false){
		document.addEventListener('keydown', function(e){ // .getElementById("display_canvas")
			arrows = [37, 38, 39, 40];
			if(arrows.indexOf(e.keyCode) > -1){
				e.preventDefault();
				return false;
			}else{
				return true
			}
		})
	}
}
