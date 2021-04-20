---
title: Julia and arrays with custom indices
---
[Julia] is a  modern language designed for technical  computing.  In the
spirit  of other  scientific languages  such as  Fortran, MATLAB/Octave,
Mathematica, and R, Julia uses 1-based indexing for arrays. Meaning that
the  first element  of an  one-dimensional  array `a`  is accessed  with
`a[1]`. This  is in contrast to  popular languages such as  C and Python
which  use 0-based  indexing and  that though  they came  to be  used in
sciences they weren't specifically designed for them.

But like Fortran, Julia though it  defaults to 1-based, it allows you to
specify arbitrary indices  for the arrays.  The  [documentation] is very
good, showing how  to generalize the code, bound check  and do loops but
is  more oriented  to  developers.   Meaning even  if  they're are  good
techniques it is not something someone  that wants to implement a simple
algorithm will find straightforward to apply.

For this  the [OffsetArrays.jl][OffsetArrays] package may  be used. This
package can be utilized to provide  arbitrary indices in similar vein to
Fortan. Specifically it exports the following `OffsetArray` function.

```
help?> OffsetArray
  OffsetArray(A, indices...)
```

That function returns  an `AbstractArray` sharing element  type and size
with  supplied  array `A`  but  uses  axes  inferred from  the  supplied
`indices` argument.

Let's define an one-dimensional array `a`.

```
julia> a = collect(1:5)
5-element Array{Int64,1}:
 1
 2
 3
 4
 5
```

Elements in a loop can be accessed counting from `1` to `length(a)`.

```
julia> i=1;

julia> a[i]
1
```

In order to change the loop from `0` to `length(a)-1`, the following can
be run.

```
julia> using OffsetArrays

julia> a = OffsetArray(a, 0:(length(a) - 1))
5-element OffsetArray(::Array{Int64,1}, 0:4) with eltype Int64 with indices 0:4:
 1
 2
 3
 4
 5
```

Then

```
julia> i=0;

julia> a[i]
1
```

For simpler usage the following function can be defined

```
function zero_based(a)
    return OffsetArray(a, 0:(length(a) - 1))
end
```

Then

```
julia> a = collect(1:5);

julia> a = zero_based(a)
5-element OffsetArray(::Array{Int64,1}, 0:4) with eltype Int64 with indices 0:4:
 1
 2
 3
 4
 5
```

Another usage  is when we wish  to access elements of  a region referred
from  an  array, using  the  indices  corresponding to  the  originating
array. For an example, let's define a two-dimensional array `A`.

```
julia> A = reshape(1:36, 6, 6)
6×6 reshape(::UnitRange{Int64}, 6, 6) with eltype Int64:
 1   7  13  19  25  31
 2   8  14  20  26  32
 3   9  15  21  27  33
 4  10  16  22  28  34
 5  11  17  23  29  35
 6  12  18  24  30  36
```

A region may be referred as follows.

```
julia> B = A[2:5, 2:5]
4×4 Array{Int64,2}:
  8  14  20  26
  9  15  21  27
 10  16  22  28
 11  17  23  29
```

Now as things are the elements of `A` and `B` do not correspond.

```
julia> A[2, 2]
8

julia> B[1, 1]
8
```

To make indexing consistent the following can be run.

```
julia> B = OffsetArray(A[2:5, 2:5], 2:5, 2:5)
4×4 OffsetArray(::Array{Int64,2}, 2:5, 2:5) with eltype Int64 with indices 2:5×2:5:
  8  14  20  26
  9  15  21  27
 10  16  22  28
 11  17  23  29
```

Then

```
julia> A[2, 2]
8

julia> B[2, 2]
8
```

For simpler usage the following function can be defined

```
function refer_region(A, x, y)
    return OffsetArray(A[x, y], x, y)
end
```

Then

```
julia> A = reshape(1:36, 6, 6);

julia> B = refer_region(A, 2:5, 2:5)
4×4 OffsetArray(::Array{Int64,2}, 2:5, 2:5) with eltype Int64 with indices 2:5×2:5:
  8  14  20  26
  9  15  21  27
 10  16  22  28
 11  17  23  29
```

Those are  some trivial examples  to showcase arbitrary  indices.  Since
Julia defaults  to 1 some codes  and packages may see  this as absolute.
Meaning that custom  indices may create issues and  trigger errors, even
in base Julia.  It should be noted  that the last example was taken from
[Holy's post][Holy] on Julia blog which  has about similar theme to this
post but is more extended and detailed.

[Julia]: https://julialang.org/
[documentation]: https://docs.julialang.org/en/v1/devdocs/offset-arrays/
[OffsetArrays]: https://github.com/JuliaArrays/OffsetArrays.jl
[Holy]: https://julialang.org/blog/2017/04/offset-arrays/
