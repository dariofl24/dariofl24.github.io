var htmlUtil = {
	writeAsString : function (f) {
		return f.toString().
			replace(/^[^\/]+\/\*!?/, '').
			replace(/\*\/[^\/]+$/, '');
	}
}
