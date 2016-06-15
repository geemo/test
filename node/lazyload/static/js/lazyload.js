'use strict';

(function() {
    var tab_btns = document.getElementById('tab').children;
    var panel_imgs = document.getElementById('panel').children;
    var active_idx = 0;

    for (var i = 0, len = tab_btns.length; i < len; ++i) {

        (function(i) {
            tab_btns[i].onclick = function(e) {
            	active(i);
            };

            tab_btns[i].onmouseover = function(e) {
            	lazyload(i);
            };
        })(i);

    }

    function active(idx){
    	tab_btns[active_idx].setAttribute('class', '');
    	tab_btns[idx].setAttribute('class', 'active');

    	panel_imgs[active_idx].setAttribute('class', '');
    	panel_imgs[idx].setAttribute('class', 'active');

    	active_idx = idx;
    }

    function lazyload(idx){
    	var img = panel_imgs[idx];
    	if(!img.src){
    		img.src = img.getAttribute('data-src');
    	}

    	tab_btns[idx].onmouseover = null;
    }
})();
