---
title: GoboLinux redefining filesystem hierarchy
---

The traditional [Unix filesystem  hierarchy][ufsh] is a bit complicated.
As it  was explained in the  first section of  my post on it,  `/opt` is
used for software  to be contained in a single  tree rather having their
files spread through the system. This  concept of _each program gets its
own directory  tree_ is  taken to extreme  by [GoboLinux]  distro.  More
generally it reorganizes root to a new, hopefully more logical way.

## Hierarchy

The root structure in GoboLinux is the following.

| /Data     | System and program resources |
| /Mount    | Mount points                 |
| /Programs | Every program; no exceptions |
| /System   | System files                 |
| /Users    | User home directories        |

First  of   all,  there's  a  common   [misconception][gldirnames]  that
descriptive directory names are for user friendliness. The actual reason
is to  not conflict  with Unix  namespace.  The  capitalized descriptive
names originated  from NeXT that  also had  to make its  own directories
coexist with Unix ones.  Using the regular directory tree with different
semantics  can  be confusing.   This  happens  in AtheOS,  where  `/usr`
behaves  like `/opt`.   The influencial  Unix-derived Plan  9 also  does
this, or better say  Unix itself did it.  In Plan  9 `/usr` behaves like
`/home`. This is  actually [similar to early][usr]  Unix versions, where
`/usr` was holding user home directories.

Having every program in `/Programs`  means that someone can explore what
is installed in their system just  by doing `ls /Programs`.  This can be
thought as a database-less package  management system with the directory
structure itself organizing the system. As a consequence of this system,
package  management  can  take  place  using  common  Unix  file  tools.
Specifically it's simpler  to create and share  binary packages.  Having
this structure  means that packages  can be created just  by compressing
its directory. They can removed just by removing the directory.

Each entry in `/Programs` contains all files for that program, stored in
a versioned subdirectory.  The  subdirectory mirrors `/usr` hierarchy of
traditional systems for the specific  program.  The versioned tree makes
it simple to maintain simultaneously multiple versions for each program.

For  each file  category,  there is  a  directory under  `/System/Index`
grouping files  from each application  as links.  Those  directories are
the traditional Unix ones found in `/usr` and specifically bin, include,
lib, lib64  -> lib,  libexec, sbin ->  bin, and share.  It can  kinda be
though as `/usr/local`.

[In its initial presentation][k5] the directory was `/System/Links`, and
the  directories  were  Executables,   Libraries,  Headers,  Shared  and
Manuals. The migration to the new hierarchy happened in version 015.
The reason was issues with packaging.

Legacy  applications  continue to  work  thanks  to symlink  mapping  of
traditional paths  into their  GoboLinux counterparts.  Those  paths are
hidden when  listing root but  application can  still read and  write to
them.   This  is  made  possible by  using  [GoboHide]  an  icotls-based
interface, actually  a kernel extension meaning  no kernel modifications
are  required. The  `gobohide` is  the  userspace tool  that talks  with
kernel. To show all hidden directories `gobohide -l` can be used.

The mapping can then be seen with

```
$ gobohide -l / | while read dir; do ls -l $dir; done
```

For reference in latest (v017) version this is

| /bin -> /System/Index/bin        |
| /boot -> /System/Kernel/Boot     |
| /config -> /System/Kernel/Config |
| /dev -> /System/Kernel/Devices   |
| /etc -> /System/Settings         |
| /lib -> /System/Index/lib        |
| /lib64 -> /System/Index/lib64    |
| /media -> /Mount/Media           |
| /mnt -> /Mount                   |
| /proc -> /System/Kernel/Status   |
| /root -> /Users/root             |
| /run -> /Data/Variable/run       |
| /sbin -> /System/Index/sbin      |
| /srv -> /Data                    |
| /sys -> /System/Kernel/Objects   |
| /tmp -> /Data/Variable/tmp       |
| /var -> /Data/Variable           |

There's also `/usr` with the following directories and files in it.

| ./bin -> /System/Index/bin         |
| ./include -> /System/Index/include |
| ./lib -> /System/Index/lib         |
| ./lib64 -> /System/Index/lib64     |
| ./libexec                          |
| ./local -> /usr                    |
| ./man -> /System/Index/share/man   |
| ./plugins                          |
| ./sbin -> /System/Index/sbin       |
| ./share -> /System/Index/share     |
| ./X11R6 -> /usr                    |

The  arguments `gobohide  -h/-u`  can  be used  to  hide  and undhide  a
directory respectively. A useful example  is mapping `/home` to `/Users`
and `/root` to `/Users/root`.

```
# mkdir -p /Users/root
# ln -s /Users /home
# gobohide -h /home
# ln -s /Users/root /root
# gobohide -h /root
```

Then  doing `ls  -l`  will show  the  same structure  as  that in  first
section, but you can do `ls -l /home` and `cd /home` just fine.

## Compile

The   design  of   `/Data/Compile`   is   also  interesting,   [referred
as][compile]  _the  poor-man's  portage_  because  of  its  minimalistic
design.   The Compile  and  the  Recipes tree  are  designed around  the
universality of source distribution and  use of common build tools.  The
Recipes are declarative files that describe what the compilation process
is like rather imperative scripts.

The recipes files  are hosted on GitHub  [@gobolinux/Recipes].  The tree
structure  is  similar to  `/Programs`  that  is directories  for  every
program  and  subdirectories  for  every   version.   The  tree  can  be
downloaded locally (doing swallow clone) for easy usage doing

```
git clone --depth=1 https://github.com/gobolinux/Recipes /Data/Compile/Recipes
```

That said this isn't required  for software installation. `Compile` will
download a recipe when a  compilation is requested. Doing `Compile $pkg`
will  perform a  case-insensitive search  for a  recipe named  `$pkg`. A
particular version may be chosen instead doing `Compile $pkg $vers`.

Let's  see  closer how  recipes  work.  For  example, the  `Recipe`  for
`file/5.39` (found in the directory ./File/5.39) is

>TODO: Make PR to @gobolinux/Recipes

```
compile_version=1.9.0
url="ftp://ftp.astron.com/pub/file/file-5.39.tar.gz"
file_size=954266
file_md5=1c450306053622803a25647d88f80f25
recipe_type=configure
```

There's also  a `Resources` directory holding  metadata.  This directory
is eventually copied to the `/Programs` subdirectory of the program. The
files in are the following along with their contents.

BuildDependencies
```
LibTool
```

BuildInformation
```
Glibc 2.24
LibSeccomp 2.3.2
ZLib 1.2.3
```

Dependencies
```
ZLib 1.2.3
```

Description
```
[Name] file
[Summary] File type identification utility
[License] BSD License (original)
[Description] File attempts to classify files depending on their contents and prints a description if a match is found.
[Homepage] https://darwinsys.com/file
```

Then  the program  can  be installed  with `Compile  file`  or for  that
version specifically  with `Compile  file 5.39`.   Extra options  can be
passed ad hoc  as flag in `Compile`  command.  This makes it  a bit like
build tool-agnostic make. When the  package's files and directories have
been created and populated, Compile will then create the necessary links
in the `/System/Index`.

In my  opinion this model though  very simple (less complexity  is good)
leads  to some  redundancy. For  example  the Description  file will  be
copied unchanged  between versions.  Also  the others files  will remain
mostly the same between versions with only version changes.

## Concepts in other systems

GoboLinux  is  [influenced][glinfluences]  and  draws  inspiration  from
others systems  that build a  _different_ system  on top of  Unix based.
Examples  of  such systems  are  NeXT,  BeOS,  and AtheOS.   That  said,
GoboLinux isn't a clone of any of those systems.

NeXT was  already mentioned to  be the  originator of the  top hierarchy
naming.  The  well-known macOS  (formerly OS X)  is NeXT's  ancestor and
traces of that  heritage are still present  in it.  One of  those is the
hierarchy.  Specifically, macOS has both its own _user friendly_ as well
as  standard Unix  directories that  are  hidden in  Finder (macOS  file
manager).  The standard macOS hierarchy  (sans the Unix directories) [is
the following][macOSfs].

| /Applications | Installed applications          |
| /Library      | App-specific resources          |
| /Network      | Network-accessible resources    |
| /System       | System/Apple-provided resources |
| /Users        | User home directories           |
| /Volumes      | Mount points                    |

The Unix  specific directories are  utilized by the system's  BSD layer.
Those are actual  directories rather symlinks as in  GoboLinux case.  It
can  be  thought as  macOS  _splitting_  its filesystem  to  directories
originating from its NeXT and BSD heritage.

Interestingly, the `Compile` concept of  setting a build style (not sure
if GoboLinux was an inspiration) is  used in Void Linux which also hosts
its templates on GitHub  [@void-linux/void-packages]. For comparison the
`template` for  `file` in Void Linux  is (own simpler version  for demo;
modified from [original in upstream][file-template])

```
pkgname=file
version=5.39
build_style=gnu-configure
makedepends="zlib-devel"
short_desc="File type identification utility"
license="BSD-2-Clause"
homepage="https://darwinsys.com/file"
distfiles="https://astron.com/pub/file/file-${version}.tar.gz"
checksum=f05d286a76d9556243d0cb05814929c2ecf3a5ba07963f8f70bfaaa70517fad1
```

The declarative approach and symlink population of specified directories
is also central  to Nix (and Guix) package manager.  Basically, NixOS is
perhaps the most popular distro with alien filesystem.  In addition, Nix
also hosts its nixpkgs tree  on GitHub [@NixOS/nixpkgs].  For comparison
the  `default.nix`  for file  in  Nix  (own  simpler version  for  demo;
modified from [original in upstream][file-default-nix])

```
{ lib, stdenv, fetchurl, zlib }:
stdenv.mkDerivation rec {
  pkgname = "file";
  version = "5.39";
  src = fetchurl {
    url = "https://astron.com/pub/file/$file-${version}.tar.gz";
    sha256 = "f05d286a76d9556243d0cb05814929c2ecf3a5ba07963f8f70bfaaa70517fad1";
  };
  buildInputs = [ zlib ];
  meta = with lib; {
    homepage = "https://darwinsys.com/file";
    description = "File type identification utility";
    license = licenses.bsd2;
  };
}
```

Informatively, every  installed package  is installed in  a `/nix/store`
subdirectory which mirrors `/usr`  of traditional systems. Then symlinks
are made  in `~/.nix-profile` which is  employed by a local  user, or in
`/run/current-system/sw` if system-wide. The  central difference is that
the file-system doesn't function as  a package manager.  Rather usage of
Nix is mandatory and a central  point for reproducibility by not letting
a system administrator modify any system files.

The filesystem as package manager model is also utilized by stali, which
has, a  [described in  another post][stalifs], simplified  (no secondary
and   tertiary  hierarchy)   form   of   traditional  Unix   filesystem.
Specifically   the   entire   rootfs    is   managed   by   git.    Then
[upgrading][staliup] is just

```
# cd /
# git pull
```

Alternatively to downgrade or checkout a specific release

```
# cd /
# git checkout 0.1
```

## Comments

Alongside the  `/System/Links` directory mentioned in  the first secion,
another  thing lost  from the  distro's initial  times, is  the rootless
GoboLinux  installation. It  used to  be possible  to install  GoboLinux
inside a $HOME directory under  another distro.  That meant that someone
could  run  GoboLinux  applications   as  an  unpriviledged  user.   The
installation resulted  in the creation of  the directories `~/Programs`,
`~/System`, and `~/.Settings`.

GoboLinux has  slow development  and few  users.  As  a final  note, its
experimental    nature   means    more   possibilities    for   security
problems.  Those  are  issues   also  mentioned  in  [Bedrock],  another
experimental  distro.  [An  HN  user][netsec_burn] has  said  that in  a
default Gobo installation there're multiple  ways to get root privileges
from an unprivileged user.

If not  for its interesting  concepts, then  it worths trying  the [live
ISO][gldl]  for  its  cool  cyberpunk-ish themed  awesome.   Awesome  is
well-known Lua-extensible window manager commonly used in tiling set up.
The  installation shows  that awesome  is an  excellent floating  window
manager as well.

[ufsh]: /posts/unix-filesystem-hierarchy
[gldirnames]: http://gobolinux.org/doc/articles/clueless.html#first_content_block:~:text=The%20alleged%20user%2Dfriendliness%20of%20longer%20names
[usr]: https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/usr.html
[k5]: https://gobolinux.org/k5.html#first_content_block:~:text=What%20is%20it%20all%20about%3F
[GoboLinux]: https://gobolinux.org/at_a_glance.html
[GoboHide]: https://gobolinux.org/doc/articles/gobohide.html
[compile]: https://gobolinux.org/doc/articles/compile.html
[@gobolinux/Recipes]: https://github.com/gobolinux/Recipes
[glinfluences]: https://gobolinux.org/k5.html#first_content_block:~:text=Related%20work
[macOSfs]: https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html#//apple_ref/doc/uid/TP40010672-CH2-SW6
[@void-linux/void-packages]: https://github.com/void-linux/void-packages/
[file-template]: https://github.com/void-linux/void-packages/blob/master/srcpkgs/file/template
[@NixOS/nixpkgs]: https://github.com/NixOS/nixpkgs
[file-default-nix]: https://github.com/NixOS/nixpkgs/blob/master/pkgs/tools/misc/file/default.nix
[stalifs]: /posts/unix-filesystem-hierarchy/#usr-merge:~:text=The%20stali%20distro
[staliup]: https://sta.li/upgrade/
[Bedrock]: /posts/bedrock-the-end-of-distro-hopping
[netsec_burn]: https://news.ycombinator.com/item?id=26007551
[gldl]: https://gobolinux.org/downloads.html
