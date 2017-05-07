

## Index

[filter](#filter)
[sort](#sort)

## Detail

### filter

```haskell
Array a => filter :: (a -> Bool) -> Array a
```

Try to find an element in a data structure which satisfies a predicate mapping.

Array a . findMap :: (a -> Maybe b) -> Maybe b

#### Examples:

```haskell
of([1, 2, 3, 4, 5]).findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9
of([1, 2, 3, 4, 5]).findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0
of([1, 2, 3]).append(4) == of([1, 2, 3, 4])
of([1, 2, 3]).prepend(0) == of([0, 1, 2, 3])
empty.prepend(0) == of([0])
of([1, 2, 3, 4, 5]).slice(1)(3) == of([2, 3])
of([1, 2, 3, 4, 5]).slice(1)(2) == of([2])
of([1, 2, 3]).at(2) == Maybe.Just(3)
of([1, 2, 3]).at(5) == Maybe.Nothing
of([1, 2, 3, 4]).head() == Maybe.Just(1)
empty.head() == Maybe.Nothing
of([1, 2, 3, 4]).tail() == Maybe.Just(of([2, 3, 4]))
of([1]).tail() == Maybe.Just(empty)
empty.tail() == Maybe.Nothing
of([1, 2, 3]).concat(of([4, 5, 6])) == of([1, 2, 3, 4, 5, 6])
empty.reduce(() => ({}))(h => t => ({head: h, tail: t})) == {}
of([1, 2, 3]).reduce(() => ({}))(h => t => ({head: h, tail: t})) == {head: 1, tail: of([2, 3])}
of(["a", "b", "c"]).zip(range(1)(10)) == of([Tuple("a")(1), Tuple("b")(2), Tuple("c")(3)])
of(["a", "b", "c"]).zip(empty) == empty
empty.zip(range(1)(10)) == empty
range(1)(5).map(n => "p" + n) == of(["p1", "p2", "p3", "p4"])
empty.map(n => "p" + n) == empty
range(1)(5).join(",") == "1,2,3,4"
empty.join(",") == ""
range(1)(5).filter(n => n % 2 === 0) == of([2, 4])
```

### sort

```haskell
Array a => sort :: Data.Ordered a => Array a
```


#### Examples:

```haskell
range(10)(0).map(Int.of).sort() == range(1)(11).map(Int.of)
```


## Dependencies

* [Data.Maybe (v1.0.0)](https://github.com/graeme-lockley/mn-Data.Maybe)
* [Data.Tuple (v1.0.0)](https://github.com/graeme-lockley/mn-Data.Tuple)
* [Data.Native.Array (1.2.0)](https://github.com/graeme-lockley/mn-Data.Native.Array)
* [Data.Native.Maybe (1.0.0)](https://github.com/graeme-lockley/mn-Data.Native.Maybe)
* [Data.Int (1.0.2)](https://github.com/graeme-lockley/mn-Data.Int)
* [Data.Ordered (1.0.0)](https://github.com/graeme-lockley/mn-Data.Ordered)