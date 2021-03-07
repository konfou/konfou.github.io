---
layout: post
title: Bedrock, the end of distro-hopping
---
During the initiation of a new  user in the Linux world someone installs
their  first distro,  that's a  Linux-based operating  system with  some
pre-installed  software. What  will usually  happen is  a short  time of
_distro-hopping_ where  the user will switch  between distros frequently
and try a variety of them. If ideological reasons (for example free-only
software) are  not considered,  what should  become quickly  apparent is
that Linux distros differ mainly in

* pre-configured desktop environment or window manager
* package manager
* init manager
* release cycle (fixed vs rolling)

The first isn't of much importance since theoretically you can use every
DE  and WM  in any  distro.  I say  theoretically because  there can  be
exceptions, environments that are difficult  to package and aren't found
everywhere  (e.g. Unity  7). But  the  next are  what characterize  most
distros.

## Enter Bedrock

[Bedrock]  started on  2009, first  internal release  occurred 2011  and
first public release on  2012. It is a meta distro  that allows users to
mix-and-match    components    from    other   which    are    typically
incompatible.   These  components   are  integrated   into  a   cohesive
system. This solves  the problem of packages existing in  one distro but
not  in another.  An  example  is running  Debian  stable with  packages
available in Arch. This allows having updated packages without [making a
FrankenDebian][frankdeb]   or   running   sid.   Basically   it   is   a
distro-hopping  stopper; you  can have  any environment,  access to  any
package manager, any init system, and the release cycle you desire.

Itself is  a collection  of tools  to glue  those other  components. The
system's files  and processes are  organized into units  called _strata_
which can  be thought as  selectively dented chroots. Then  _crossfs_, a
FUSE-based   filesystem,  makes   resources  available   across  stratum
boundaries.

Installation is  based on its meta  identity. That is you  cannot format
and install  Bedrock. Rather an  installed distro is  converted in-place
into  Bedrock. Arch,  Void, Debian,  Ubuntu,  and Gentoo,  are the  base
distros with  highest community usage,  no known issues,  fetch support,
and  an active  maintainer. Therefore  a simple  way to  get Bedrock  is
installing Debian with netinst and then running the installation script.

The script corresponding to architecture  should be taken [from userland
releases  file][blv07ur].  Then  it  has  to be  run  as  root with  the
`--hijack` flag.  Hijacking moves the previous  install files elsewhere,
installs  Bedrock  to  root,  and  adds  the  previous  install  as  new
stratum. The following script combines all the steps.

```
#!/bin/sh
vers=0.7
arch=`uname -a | awk '{print $(NF-1)}'`
link="https://raw.githubusercontent.com/bedrocklinux/bedrocklinux-userland/$vers/releases"
last=`wget -O - $link | grep $arch | head -1`
wget $last
sh ./`echo $last | awk -F '{print $NF}'` --hijack
```

Rebooting  an  init  selection  menu   should  appear.   On  first  look
everything  appears  the  same.  Probably  you  could  even  forget  you
installed Bedrock. But, that isn't  what is happening. After logging run
the  following   for  an  interactive   version  of  the   [basic  usage
tutorial][blv07bu].

```
$ brl tutorial basics
```

For quick reference, a mini-tutorial  will follow. The distro manager is
the `brl` command. You can get  components from another distro using the
`fetch` argument. For example

```
# brl fetch arch
```

The Arch's package manager `pacman` will then become available. Packages
can be installed like on Arch. For example to install `hello`, just do

```
# pacman -S hello 
```

Rather manually using each package  manager, `pmm` is provided which can
be  considered a  meta-package manager.  It can  mimic the  interface of
package  managers from  supported distros  (pacman, xbps,  apt, portage,
etc). By default it mimics the interface of hijacked distro.

The  stratum from  which the  comamnd will  be run  is figured  out from
context. Bedrock can be configured to ensure a stratum always provides a
given command. This is called [pinning][blv07wp], and is done by editing
the central configuration file  found in `/bedrock/etc/bedrock.conf`. Ad
hoc can be done with

```
$ strat $stratum $command
```

If it  isn't pinned  the local one  will be utilized.  If it  is neither
pinned or locally available, the  first instance of command in available
strata will  be used.  Commands  may be  restricted to the  stratum they
come from with

```
$ strat -r $stratum $command
```

A  stratum can  be  in disk  but  not  be integrated.  This  is done  by
disabling it.

```
# brl disable arch
```

It can of course be re-enabled anytime.

```
# brl enable arch
```

After disabling it can be removed with

```
# brl remove arch
```

Removing  before disabling  can be  done  with the  `-d` argument.   The
stratum providing the init cannot be removed until reboot and another is
chosen. The  hijacked stratum can  be removed  but the bootloader  to be
updated it has to be installed on another.

Making a stratum from an unsupported  distro is done by getting distro's
root, copying the root to `/bedrock/strata/$name` preserving permissions
and  symbolic links,  registering  with `brl  show  $name`, and  finally
enabling with `brl enable $name`.

Closing  up,  general issues  are  complexity,  greater attack  surface,
unsolvable  incompatibilities  (see   [page  on  v0.7][blv07fc]),  small
community, duplicated  files resulting in  disk overhead, and  a runtime
overhead resulting in a slight performance loss.

[Bedrock]: https://bedrocklinux.org/
[frankdeb]: https://wiki.debian.org/DontBreakDebian#Don.27t_make_a_FrankenDebian
[blv07ur]: https://raw.githubusercontent.com/bedrocklinux/bedrocklinux-userland/0.7/releases
[blv07bu]: https://bedrocklinux.org/0.7/basic-usage.html
[blv07wp]: https://bedrocklinux.org/0.7/workflows.html#pinning
[blv07fc]: https://bedrocklinux.org/0.7/feature-compatibility.html
