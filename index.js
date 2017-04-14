const Maybe = mrequire("core:Data.Maybe:v1.0.0");


function ImmutableArray(content) {
	this.content = content;
}


ImmutableArray.prototype.length = function() {
	return this.content.length;
};


function from(content) {
    return new ImmutableArray(content);
}
assumption(from([1, 2, 3, 4]).length() === 4);


function singleton(content) {
    return from([content]);
}
assumption(singleton(1).length() === 1);


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//- Array a . findMap :: (a -> Maybe b) -> Maybe b
ImmutableArray.prototype.findMap = function(f) {
    const content = this.content;

    for (let lp = 0; lp < content.length; lp += 1) {
        const fResult = f(content[lp]);

        if (fResult.match([() => true, () => false])) {
            return fResult;
        }
    }

    return Maybe.Nothing;
};
assumption(from([1, 2, 3, 4, 5]).findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9);
assumption(from([1, 2, 3, 4, 5]).findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0);


module.exports = {
	from,
    singleton
};
