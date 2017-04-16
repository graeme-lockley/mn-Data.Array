const Maybe = mrequire("core:Data.Maybe:v1.0.0");


function ImmutableArray(content) {
    this.content = content;
}


ImmutableArray.prototype.length = function () {
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


const empty = new ImmutableArray([]);
assumptionEqual(empty, from([]));


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//- Array a . findMap :: (a -> Maybe b) -> Maybe b
ImmutableArray.prototype.findMap = function (f) {
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


ImmutableArray.prototype.toArray = function () {
    return [...this.content];
};
assumptionEqual(from([1, 2, 3, 4]).toArray(), [1, 2, 3, 4]);


ImmutableArray.prototype.append = function (item) {
    return new ImmutableArray([...this.content, item]);
};
assumptionEqual(from([1, 2, 3]).append(4), from([1, 2, 3, 4]));


ImmutableArray.prototype.cons = function (item) {
    return new ImmutableArray([item, ...this.content]);
};
assumptionEqual(from([1, 2, 3]).cons(0), from([0, 1, 2, 3]));
assumptionEqual(empty.cons(0), from([0]));


ImmutableArray.prototype.slice = function(start) {
    return end => {
        return new ImmutableArray(this.content.slice(start, end));
    }
};
assumptionEqual(from([1, 2, 3, 4, 5]).slice(1)(3), from([2, 3]));
assumptionEqual(from([1, 2, 3, 4, 5]).slice(1)(2), from([2]));


ImmutableArray.prototype.head = function() {
    return this.content.length > 0 ? Maybe.Just(this.content[0]) : Maybe.Nothing;
};
assumptionEqual(from([1, 2, 3, 4]).head(), Maybe.Just(1));
assumptionEqual(empty.head(), Maybe.Nothing);


ImmutableArray.prototype.tail = function() {
    return this.content.length > 0 ? Maybe.Just(new ImmutableArray(this.content.slice(1))) : Maybe.Nothing;
};
assumptionEqual(from([1, 2, 3, 4]).tail(), Maybe.Just(from([2, 3, 4])));
assumptionEqual(from([1]).tail(), Maybe.Just(empty));
assumptionEqual(empty.tail(), Maybe.Nothing);


module.exports = {
    empty,
    from,
    singleton
};
