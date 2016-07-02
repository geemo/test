'use strict';

window.onload = function() {
    var search_box = document.getElementById('search-box');
    var ipt = document.getElementById('ipt');
    var keyword = '',
        timer = null;

    ipt.oninput = function(e) {
        clearTimeout(timer);
        keyword = this.value.trim();
        timer = setTimeout(showSearchResult, 300, keyword);
    };

    function showSearchResult(keyword) {
        if (keyword) {
            var result = getSearchResult(keyword);
            if (result.length) {
                var innerHTML = '';
                for (var i = 0, len = result.length; i < len; ++i) {
                    innerHTML = innerHTML + '<li>' + result[i] + '</li>';
                }
                search_box.innerHTML = innerHTML;
                search_box.style.display = 'block';
            }
        } else {
            search_box.style.display = 'none';
        }
    }

    function getSearchResult(keyword) {
        var i, j, len_row, len_col, row;
        var obj = {};
        var ret = [];
        var reg = new RegExp('^' + keyword);
        for (i = 0, len_row = city.length; i < len_row; ++i) {
            row = city[i];
            for (j = 0, len_col = row.length; j < len_col; ++j) {
                if (reg.test(row[j])) {
                    obj[i * 10 + j] = row[0]
                    break;
                }
            }
        }

        var keys = [];
        for (var key in obj) keys.push(Number(key));
        keys = keys.sort(function(a, b) {
            return a - b;
        });

        for (var i = 0; i < keys.length && i < 5; ++i) ret.push(obj[keys[i]]);

        return ret;
    };
};
