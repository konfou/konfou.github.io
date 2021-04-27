---
layout: post
title: relativistic Lagrangian
---

The relativistic kinetic energy $T\_{\operatorname{rel}}$ for a free particle
of (rest) mass $m$ is

\\[ T\_{\operatorname{rel}} = (\gamma - 1) m c^2 \quad \gamma = (1 - v^2 /
   c^2)^{- 1 / 2} \quad v = \| \dot{\mathbf{r}} \| \\]

That relation can be derived by considering the linear momentum being
$\mathbf{p}= \gamma m \dot{\mathbf{r}}$. Then

\\[ T = \int \dot{\mathbf{r}} d\mathbf{p}= \cdots = \gamma m c^2 - E\_{0}
\quad
   T (0) = 0 \Rightarrow E\_{0} = m c^2 \\]

For $\epsilon \ll 1$, it's $(1 + \epsilon)^n \approx 1 + n \epsilon$.
Utilizing this relation, for $v \ll c$, the $\gamma$ is

\\[ \gamma = (1 - v^2 / c^2)^{- 1 / 2} \approx 1 + (1 / 2) (v^2 / c^2) \\]

Substituting in the first, the relativistic kinetic energy for small
velocities is

\\[ T\_{\operatorname{rel}; u \ll c} \approx \frac{1}{2} m v^2 =
   T\_{\operatorname{nonrel}} \\]

In the classical (nonrelativistic) framework the Lagrangian is formed

\\[ L = T - V \\]

This isn't the case in the relativistic framework. By integrating the
generalized momenta

\\[ p\_{i} = \frac{\partial L}{\partial \dot{q}\_{i}} = \gamma m \dot{q}\_{i}
   \Rightarrow L = - \frac{m c^2}{\gamma} + \sum\_{k} f\_{k} (\dot{q}\_{j \neq
   i}) \\]

where $f\_{k}$ are arbitrary functions of velocities. By assuming, without
loss of generality, $f\_{k} = 0$, the relativistic Lagrangian for a free
particle is written

\\[ L = - m c^2 \gamma^{- 1} \\]

For comparison, doing this in the classical framework will, as expected,
recover the kinetic energy.

\\[ p\_{i} = \frac{\partial L}{\partial \dot{q}\_{i}} = m \dot{q}\_{i}
   \Rightarrow L = \frac{1}{2} m \dot{q}\_{i}^2 + \sum\_{k} f\_{k}
   (\dot{q}\_{j \neq i}) \Rightarrow{f\_{k} = 0} L = T \\]

A rigorous derivation, also known as Lanczos' parametric approach, can be done
taking a Lorentz invariant action and a covariant Lagrangian (Greiner
2010; Cline 2019).  Another approach, first shown in (Pars
1965), is utilizing d'Alembert's principle (Nađđerđ et al
2014).

Expanding the relativistic relation, for small velocities, it takes the form

\\[ L \approx - m c^2 + \frac{1}{2} m v^2 = - E\_{0} +
   T\_{\operatorname{nonrel}} \\]

For a particle in potential field, the relativistic Lagrangian is similar to
the classical form. That is the potential energy is subtracted from a kinetic
term that is the Lagrangian for a free particle.

\\[ L = - m c^2 \gamma^{- 1} - V \\]

## Bibliography

 -  W. Greiner. Classical Mechanics: Systems of Particles and Hamiltonian
Dynamics. Springer, 2010.

 -  D. Cline. Variational Principles in Classical Mechanics: Revised Second
Edition. River Campus Libraries, 2019.
[[URL]](http://classicalmechanics.lib.rochester.edu)

 -  L.A. Pars. A Treatise on Analytical Dynamics. Wiley, 1965.
[[URL]](https://archive.org/details/treatiseonanalyt0000pars)

 -  Laslo J Nađđerđ, Miloš D Davidović, and Dragomir M Davidović.
American Journal of Physics, 82(11):1083–1086, 2014.

