---
title: Hamiltonian of planar circular restricted 3-body problem
---
...in rotating coordinates

<span style="border-style: double">
Translation of [homework done][hw] for the course Computational Astrodynamics.[^f]
</span>

[hw]: https://users.auth.gr/kfoutzop/pms/sem2.astd/ASTD7A1_Foutzopoulos.pdf
[^f]: Post date reflects original date; translation done 06/04/2021.

The coordinates of inertial and rotating reference frame are connected

\\[ (\xi, \eta) = R (t) (x, y) = x (\cos t, \sin t) + y (- \sin t, \cos t) \\]

\\[ (x, y) = R^{- 1} (t) (\xi, \eta) = \xi (\cos t, - \sin t) + \eta (\sin t,
   \cos t) \\]

and

\\[ (\dot{\xi}, \dot{\eta}) = (\dot{x} - y, \dot{y} + x) \cos t - (\dot{y} + 
x,
   y - \dot{x}) \sin t \\]

\\[ (\dot{x}, \dot{y}) = (\dot{\xi} + \eta, \dot{\eta} - \xi) \cos t - (\xi -
   \dot{\eta}, \dot{\xi} + \eta) \sin t \\]

For the large bodies, from normalization (usage of non-dimensional 
coordinates)

\\[ x\_{2} - x\_{1} = 1 \\]

and from the conservation of momentum (constant velocity of the center of 
mass)

\\[ (1 - \mu) x\_{1} + \mu x\_{2} = 0 \\]

Solving the system

\\[ (x\_{1}, x\_{2}) = (- \mu, 1 - \mu) \\]

In the planar circular restricted problem the orbits of them are

\\[ (\xi \_{1}, \eta \_{1}) = x\_{1}  (\cos t, \sin t) \quad (\xi \_{2}, \eta
   \_{2}) = x\_{2}  (\cos t, \sin t) \\]

and the distances of the small body from the previous is

\\[ r\_{1}^2 = (\xi + \mu \cos t)^2 + (\eta + \mu \sin t)^2 \\]

\\[ r\_{2}^2 = (\xi - (1 - \mu) \cos t^{})^2 + (\eta - (1 - \mu) \sin t)^2 \\]

Utilizing the conversion relationships the distances are written

\\[ r\_{1}^2 = (x + \mu)^2 + y^2 \\]

\\[ r\_{2}^2 = (x - (1 - \mu)\_{})^2 + y^2 \\]

The gravitational potential is written

\\[ V = - \frac{1 - \mu}{r\_{1}} - \frac{\mu}{r\_{2}} \\]

and then the Lagrangian is written

\\[ L = \frac{1}{2} (\dot{\xi}^2 + \dot{\eta}^2) - V \\]

Utilizing the conversion relationships, it is written

\\[ L = \frac{1}{2} ( (\dot{x} - y)^2 + (\dot{y} + x)^2) - V \\]

The momenta are calculated differentiating this to the generalized velocities

\\[ (p\_{x}, p\_{y}) = (\partial \_{\dot{x}}, \partial \_{\dot{y}}) L =
   (\dot{x} - y, \dot{y} + x) \\]

And therefore the Lagrangian is written

\\[ L = \frac{1}{2} (p\_{x}^2 + p\_{y}^2) - V \\]

The Hamiltonian is found from Legendre transformation

\\[ H = \dot{x} p\_{x} + \dot{y} p\_{y} - L \\]

Replacing and adding/subtracting the kinetical energy

\\[ H = \frac{1}{2} (p\_{x}^2 + p\_{y}^2) + p\_{x}  (\dot{x} - p\_{x}) +
   (\dot{y} - p\_{y}^{}) p\_{y} + V \\]

Finally

\\[ H = \frac{1}{2} (p\_{x}^2 + p\_{y}^2) + p\_{x} y - x p\_{y} - \frac{1 -
   \mu}{r\_{1}} - \frac{\mu}{r\_{2}} \\]
