const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");

const NativeArray = mrequire("core:Data.Native.Array:1.0.0");
const NativeMaybe = mrequire("core:Data.Native.Maybe:1.0.0");


function ArrayState(content) {
    this.content = content;
}


const from = content =>
    new ArrayState(content);
assumptionEqual(from([1, 2, 3, 4]).content, [1, 2, 3, 4]);


const singleton = content =>
    from([content]);
assumptionEqual(singleton(1).content, [1]);


const empty =
    new ArrayState([]);
assumptionEqual(empty.content, []);


const range = lower => upper =>
    from(NativeArray.range(lower)(upper));
assumptionEqual(range(1)(10), from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
assumptionEqual(range(10)(1), from([10, 9, 8, 7, 6, 5, 4, 3, 2]));


ArrayState.prototype.length = function () {
    return NativeArray.length(this.content);
};
assumptionEqual(empty.length(), 0);
assumptionEqual(from([1, 2, 3]).length(), 3);


const nativeMaybeToMaybe = value =>
    value.reduce(() => Maybe.Nothing)(v => Maybe.Just(v));


const maybeToNativeMaybe = value =>
    value.match([(v => NativeMaybe.Just(v)), () => NativeMaybe.Nothing]);


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//- Array a . findMap :: (a -> Maybe b) -> Maybe b
ArrayState.prototype.findMap = function (f) {
    return nativeMaybeToMaybe(
        NativeArray
            .findMap(this.content)(x => maybeToNativeMaybe(f(x)))
    );
};
assumption(from([1, 2, 3, 4, 5]).findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9);
assumption(from([1, 2, 3, 4, 5]).findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0);


ArrayState.prototype.append = function (item) {
    return from(NativeArray.append(this.content)(item));
};
assumptionEqual(from([1, 2, 3]).append(4), from([1, 2, 3, 4]));


ArrayState.prototype.prepend = function (item) {
    return from(NativeArray.prepend(item)(this.content));
};
assumptionEqual(from([1, 2, 3]).prepend(0), from([0, 1, 2, 3]));
assumptionEqual(empty.prepend(0), from([0]));


ArrayState.prototype.slice = function (start) {
    return end =>
        from(NativeArray.slice(this.content)(start)(end));
};
assumptionEqual(from([1, 2, 3, 4, 5]).slice(1)(3), from([2, 3]));
assumptionEqual(from([1, 2, 3, 4, 5]).slice(1)(2), from([2]));


ArrayState.prototype.at = function (index) {
    return nativeMaybeToMaybe(NativeArray.at(this.content)(index));
};
assumptionEqual(from([1, 2, 3]).at(2), Maybe.Just(3));
assumptionEqual(from([1, 2, 3]).at(5), Maybe.Nothing);


ArrayState.prototype.head = function () {
    return this.at(0);
};
assumptionEqual(from([1, 2, 3, 4]).head(), Maybe.Just(1));
assumptionEqual(empty.head(), Maybe.Nothing);


ArrayState.prototype.tail = function () {
    const contentLength = this.length();

    return contentLength > 0 ? Maybe.Just(this.slice(1)(contentLength)) : Maybe.Nothing;
};
assumptionEqual(from([1, 2, 3, 4]).tail(), Maybe.Just(from([2, 3, 4])));
assumptionEqual(from([1]).tail(), Maybe.Just(empty));
assumptionEqual(empty.tail(), Maybe.Nothing);


ArrayState.prototype.concat = function (array) {
    return from(NativeArray.concat(this.content)(array.content));
};
assumptionEqual(from([1, 2, 3]).concat(from([4, 5, 6])), from([1, 2, 3, 4, 5, 6]));


ArrayState.prototype.reduce = function (fNil) {
    return fCons =>
        NativeArray.reduce(this.content)(fNil)(h => t => fCons(h)(from(t)));
};
assumptionEqual(empty.reduce(() => ({}))(h => t => ({head: h, tail: t})), {});
assumptionEqual(from([1, 2, 3]).reduce(() => ({}))(h => t => ({head: h, tail: t})), {head: 1, tail: from([2, 3])});


ArrayState.prototype.zipWith = function(f) {
    return other => from(NativeArray.zipWith(f)(this.content)(other.content));
};


ArrayState.prototype.zip = function (other) {
    return this.zipWith(Tuple)(other);
};
assumptionEqual(from(["a", "b", "c"]).zip(range(1)(10)), from([Tuple("a")(1), Tuple("b")(2), Tuple("c")(3)]));
assumptionEqual(from(["a", "b", "c"]).zip(empty), empty);
assumptionEqual(empty.zip(range(1)(10)), empty);


ArrayState.prototype.map = function (f) {
    return from(NativeArray.map(f)(this.content));
};
assumptionEqual(range(1)(5).map(n => "p" + n), from(["p1", "p2", "p3", "p4"]));
assumptionEqual(empty.map(n => "p" + n), empty);


ArrayState.prototype.join = function (separator) {
    return NativeArray.join(this.content)(separator);
};
assumptionEqual(range(1)(5).join(","), "1,2,3,4");
assumptionEqual(empty.join(","), "");


module.exports = {
    empty,
    from,
    singleton,
    range
};
