

## Index

[empty](#empty)
[filter](#filter)
[findMap](#findMap)
[of](#of)
[range](#range)
[singleton](#singleton)
[sort](#sort)

## Detail

### of

```haskell
of :: Data.Native.Array a -> Array a
```

Constructor that create an `Array` from a `Data.Native.Array`.

#### Examples:

```haskell
of([1, 2, 3, 4]).content == [1, 2, 3, 4]
```

### singleton

```haskell
singleton :: a -> Array a
```

Constructor that create an `Array` containing a single element.

#### Examples:

```haskell
singleton(1).content == [1]
```

### empty

```haskell
empty :: Array a
```

Constructor that create an empty `Array`.

#### Examples:

```haskell
empty.content == []
of([1, 2, 3, 4]).map(n => "p" + n) == of(["p1", "p2", "p3", "p4"])
empty.map(n => "p" + n) == empty
```

### range

```haskell
range :: Data.Int -> Data.Int -> Array Data.Int
```

Creates an array of `Int`s for the given range.

#### Examples:

```haskell
range(Int.of(1))(Int.of(10)) == of([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(Int.of)
range(Int.of(10))(Int.of(1)) == of([10, 9, 8, 7, 6, 5, 4, 3, 2]).map(Int.of)
empty.length() == 0
of([1, 2, 3]).length() == 3
```

### findMap

```haskell
Array a => findMap :: (a -> Maybe b) -> Maybe b
```

Try to find an element in a data structure which satisfies a predicate mapping.


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
of(["a", "b", "c"]).zip(range(Int.of(1))(Int.of(10))) == of([Tuple("a")(Int.of(1)), Tuple("b")(Int.of(2)), Tuple("c")(Int.of(3))])
of(["a", "b", "c"]).zip(empty) == empty
empty.zip(range(Int.of(1))(Int.of(10))) == empty
empty.join(String.of(",")) == String.of("")
range(Int.of(1))(Int.of(5)).join(String.of(",")) == String.of("1,2,3,4")
```

### filter

```haskell
Array a => filter :: (a -> Bool) -> Array a
```


#### Examples:

```haskell
range(Int.of(1))(Int.of(5)).filter(n => n.toNative() % 2 === 0) == of([2, 4]).map(Int.of)
```

### sort

```haskell
Array a => sort :: Data.Ordered a => Array a
```


#### Examples:

```haskell
range(Int.of(10))(Int.of(0)).sort() == range(Int.of(1))(Int.of(11))
```


## Dependencies

* [Data.Maybe (1.2.0)](https://github.com/graeme-lockley/mn-Data.Maybe)
* [Data.Tuple (v1.0.0)](https://github.com/graeme-lockley/mn-Data.Tuple)
* [Data.Native.Array (1.2.0)](https://github.com/graeme-lockley/mn-Data.Native.Array)
* [Data.Native.Maybe (1.0.0)](https://github.com/graeme-lockley/mn-Data.Native.Maybe)
* [Data.Int (1.0.4)](https://github.com/graeme-lockley/mn-Data.Int)
* [Data.String (1.0.4)](https://github.com/graeme-lockley/mn-Data.String)
* [Data.Ordered (1.0.0)](https://github.com/graeme-lockley/mn-Data.Ordered)