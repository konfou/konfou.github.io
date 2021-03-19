---
layout: post
title: stateless Linux
---
## Reasoning

The concepts partially encapsulating stateless Linux were [introduced by
Red  Hat in  2004][redhat2004] and  [an early  presentation][summit2006]
that was  done in  2006.  The  project did  not catch  on but  its ideas
have. It should be noted that this section isn't Linux specific as those
concepts actually apply to any operating system.

Consider a typical  deployment. Some identical systems  are installed on
some machines. Over time those systems will move away from each other or
else  their state  will  diverge because  of ad  hoc  mutations such  as
package upgrades and configuration changes.   Those systems will then be
distinct from  each other. The  stateless model  proposed by Red  Hat is
image-based rather file-based and all  systems run off identical images.
When a new state  is required a snapshot is taken and  then the image is
pushed to  other machines. Based on  that the paradigms of  that design,
meaning  the components  required  for a  machine to  be  deployed in  a
stateless matter, are

* read-only system filesystem
* temporary state
* dynamical state determination, meaning system adapts to the machine
* state stored centrally

This also  captures what  in [modern  terms is][gerla2020]  described as
immutable deployment. Basically the first describes immutability and the
others  statelessness.  But  a  stateless system  should be  replaceable
everytime.  As  a consequence  even if  immutability isn't  required for
statelessness, it  makes sure  it holds.  This  results in  that, rather
managing a system, it's its metadata that is managed.

In order  to drive state out  of the system, configuration  must be done
automatically per hardware  and configuration has to become  part of the
image. Having configuration detached from  the system makes it easier to
manage,  there're no  untracked  and stray  files,  no fragmentation  of
system  components, and  instantaneous  no-downtime recovery  in case  a
machine failure  happens.  Summarizing  it is a  clean model  for system
administration.

The  benefits  are  enhanced  security, easier  management,  and  easier
deployment of new machines. Though  primarily targeting cloud and server
infrastructure, it is useful for desktops as well.

## Linux application

On Linux systems vector-supplied data is stored in `/usr`, variable data
in  `/var`,  and  configuration  in  `/etc`.   According  [to  systemd's
dev][lennart2014],   stateful    is   the   traditional    system   with
machine-specific populated `/etc`, `/usr`,  and `/var`.  Systems without
populated `/var` are called volatile.   Stateless are those that startup
without either `/var`  or `/etc`. The definitions given  by Lennart only
consider  configuration  state  and  not installed  software,  which  as
mentioned in the previous section is also a problem.

Volatile  systems  are relatively  straight-forward,  and  only that  is
required  is   reconstructing  the   required  directory   hierarchy  in
`/var`. Some software do that on  their own, but some don't. The systemd
offers a  way to setup at  boot-time directories and files  for software
that don't. Booting up without populated  `/etc` isn't that simple as in
it are files essential for system operation.

A   distro  employing   that   stateless  concept   is  Intel's   [Clear
Linux][clearlinux].   This  is  realized  by  providing  a  system  that
functions   without   user   configuration   and   any   user-maintained
configuration  is easily  removable. To  accomplish this  the filesystem
hierarchy  [is  separated][clstateless]  between  user-owned  areas  and
system-owned   areas.   Software   in  Clear   Linux  provides   default
configuration  under   the  system-owned  `/usr`  and   specifically  in
`/usr/share/defaults` which  function as template. For  configuration to
be modified the template has to be copied in `/etc`. As result a factory
reset can be performed by simply recursively removing `/var` and `/etc`.

Though this fixes the problem of configuration state, installed software
remains mutable.  Then,  there's a problem of how  configuration will be
maintained.  A  solution comes from  the domain of  software deployment.
Though  tools automating  manual practices  in software  deployment have
been created, the issues aren't addressed  in a disciplined way and they
aren't doing anything about the  statefulness of systems.  That is those
tools  allow  specifying   the  desired  state  [but   only  in  initial
state][cuth2015].  The  requested state means  a setup is  available but
not  that is  the  system's  total setup.   [Nix],  first described  [in
Dolstra's  thesis][dolstra2006], was  created  to address  the issue  of
software deployment by eliminating problems arising due to system state.
The Nix system is made of  a functional language, a package manager, and
a build manager.

[NixOS]  is a  distribution based  on  Nix.  Its  configuration is  done
centrally and represents  a Nix recipe. When a rebuild  of the system is
requested the  expressions within that  recipe are evaluated, and  a new
"image", called  derivation, gets  build marking  a new  generation. The
system can  then switch  to this new  image. Specifically,  the packages
required  and their  assets are  installed  in a  read-only store  under
`/nix`  and  some  directories  are populated  with  symlinks  to  files
resulting from the evaluation.

On  boot it  is  made sure  that the  filesystem  matches the  specified
setup. Basically the  only directories actually required  are `/nix` and
`/boot`.   That  said,  even  if   NixOS  has  a  stateless  declarative
configuration, it isn't immutable. Ad hoc mutations can still take place
outside  `/nix` such  as  configuration in  `/etc`  though Nix  actually
allows  making   any  file  in   any  system  directory.   [A   post  by
Graham][graham2020] shows how to setup NixOS for immutability.

Other  recent  approaches  are  inspired by  containers  popularized  by
Docker.   The creation  of a  container is  done by  applying imperative
actions on  an initial  image with well-known  state, and  the resulting
image is  immutable by  design.  Those  images are  layered on  one upon
another to get the desired state. It  should be noted that this model is
close to  the one initially  proposed by  Red Hat. [Darch]  applies that
approach on  a host  system. Meaning  that it is  installed atop  a base
distro and because of its container approach allows using software meant
for other  distros by  utilizing the relevant  images.  This  bears some
similarity  to   [Bedrock]  with   an  immutable   twist.   Installation
instructions for VM can be  found [on developer's blog][knopf2018].  Red
Hat  is working  on [Silverblue],  a Fedora-based  project with  similar
approach,  replacing packages  with system  images. It  builds atop  few
technologies, most prominent [libostree] and [Flatpak].

Though less clean, flexible, and powerful  approach than Nix, it is also
simpler, not  requiring learning a domain-specific  language and instead
continue using an already known toolset, that of the host distro. On the
issue of domain-specific language, [GNU Guix][Guix] is a Nix-like system
replacing Nix  language with Guile,  a Scheme dialect and  GNU's project
programming  and  extension language.   Guix  System  is the  Guix-based
distribution akin to NixOS.

[redhat2004]: https://web.archive.org/web/20040918071252/http://people.redhat.com/~hp/stateless/StatelessLinux.pdf
[summit2006]: https://people.redhat.com/notting/summit/summit-nottingham.pdf
[gerla2020]: https://www.cncf.io/wp-content/uploads/2020/08/CNCF-March-2020-Webinar-Talos-Systems.pdf
[lennart2014]: http://0pointer.net/blog/projects/stateless.html
[clearlinux]: https://clearlinux.org/
[clstateless]: https://docs.01.org/clearlinux/latest/guides/clear/stateless.html
[Nix]: https://nixos.org/guides/how-nix-works.html
[dolstra2006]: https://edolstra.github.io/pubs/phd-thesis.pdf
[NixOS]: https://nixos.org/
[cuth2015]: http://gfxmonk.net/2015/01/03/nixos-and-stateless-deployment.html
[graham2020]: https://grahamc.com/blog/erase-your-darlings
[Darch]: https://godarch.com/
[Bedrock]: /posts/bedrock-the-end-of-distro-hopping/
[knopf2018]: https://pknopf.com/post/2018-11-09-give-ubuntu-darch-a-quick-ride-in-a-virtual-machine/
[Silverblue]: https://silverblue.fedoraproject.org/
[libostree]:https://ostreedev.github.io/ostree/
[Flatpak]: https://flatpak.org/
[Guix]: https://guix.gnu.org/
