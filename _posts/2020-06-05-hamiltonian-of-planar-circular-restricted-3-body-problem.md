---
layout: post
title: Hamiltonian of planar circular restricted 3-body problem
---
...in rotating coordinates

<span style="border-style: double">
Translation of [homework done][hw] for the course Computational Astrodynamics.[^f]
</span>

[^f]: Post date reflects original date; translation done 06/04/2021.

The coordinates of inertial and rotating reference frame are connected

$$
  (\xi, \eta) = R(t) (x, y) = x(\cos t, \sin t) + y(-\sin t, \cos t)
$$

$$
  (x, y) = R^{-1}(t) (\xi, \eta) = \xi(\cos t, -\sin t) + \eta(\sin t, \cos t)
$$

and

$$
  (\dot{\xi}, \dot{\eta}) = (\dot{x} - y, \dot{y} + x) \cos t
    - (\dot{y} + x, y - \dot{x}) \sin t
$$

$$
  (\dot{x}, \dot{y}) = (\dot{\xi} + \eta, \dot{\eta} - \xi) \cos t
    - (\xi - \dot{\eta}, \dot{\xi} + \eta) \sin t
$$

For the large bodies, from normalization (usage of non-dimensional coordinates)

$$
  x_2 - x_1 = 1
$$

and from the conservation of momentum (constant velocity of the center of mass)

$$
  (1 - \mu) x_1 + \mu x_2 = 0
$$

Solving the system

$$
  (x_1, x_2) = (-\mu, 1 - \mu)
$$

In the planar circular restricted problem the orbits of them are

$$
  (\xi_1, \eta_1) = x_1 (\cos t, \sin t) \quad
  (\xi_2, \eta_2) = x_2 (\cos t, \sin t)
$$

and the distances of the small body from the previous is

$$
  r_1^2 = (\xi + \mu \cos t)^2 + (\eta + \mu \sin t)^2
$$

$$
  r_2^2 = (\xi - (1 - \mu) \cos t)^2 + (\eta - (1 - \mu) \sin t)^2
$$

Utilizing the conversion relationships the distances are written

$$
  r_1^2 = (x + \mu)^2 + y^2
$$

$$
  r_2^2 = (x - (1 - \mu))^2 + y^2
$$

The gravitational potential is written

$$
  V = -\frac{1 - \mu}{r_1} - \frac{\mu}{r_2}
$$

and then the Langrangian is written

$$
  L = \frac{1}{2}(\dot{\xi}^2 + \dot{\eta}^2) - V
$$

Utilizing the conversion relationships, it is written

$$
  L = \frac{1}{2}((\dot{x} - y)^2 + (\dot{y} + x)^2) - V
$$

The momenta are calculated differentiating this to the generalized velocities

$$
  (p_x, p_y) = (\partial_\dot{x}, \partial_\dot{y}) L = (\dot{x} - y, \dot{y} + x)
$$

And therefore the Langrangian is written

$$
  L = \frac{1}{2}(p_x^2 + p_y^2) - V
$$

The Hamiltonian is found from Legendre transformation

$$
  H = \dot{x} p_x + \dot{y} p_y - L
$$

Replacing and adding/subtracting the kinetical energy

$$
  H = \frac{1}{2}(p_x^2 + p_y^2) + p_x (\dot{x} - p_x) + (\dot{y} - p_y)p_y + V
$$

Finally

$$
  H = \frac{1}{2}(p_x^2 + p_y^2) + p_x y - x p_y - \frac{1 - \mu}{r_1} - \frac{\mu}{r_2}
$$


[hw]: https://users.auth.gr/kfoutzop/pms/sem2.astd/ASTD7A1_Foutzopoulos.pdf
