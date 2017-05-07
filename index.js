const Maybe = mrequire("core:Data.Maybe:1.2.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");

const NativeArray = mrequire("core:Data.Native.Array:1.2.0");
const NativeMaybe = mrequire("core:Data.Native.Maybe:1.0.0");

const Int = mrequire("core:Data.Int:1.0.4");
const String = mrequire("core:Data.String:1.0.4");

const Ordered = mrequire("core:Data.Ordered:1.0.0");


function ArrayState(content) {
    this.content = content;
}


//- Constructor that create an `Array` from a `Data.Native.Array`.
//= of :: Data.Native.Array a -> Array a
const of = content =>
    new ArrayState(content);
assumptionEqual(of([1, 2, 3, 4]).content, [1, 2, 3, 4]);


//- Constructor that create an `Array` containing a single element.
//= singleton :: a -> Array a
const singleton = content =>
    of([content]);
assumptionEqual(singleton(1).content, [1]);


//- Constructor that create an empty `Array`.
//= empty :: Array a
const empty =
    new ArrayState([]);
assumptionEqual(empty.content, []);


ArrayState.prototype.map = function (f) {
    return of(NativeArray.map(f)(this.content));
};
assumptionEqual(of([1, 2, 3, 4]).map(n => "p" + n), of(["p1", "p2", "p3", "p4"]));
assumptionEqual(empty.map(n => "p" + n), empty);


//- Creates an array of `Int`s for the given range.
//= range :: Data.Int -> Data.Int -> Array Data.Int
const range = lower => upper =>
    of(NativeArray.map(Int.of)(NativeArray.range(lower.toNative())(upper.toNative())));
assumptionEqual(range(Int.of(1))(Int.of(10)), of([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(Int.of));
assumptionEqual(range(Int.of(10))(Int.of(1)), of([10, 9, 8, 7, 6, 5, 4, 3, 2]).map(Int.of));


ArrayState.prototype.length = function () {
    return NativeArray.length(this.content);
};
assumptionEqual(empty.length(), 0);
assumptionEqual(of([1, 2, 3]).length(), 3);


const nativeMaybeToMaybe = value =>
    value.reduce(() => Maybe.Nothing)(v => Maybe.Just(v));


const maybeToNativeMaybe = value =>
    value.reduce(() => NativeMaybe.Nothing)(v => NativeMaybe.Just(v));


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//= Array a => findMap :: (a -> Maybe b) -> Maybe b
ArrayState.prototype.findMap = function (f) {
    return nativeMaybeToMaybe(
        NativeArray
            .findMap(this.content)(x => maybeToNativeMaybe(f(x)))
    );
};
assumption(of([1, 2, 3, 4, 5]).findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9);
assumption(of([1, 2, 3, 4, 5]).findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0);


ArrayState.prototype.append = function (item) {
    return of(NativeArray.append(this.content)(item));
};
assumptionEqual(of([1, 2, 3]).append(4), of([1, 2, 3, 4]));


ArrayState.prototype.prepend = function (item) {
    return of(NativeArray.prepend(item)(this.content));
};
assumptionEqual(of([1, 2, 3]).prepend(0), of([0, 1, 2, 3]));
assumptionEqual(empty.prepend(0), of([0]));


ArrayState.prototype.slice = function (start) {
    return end =>
        of(NativeArray.slice(this.content)(start)(end));
};
assumptionEqual(of([1, 2, 3, 4, 5]).slice(1)(3), of([2, 3]));
assumptionEqual(of([1, 2, 3, 4, 5]).slice(1)(2), of([2]));


ArrayState.prototype.at = function (index) {
    return nativeMaybeToMaybe(NativeArray.at(this.content)(index));
};
assumptionEqual(of([1, 2, 3]).at(2), Maybe.Just(3));
assumptionEqual(of([1, 2, 3]).at(5), Maybe.Nothing);


ArrayState.prototype.head = function () {
    return this.at(0);
};
assumptionEqual(of([1, 2, 3, 4]).head(), Maybe.Just(1));
assumptionEqual(empty.head(), Maybe.Nothing);


ArrayState.prototype.tail = function () {
    const contentLength = this.length();

    return contentLength > 0 ? Maybe.Just(this.slice(1)(contentLength)) : Maybe.Nothing;
};
assumptionEqual(of([1, 2, 3, 4]).tail(), Maybe.Just(of([2, 3, 4])));
assumptionEqual(of([1]).tail(), Maybe.Just(empty));
assumptionEqual(empty.tail(), Maybe.Nothing);


ArrayState.prototype.concat = function (array) {
    return of(NativeArray.concat(this.content)(array.content));
};
assumptionEqual(of([1, 2, 3]).concat(of([4, 5, 6])), of([1, 2, 3, 4, 5, 6]));


ArrayState.prototype.reduce = function (fNil) {
    return fCons =>
        NativeArray.reduce(this.content)(fNil)(h => t => fCons(h)(of(t)));
};
assumptionEqual(empty.reduce(() => ({}))(h => t => ({head: h, tail: t})), {});
assumptionEqual(of([1, 2, 3]).reduce(() => ({}))(h => t => ({head: h, tail: t})), {head: 1, tail: of([2, 3])});


ArrayState.prototype.zipWith = function (f) {
    return other => of(NativeArray.zipWith(f)(this.content)(other.content));
};


ArrayState.prototype.zip = function (other) {
    return this.zipWith(Tuple)(other);
};
assumptionEqual(of(["a", "b", "c"]).zip(range(Int.of(1))(Int.of(10))), of([Tuple("a")(Int.of(1)), Tuple("b")(Int.of(2)), Tuple("c")(Int.of(3))]));
assumptionEqual(of(["a", "b", "c"]).zip(empty), empty);
assumptionEqual(empty.zip(range(Int.of(1))(Int.of(10))), empty);


ArrayState.prototype.join = function (separator) {
    return String.of(NativeArray.join(this.map(x => x.show().toNative()).content)(separator.toNative()));
};
assumptionEqual(empty.join(String.of(",")), String.of(""));
assumptionEqual(range(Int.of(1))(Int.of(5)).join(String.of(",")), String.of("1,2,3,4"));


//= Array a => filter :: (a -> Bool) -> Array a
ArrayState.prototype.filter = function (predicate) {
    return of(NativeArray.filter(predicate)(this.content));
};
assumptionEqual(range(Int.of(1))(Int.of(5)).filter(n => n.toNative() % 2 === 0), of([2, 4]).map(Int.of));


//= Array a => sort :: Data.Ordered a => Array a
ArrayState.prototype.sort = function () {
    return of(NativeArray.sort(a => b => {
        const result = a.compare(b);
        if (result === Ordered.LT) {
            return -1;
        } else if (result === Ordered.EQ) {
            return 0;
        } else {
            return 1;
        }
    })(this.content));
};
assumptionEqual(range(Int.of(10))(Int.of(0)).sort(), range(Int.of(1))(Int.of(11)));


module.exports = {
    empty,
    of,
    singleton,
    range
};
