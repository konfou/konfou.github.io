---
title: Unix filesystem hierarchy
---

Traditional  Unix   systems  have   a  common  filesystem   layout  with
hierarchical  tree-based structure.  This  isn't standardized  and as  a
consequence   has  varied   over   time  and   among  various   systems.
Nevertheless  and  before  proceeding  any  further,  POSIX  [compliance
requires][posix] the following directories

| /    | Root directory                        |
| /dev | Contains `null`, `tty`, and `console` |
| /tmp | Writeable directory                   |

Also the binaries `/bin/sh` and `/usr/bin/env` are required.

In this post I won't go  into historical significance of its directories
and the reason they were created in initial times of Unix.  Rather, this
will be a presentation alongside some commentary for modern systems.

## FHS

An  attempt to  standardization  comes from  Linux  that has  introduced
_Filesystem Hierarchy  Standard_ which  defines the  directory structure
and  theirs contents  for  Unix  systems and  an  annex for  Linux-based
operating  systems. It  is  based on  the  following distinctions  among
files.

 * Shareable  vs. unshareable  where shareable are  files stored  on one
   host and (can be) used on others.

 * Static vs. variable where static are those that do not change without
   administrator intervention.

The following top-level (root)  hierarchy structure are the non-optional
(sans `/home` and `/root`) and  the Linux specific directories specified
in the latest version ([FHS v3.0][fhs], released 2015).

| /      | Root filesystem                         |
| /bin   | Essential user command binaries         |
| /boot  | Static files for the boot loader        |
| /dev   | Device files (virtfs)                   |
| /etc   | Host-specific system configuration      |
| /home  | User home directories (optional)        |
| /lib   | Essential shared libraries              |
| /media | Mount point for removable media         |
| /mnt   | Temporary mount point                   |
| /opt   | Application software packages           |
| /proc  | Kernel and process information (virtfs) |
| /root  | Home directory for root user (optional) |
| /run   | Run-time variable data                  |
| /sbin  | Essential system binaries               |
| /srv   | Data for system provided services       |
| /sys   | Kernel and system information (virtfs)  |
| /tmp   | Run-time temporary files                |
| /usr   | Secondary hierarchy                     |
| /var   | Variable data                           |

The `/bin` must contain no  subdirectories.  In contrast files in `/etc`
are  recommended be  stored in  subdirectories.  The  `/usr` and  `/var`
directories are  a bit complex.   The `/usr` is  host-independent whence
shareable,  read-only   data  and   its  hierarchy  has   three  similar
directories to  root with  the following  structure. (Paths  relative to
`/usr`.)

| ./bin     | User command binaries         |
| ./include | Headerfiles (optional)        |
| ./lib     | Libraries                     |
| ./local   | Tertiary hierarchy            |
| ./sbin    | Non-essential system binaries |
| ./share   | Architecture-independent data |
| ./src     | Source code (optional)        |

Optionally  exists  `./libexec`  that  includes binaries  run  by  other
programs, which is common practice in some environments. The `./lib` can
also be used for this purpose and  as older FHS versions did not support
`./libexec` using `./lib` became the common practice.

The `./local` subdirectory  mirrors `/usr` itself and is for  use by the
system  administrator for  local software.   The `./local`  hierarchy is
supposed to  be managed  manually, `/usr` is  managed through  a package
manager, and `/opt`  by both with subdirectories  managed either through
package manager or  manually.  Packages installed in  `/opt` contain all
their static files in their  directory rather being put in pre-specified
directories like Unix software traditionally  is.  That said, some files
are eventually copied into `/etc/opt` and `/var/opt`.

The `./share` is used by programs  to contain static, read-only data.  A
subdirectory is  recommended, except if a  single file is used  in which
case `./share/misc` may  used instead. The following  mandatory and some
optional directories can be inside it. (Paths relative to `/usr/share`.)

| ./man  | Primary manual pages directory         |
| ./misc | Miscellaneous data                     |
| ./dict | Word lists (optional)                  |
| ./doc  | Miscellaneous documentation (optional) |
| ./info | GNU Info system (optional)             |

The  `/var` has  a structure  showing its  purpose for  holding variable
files for system operation. (Paths relative to `/var`.)

| ./cache | Application cache data           |
| ./lib   | Variable state information       |
| ./lock  | Lock files                       |
| ./log   | Log files and directories        |
| ./opt   | Variable data for /opt           |
| ./run   | Run-time variable data           |
| ./spool | Application spool data           |
| ./tmp   | Reboot-preserved temporary files |

The  `/var/lib`  also  contains  data  not  exposed  to  consumers.   In
contrast, data  for use by  services is  put in `/srv`.   This top-level
directory  provides  space for  services  requiring  a single  tree  for
read-only data,  writable data and  scripts. The `/srv` has  no specific
subdirectory structure and is a  free namespace, something that is often
abused.

## Virtual file systems

The userspace or virtual file systems are filesystems not presented on a
storage  medium  and show  the  strength  of the  _everything is a file_
abstraction found in  Unix systems.  I've noted virtual  file systems in
root  hierarchy with  virtfs.  The  `/dev`,  using `devfs`,  is the  the
location  of special  or  device files.   The  `/proc`, using  `procfs`,
offers a snapshot of kernel and userspace processes instantaneous state.
It  can   be  used  for   retrieval  of  kernel,  process,   and  memory
information. Finally,  `/sys`, using `sysfs`, exposes  kernel's volatile
objects to userspace. Those are  information about devices, drivers, and
kernel features. It Should be noted that `/proc` and `/sys` are the only
Linux specific directories  of the root hierarchy.   Also technically on
many systems `/tmp`  is a virtual file system as  well.  Specifically it
is  called a  `tmpfs`, storage  space that  resides in  memory rather  a
permanent storage device.

## /usr merge

There   is   some   redundancy   which   though   it   has   [historical
justification][rob], this isn't the case  anymore. Most obvious and seen
in detail above, `/usr` being mostly  a mirror of `/`. The recent decade
steps were  taken by  major distros  to amend this  by making  a [merged
`/usr`  directory  scheme][usrmergefd] with  `/{bin,sbin,lib}`  becoming
symlinks  to `/usr/{bin,sbin,lib}`.   Though  simplification wasn't  the
purpose, rather it was improved  compatibility with other Unixes and GNU
buld systems,  it also  succeeds in  reducing the  hierarchy complexity.
The reasoning for  moving directories to `/usr` rather back  to the root
is that  `/usr` could  be mounted  read-only by  default and  root could
remain  r/w  and   contain  only  empty  mount   points,  symlinks,  and
host-specific  data.  This  means that  `/usr` can  be shared  read-only
across several systems and it would contain almost the entire system.

After the `/usr` merge, the base of the system [is composed][usrmergefe]
of the following directories.

| /usr | Installed system; shareable       |
| /etc | Configuration data; non-shareable |
| /var | Persistent data; non-shareable    |
| /run | Volatile data; non-shareable      |

Systems that clean `/var` on reboot  are _volatile_ and is a step before
[stateless] which means a system bootable without any configuration data
(empty `/etc`). The idea behind it  is that software should have its own
defaults making `/etc`  closer to its goal as a  space for host-specific
configuration.

Continuing on  _historical artifact_  directories, there're  some others
that are mostly  unusable in modern systems.  An  example being `/media`
where  removable  media  is  mounted. Media  traditionally  referred  to
diskettes and  optical discs. Those  are mounted in  `/media/floppy` and
`/media/cdrom`  respectively. On  systems using  udisks, a  D-Bus daemon
that offers storage related services,  removable storage devices such as
USB flash drives  are mounted under `/run/media/$USER`  instead.  On the
topic of storage,  interestingly there isn't a  directory where internal
drives are supposed  to be permanently mounted. It is  common for `/mnt`
subdirectories be  used for this  but that conflicts with  tradition for
`/mnt` itself being  a mount point. Stealing from OS  X which contains a
subdirectory  for each  mounted disk  in `/Volumes`,  keeping with  Unix
tradition of  lower-case abbreviated  names, and refraining  from making
new directories in root, I mount local disks in `/srv/vol`.

The  [stali]  distro,  once  a suckless.org  project,  follows  its  own
[simplified filesystem][stalifs]. Rather moving directories to `/usr` it
loops `/usr` back to root, that is `/usr` on stali is a symlink pointing
to `/`. Also `/sbin` is symlink  to pointing to `/bin`. Finally `/share`
and `/include` are  introduced in root, result of  their peculiar merge.
The entire hierarchy  is then the following sans the  three virtual file
systems (dev, proc, sys).

| /             | Root directory; also root home |
| /bin          | Every executable               |
| /etc          | System configuration           |
| /home         | User directories               |
| /include      | Header files                   |
| /lib          | Static libraries               |
| /mnt          | Mount points                   |
| /sbin -> /bin |                                |
| /share        | Architecture-independent data  |
| /sucks        | Anything else                  |
| /usr -> /     |                                |
| /var          | Variable data                  |

Obviously  `/media` is  removed  and instead  everything  is mounted  as
subdirectory  in `/mnt`.   Something worth  noticing is  the absense  of
`/boot` directory. The kernel as an executable resides in `/bin`.  Also,
as stali  follows a  static link  philosophy `/lib`  can be  ommited and
`/usr` is  only for  compatibility.  It  can be  ommited if  software is
compiled with prefix the root.

## /home

A  standard  directory   on  desktop  systems  but  may   not  exist  in
servers. Because its importance  for desktops, efforts for standardizing
its  layout have  also  taken  place. The  convention  which is  adhered
nowadays is the [XDG Base Directories specification][xdgspec].

The   directories  are   configurable   using   the  `$XDG_*_HOME`   and
`$XDG_*_DIR`  variables. The  former have  to be  configured during  the
session initialization whereas the later  (sans the runtime one which is
with the previous)  are configured in `$XDG_CONFIG_HOME/user-dirs.dirs`.
The file  specifies the current  set of user  directories, and it  is in
shell format.

The former are alongside their defaults

| `$XDG_CONFIG_HOME` | `$HOME/.config`      | User configuration files              |
| `$XDG_CACHE_HOME`  | `$HOME/.cache`       | User non-essential data files         |
| `$XDG_DATA_HOME`   | `$HOME/.local/share` | User data files                       |
| `$XDG_RUNTIME_DIR` | `/run/user/$UID`     | User non-essential runtime data files |

The  three  dot directories  were  created  to  fix the  dotfiles  mess.
Specifically,    traditionally    user   applications    stored    their
configuration,  cache, and  data on  a dot  directory (name  starts with
`.`--dot--which means  they're hidden by  default) in `$HOME`.   Now the
files are  split in those three  directories making it simple  to backup
configuration  and user  introduced data  files alone  without the  data
files automatically generated by the program and aren't of importance.

Though XDG directories are supported by many programs there're also many
still  using  the  traditional  model.   Some  may  optionally  use  XDG
directories by using one or  more environmental variables. [See the Arch
wiki][archxdg] for  a list of  programs supporting, not  supporting, and
supporting XDG  by the  use of  environmental variables  alongside those
variables.

The later are alongside their defaults (relative to `$HOME`)

| `$XDG_DESKTOP_DIR`   | ./Desktop   |
| `$XDG_DOCUMENT_DIR`  | ./Documents |
| `$XDG_DOWNLOAD_DIR`  | ./Downloads |
| `$XDG_MUSIC_DIR`     | ./Music     |
| `$XDG_PICTURES_DIR`  | ./Pictures  |
| `$XDG_TEMPLATES_DIR` | ./Templates |
| `$XDG_VIDEOS_DIR`    | ./Videos    |

Those folders are the usual default on desktop systems. Personally since
I'm doing mainly programming-related work  that isn't very useful to me.
My  home hierarchy,  taking inspiration  from  root and  `/usr`, is  the
following.

| ~/bin | Executable files         |
| ~/doc | Documents                |
| ~/etc | User configuration files |
| ~/opt | Software packages        |
| ~/src | Sources                  |
| ~/srv | Mostly static files      |
| ~/tmp | User temporary workspace |
| ~/var | Mostly variable files    |

The `~/var` has (paths relative to it)

| ./backups | Old files; basically hoarding directory      |
| ./tmp     | User persistent temporary files              |
| ./trash   | Symlink to freedesktop Trash/files directory |
| ./urbit   | [Urbit] piers ie ship (instances) states     |

And `~/srv` has (paths relative to it)

| ./music     | XDG directory           |
| ./pictures  | XDG directory           |
| ./public    | XDG directory           |
| ./share     | Network shareable files |
| ./seed      | Seeded torrents         |
| ./templates | XDG directory           |
| ./videos    | XDG directory           |
| ./www       | Local sites             |

The XDG directories  can be set in this format  using the following dirs
file.  To  disable a  directory, it  can be pointed  to `$HOME`.   In my
configuration the desktop directory is disabled.

```
XDG_DESKTOP_DIR="$HOME"
XDG_DOCUMENTS_DIR="$HOME/doc"
XDG_DOWNLOAD_DIR="$HOME/var/tmp"
XDG_MUSIC_DIR="$HOME/srv/music"
XDG_PICTURES_DIR="$HOME/srv/pictures"
XDG_PUBLICSHARE_DIR="$HOME/srv/public"
XDG_TEMPLATES_DIR="$HOME/srv/templates"
XDG_VIDEOS_DIR="$HOME/srv/videos"
```

The  `~/etc`  holds  my  "curated"   dotfiles,  the  ones  I've  version
controlled,  which I  then  symlink  to their  location  in `$HOME`  and
`~/.config`. Though  [few tools][dottools] exist for  this, configurable
for  every conceivable  purpose which  makes  it easier  using the  same
dotfiles across hosts,  I just have `~/etc` mirror  the actual hierarchy
without  dot  prefix   and  then  use  a  simple  script   to  make  the
links. Meaning that it takes the following stucture and how files out of
it are symlinked to the files in it. (Relative to `~/etc`.)

| ./config/\<file\> | ~/.config/\<file\> -> ~/etc/config/\<file\> |
| ./config/\<dir\>  | similar                                     |
| ./\<file\>        | ~/.\<file\> -> ~/etc/\<file\>               |
| ./\<dir\>         | similar                                     |

Nix  can  also be  used  for  the  purpose  of dotfiles  management  and
deployment. That said  I've used that system for time  before I moved to
NixOS and never went around switching my home configuration to Nix.  For
anyone interested, it is simple  using `home-manager`, as it is possible
to do

```
home.file.".<file>".source = ~/etc/<file>;
home.file."./config/<file>".source = ~/etc/config/<file>;
```

>TODO: Make post on dotfiles maintenance

The `~/tmp`  is actually  a symlink to  `~/var/tmp`.  Ideally  it should
mounted in `tmpfs`,  and be volatile similarly to  root. Unfortunately I
tend to  hoard stuff.  Also `~/var/trash`  isn't really good idea  as it
can mess up tools working with the Trash directory.

>TODO: Export a virtual file system for Trash

The root home directory though recommended to be left as `/root`, it may
be determined by preference.  In order  to simplify top hierarchy a bit,
I'm  moving  it  to  `/home/root`.   This  can  be  done  modifying  the
/etc/passwd file. NixOS users may use the following configuration.

```
...
  users = {
    users.root = {
      home = pkgs.lib.mkForce "/home/root";
    };
  };
...
```

Concluding,  though standardization  attempts have  happened, filesystem
hierarchy  remains a  mess.   There're some  proposed alternatives  that
perform more drastic  changes.  NixOS and its  inspired-from Guix System
are of  them.  GoboLinux  actually was  made for  this very  purpose; of
[redefining  the filesystem  hierarchy][gobolinux].   Home directory  is
still all over the place since many programs do not adhere to XDG.

[posix]: https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap10.html
[fhs]: https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.txt
[vfs]: https://opensource.com/article/19/3/virtual-filesystems-linux
[rob]: http://lists.busybox.net/pipermail/busybox/2010-December/074114.html
[usrmergefd]: https://www.freedesktop.org/wiki/Software/systemd/TheCaseForTheUsrMerge/
[usrmergefe]: https://fedoraproject.org/wiki/Features/UsrMove
[stateless]: /posts/stateless-linux
[stali]: https://sta.li/
[stalifs]: https://sta.li/filesystem/
[xdgspec]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[archxdg]: https://wiki.archlinux.org/index.php/XDG_Base_Directory#Support
[Urbit]: /posts/urbit-an-alien-system-software
[dottools]: https://wiki.archlinux.org/index.php/Dotfiles#Tools
[gobolinux]: /posts/gobolinix-redefining-filesystem-hierarchy
