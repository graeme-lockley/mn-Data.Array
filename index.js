const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");


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


ImmutableArray.prototype.concat = function(array) {
    return new ImmutableArray(this.content.concat(array.content));
};
assumptionEqual(from([1, 2, 3]).concat(from([4, 5, 6])), from([1, 2, 3, 4, 5, 6]));


ImmutableArray.prototype.at = function(index) {
    return index >= this.content.length ? Maybe.Nothing : Maybe.Just(this.content[index]);
};
assumptionEqual(from([1, 2, 3]).at(2), Maybe.Just(3));
assumptionEqual(from([1, 2, 3]).at(5), Maybe.Nothing);


function range(lower) {
    return upper => {
        if (lower < upper) {
            let result = [];
            for (let lp = lower; lp < upper; lp += 1) {
                result.push(lp);
            }
            return from(result);
        } else {
            let result = [];
            for (let lp = lower; lp > upper; lp -= 1) {
                result.push(lp);
            }
            return from(result);
        }
    };
}
assumptionEqual(range(1)(10), from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
assumptionEqual(range(10)(1), from([10, 9, 8, 7, 6, 5, 4, 3, 2]));


ImmutableArray.prototype.reduce = function (fNil) {
    return fCons => {
        if (this.content.length === 0) {
            return fNil();
        } else {
            return fCons(this.content[0])(from(this.content.slice(1)))
        }
    }
};


ImmutableArray.prototype.zip = function (other) {
    return this.reduce(() => empty)(h => t => other.reduce(() => empty)(ho => to => t.zip(to).cons(Tuple(h)(ho))));
};
assumptionEqual(from(["a", "b", "c"]).zip(range(1)(10)), from([Tuple("a")(1), Tuple("b")(2), Tuple("c")(3)]));
assumptionEqual(from(["a", "b", "c"]).zip(empty), empty);
assumptionEqual(empty.zip(range(1)(10)), empty);


ImmutableArray.prototype.map = function (f) {
    return from(this.content.map(f));
};
assumptionEqual(range(1)(5).map(n => "p" + n), from(["p1", "p2", "p3", "p4"]));
assumptionEqual(empty.map(n => "p" + n), empty);


ImmutableArray.prototype.join = function (separator) {
    return this.content.join(separator);
};
assumptionEqual(range(1)(5).join(","), "1,2,3,4");
assumptionEqual(empty.join(","), "");


module.exports = {
    empty,
    from,
    singleton,
    range
};
