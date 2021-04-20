---
title: Newton's cradle geometry
---
Based on PLANCKS 2014. Problem 2.

A Newton's cradle is well-known physics demo where a swinging ball hits upon a
number of other (same) balls at rest. The momentum is transferred (fully if
elastic collisions are assumed) to the last ball letting the others at rest.
Then that ball performs a pendulum-like motion and the motion is realized in
reverse.

Let a Newton's cradle of (total) $N$ balls and assume that the launched ball
has velocity at the time of collision $v_0$ and after the collision the balls
have a velocity $v_i$. As one ball cannot move faster than the next one, the
following constrain relationship holds.

\\[ 0 \leqslant v_{i - 1} < v_i \\]

Then, by the conservation of momentum

\\[ m v_0 = \sum m v_i \Rightarrow v_0 = \sum v_i \\]

and by the conservation of energy

\\[ E_0 = \sum E_i \Rightarrow T_0 = \sum T_i \Rightarrow v_0^2 = \sum v_i^2 \\]

The first equation describes a hyperplane that contains the points $P_i =
(\delta_{i j} v_0)$ whereas the second describes a hypersphere centered at
origin of radius $r = v_0$. The solutions are the intersection of the plane
and the sphere.

For $N = 2$

\\[ \\begin{array}{c}
     v_0 = v_1 + v_2\\newline
     v_0^2 = v_1^2 + v_2^2
   \\end{array} \Rightarrow \\begin{array}{c}
     v_0 = v_1 + v_2\\newline
     v_1 v_2 = 0
   \\end{array} \Rightarrow (v_1, v_2) = \\{ (0, v_0), (v_0, 0) \\} \\]

For this case the plane degenerates to a line and the sphere to a circle.
Their intersection are two points. Utilizing the constrain, only one (1) unique
solution is left. The $(v_1, v_2) = (0, v_0)$.

For $N = 3$

\\[ \\begin{array}{c}
     v_0 = v_1 + v_2 + v_3\\newline
     v_0^2 = v_1^2 + v_2^2 + v_3^2
   \\end{array} \Rightarrow \\begin{array}{c}
     v_0 = v_1 + v_2 + v_3\\newline
     v_2 v_3 + v_1 v_3 + v_1 v_2 = 0
   \\end{array} \\]

As there're more unknowns than equations there're infinite solutions. For this
case those form a circle. Utilizing the constrain, the valid solutions form an
arc of that circle.

Although for $N = 3$ (and $N > 3$) there're infinite solutions only one is
experimentally realized. This is explained by considering two-body ($N = 2$)
collisions. Splitting in steps at each ball and based on previous result,
it'll be $(u_{i - 1}, u_i) = (0, u_0)$.

Therefore finally there'll be one (1) unique solution, the
$\mathbf{\upsilon}= (v_j = \delta_{j N} v_0)$.
