---
title: Keplerian orbits in special relativity
---
Based on PLANCKS 2019. Problem 4.

Also (Goldstein et al 2002, ex. 7.26). It is analyzed in depth in
(Lemmon & Mondragon 2010). This post is based on this paper but is
simplified and augmented to what the PLANCKS problem asks.

For a particle in potential field, the relativistic Lagrangian is[^1]

\\[ L = - m c^2 \gamma^{- 1} - V \\]

Utilizing the previous result, the relativistic Lagrangian for the sun-planet
system, where the potential energy is[^2] the Newtonian gravitational energy,
is

\\[ L = - m c^2 \gamma^{- 1} + \mu m r^{- 1} \quad \mu = G M \\]

The problem is considered in polar coordinates $(r, \theta)$. That is

\\[ v^2 = \dot{r}^2 + r^2 \dot{\theta}^2 \Rightarrow \gamma^{- 1} = (1 - v^2 /
   c^2)^{1 / 2} = (1 - (\dot{r}^2 + r^2 \dot{\theta}^2) / c^2)^{1 / 2} \\]

The equations of motions are derived from Lagrange's equations

\\[ \frac{d}{d t} \left( \frac{\partial L}{\partial \dot{q}\_{i}} \right) -
   \frac{\partial L}{\partial q\_{i}} = 0 \quad q\_{i} \in \lbrace r, \theta
   \rbrace \\]

which take the form

\\[ q\_{i} = r \longrightarrow - m c^2 \frac{d}{d t} (\partial \_{\dot{r}}
   \gamma^{- 1}) + m c^2 \partial \_{r} \gamma^{- 1} + \mu m r^{- 2} = 0
   \Rightarrow \frac{d}{d t} (\gamma \dot{r}) - \gamma r \dot{\theta}^2 + \mu
   r^{- 2} = 0 \\]

\\[ q\_{i} = \theta \longrightarrow - m c^2 \frac{d}{d t} \partial
   \_{\dot{\theta}} \gamma^{- 1} = 0 \Rightarrow m \frac{d}{d t} (\gamma r^2
   \dot{\theta}) = 0 \Rightarrow \frac{d}{d t} (\gamma r^2 \dot{\theta}) = 0
\\]

The first gives the equation of motion

\\[ \gamma \ddot{r} + \dot{\gamma} \dot{r} + \mu r^{- 2} - \gamma r
   \dot{\theta}^2 = 0 \\]

whereas the second a quantity that is conserved, analogous to Newtonian
angular momentum

\\[ l = \gamma r^2 \dot{\theta} =\operatorname{const}. \Rightarrow \gamma r
   \dot{\theta}^2 = \frac{l^2}{\gamma r^3} \\]

Eliminating time

\\[ \dot{r} = \frac{d}{d \theta} \dot{\theta} r = \frac{d}{d \theta}
   \frac{l}{\gamma r^2} r = - \frac{l}{\gamma} \frac{d}{d \theta} r^{- 1}
   \Rightarrow \gamma \ddot{r} = - \dot{\gamma} \dot{r} - \frac{l^2}{\gamma
   r^2} \frac{d^2}{d \theta^2} r^{- 1} \\]

Substituting the last two in the equation of motion

\\[ - \frac{l^2}{\gamma r^2} \frac{d^2}{d \theta^2} \frac{1}{r} + \mu
   \frac{1}{r^2} - \frac{l^2}{\gamma r^3} = 0 \Rightarrow \frac{d^2}{d
   \theta^2} \frac{l^2}{\mu} \frac{1}{r} + \frac{l^2}{\mu} \frac{1}{r} =
   \gamma \\]

During the nonrelativistic derivation the equation of motion takes the form

\\[ \frac{d^2}{d \theta^2} \frac{r\_{c}}{r} + \frac{r\_{c}}{r} = 1 \\]

with solution

\\[ r^{- 1} = r\_{c}^{- 1} (1 + e \cos (\theta - \theta \_{0})) \\]

Comparing, we set $r\_{c} = l \mu^{- 1}$ and $\lambda = \gamma - 1$. The
previous is then written

\\[ \frac{d^2}{d \theta^2} \frac{r\_{c}}{r} + \frac{r\_{c}}{r} = 1 + \lambda
\\]

The $\lambda$ represents the correction due to SR. The planets are described
by near-circular orbits ($e \ll 1 \Rightarrow \dot{r} \approx 0$) and small
velocities ($v / c \ll 1$). Then the correction is approximated

\\[ \lambda = \gamma - 1 \approx (1 / 2) (r \dot{\theta} / c)^2 \Rightarrow
   \lambda \approx (1 / 2) (l / r c)^2 (1 + \lambda)^{- 2} \Rightarrow \lambda
   \approx (1 / 2) (l / r c)^2 \\]

Substituting to the previous

\\[ \frac{d^2}{d \theta^2} \frac{r\_{c}}{r} + \frac{r\_{c}}{r} \approx 1 +
   \epsilon \left( \frac{r\_{c}}{r} \right)^2 \quad \epsilon = \frac{1}{2}
   \left( \frac{\mu}{l c} \right)^2 \\]

Let

\\[ 1 / s = r\_{c} / r - 1 \ll 1 \Rightarrow (r\_{c} / r)^2 \approx 1 + 2 / s
\\]

The previous is rewritten

\\[ \frac{d^2}{d \theta^2} \frac{1}{s} + \frac{1}{s} \approx 2 + \epsilon
   \left( 1 + \frac{1}{s} \right) \Rightarrow \frac{2}{\epsilon} \frac{d^2}{d
   \theta^2} \frac{1}{s} + \frac{2 (1 - \epsilon)}{\epsilon} \frac{1}{s}
   \approx 1 \\]

Substituting $u = \theta \sqrt{1 - \epsilon}$

\\[ \frac{d}{d u^2} \frac{s\_{c}}{s} + \frac{s\_{c}}{s} \approx 1 \quad s\_{c}
   = \frac{2 (1 - \epsilon)}{\epsilon} \\]

with solution

\\[ s^{- 1} = s\_{c}^{- 1} (1 + \kappa \cos (u - u\_{0})) \\]

Finally, restoring the original coordinates

\\[ r^{- 1} = r\_{0}^{- 1} (1 + \varepsilon \cos (\alpha (\theta - \theta
   \_{0}))) \\]

where (note that $\alpha \neq a$ where $a$ the semimajor axis)

\\[ r\_{0} \approx r\_{c} (1 - \epsilon) = l \mu^{- 1} (1 - \epsilon) \quad
   \varepsilon \approx e (1 + \epsilon) \quad \alpha \approx 1 - \epsilon \\]

For a Keplerian orbit

\\[ l^2 = \mu a (1 - e^2) \Rightarrow \epsilon = \frac{\mu}{c^2 a (1 - e^2)}
\\]

The shift in perihelion is the angle

\\[ \Delta \theta = 2 \pi (\alpha^{- 1} - 1) \approx 2 \pi \epsilon
\Rightarrow
   \Delta \theta \approx \frac{2 \pi \mu}{c^2 a (1 - e^2)} \\]

Consider the case we're given the mean radius $\bar{r}$ and orbital period
$T$. The orbital period can give directly the semimajor through Kepler's third
law ($n = 2 \pi / P$ is the mean motion).

\\[ \mu = n^2 a^3 \Rightarrow \frac{\mu}{4 \pi^2} P^2 \Rightarrow a = \left(
   \frac{\mu}{4 \pi^2} P^2 \right)^{1 / 3} \\]

The mean radius can be computed integrating over the orbit. The result is in
terms of semimajor axis and eccentricity, which is then solved for
eccentricity.

\\[ \bar{r} = \frac{1}{2 \pi} \int\_{0}^{2 \pi} r (\theta) d \theta = a
\sqrt{1
   \- e^2} \Rightarrow e = \sqrt{1 - \bar{r}^2 / a^2} \\]

Having the semimajor axis and eccentricity the shift in perihelion can be
computed.

## Bibliography

 -  Herbert Goldstein, Charles Poole, and John Safko. Classical mechanics.
Addison Wesley, 2002.
[[URL](https://archive.org/details/GOLDSTEINClassicalMechanics)]

 -  Tyler J Lemmon and Antonio R Mondragon. Kepler's orbits and special
relativity in introductory classical mechanics. Preprint
[arXiv:1012.5438](https://arxiv.org/abs/1012.5438),
2010.

[^1]: See my previous post on [relativistic Lagrangian](/posts/relativistic-lagrangian).
[^2]: An alternative will be taking $V = \mu \gamma m r^{- 1}$. See (Lemmon & Mondragon 2010) where this case is also considered.
