var ABC = 'abc|def|ghi|jkl|mno|pqrs|tuv|wxyz';
var KEY_POS = ABC.split('|');

function getKey(/*chart*/ chart) {
    for (var i = 2; i <= KEY_POS.length; i++) {
        if (KEY_POS[i - 2].indexOf(chart) > -1) {
            return i;
        }
    }
    return 0;
}

function getPos(/*chart*/ chart) {
    if (chart == ' ') return 1;
    var key = getKey(chart);
    var charts = KEY_POS[key - 2];
    for (var j = 1; j <= charts.length; j++) {
        if (charts[j - 1].indexOf(chart) > -1) {
            return j;
        }
    }
    return 1;
}

function getKeysAndPos(/*chart*/ chart) {
    var key = getKey(chart);
    var pos = getPos(chart);
    var result = '';
    // dump(chart, key, pos);
    return {key: key, times: pos};
}

function toLang(/*String*/ string) {
    var result = '';
    for (var i = 0; i < string.length; i++) {
        var obj = getKeysAndPos(string[i]);
        var objNext = getKeysAndPos(string[i + 1]);

    }
    return result;
}
