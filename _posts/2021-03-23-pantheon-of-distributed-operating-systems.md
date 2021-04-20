---
title: pantheon of distributed operating systems
---

At  the mid-80s  to  early-90s  there was  much  research  going in  the
development of distributed operating systems (see [lecture][ast-dos] and
[paper][ast-rvr-dos] by  Tanenbaum). Those are loosely  characterized by
their purpose  to provide a single  system to a collection  (network) of
workstations that connects  (not necessarily joins) them  and makes them
act like one.  For many  such systems, distributed implies transparency.
Explaining, the system  should blur location of the  resources.  That is
whether a resource is local or remote should be irrelevant.

Though now mostly  lost in history, they still hold  a lasting influence
and interest as those problems  are still relevant.  The most successful
of them,  taking into account academic  publications, commercialization,
and popularity, (and personal opinion)  were Sprite, Amoeba, and Plan 9.
The last one  especially continues to be popular  among those interested
in operating systems.

## Amoeba

[Amoeba]     (see     [intro    paper][amoeba-intro]     and     [status
report][amoeba-status])   was  developed   at  the   Vrije  Universiteit
Amsterdam  by Andrew  Tanenbaum's research  group between  1981 (initial
work; first  proto release  in 1983)  and 1996.   It was  commercial but
freely  available for  academic  usage.  Amoeba  was  intended for  both
distributed and  parallel computing. Though  a mechanism for  doing both
applications  was  provided, the  policy  was  determined by  user-level
programs.

In  order to  achieve performance  over the  network, it  used the  high
performant FLIP, short for Fast  Local Internet Protocol.  This protocol
allowed   for  clean,   simple  and   efficient  communication   between
distributed  nodes.  Machines  that   had  more  one  network  interface
automatically  act as  FLIP  router between  the  network and  therefore
connected various LANs together.

Amoeba was  a system written  from scratch.   Though it had  a Unix-like
interface, the kernel was designed with a microkernel architecture. This
makes  it  among  the  first,  and basically  the  very  few  even  now,
successful (in  that it was  used for day-to-day  computing) microkernel
operating systems. That architecture means that the system has a modular
structure and is a collection  of independent processes. Those processes
can either be application programs,  called _clients_, or _servers_ such
as drivers. The microkernel basic  function is to provide an environment
inside  which client  and servers  communicate.  Its  job is  to support
threads,   remote  procedural   call  (RPC),   memory  management,   and
I/O. Everything else is built atop those primitives.

Some Amoeba-specific software outside the kernel is:

 *  Boot server,  that controls  all global  system servers  outside the
   kernel.

 *  Bullet  file   server  (akin  to  filesystem),   that  stores  files
   contiguously on  disk and caches,  giving it high speed,  whole files
   contiguously in core. A user program needing a file will request that
   Bullet sends  the entire  file in  a single RPC.  As Bullet  uses the
   virtual disk server to perform I/O to disk it's possible to run it as
   a normal user program.

 *  SOAP  directory server,  that  takes  care  of file  management  and
   naming. The  file and  directory server functionality  in traditional
   (monolithic) operating system are part of the kernel.

Also closely  related to Amoeba  (the teams cooperated  intensively) was
[Orca],  a  programming  language developed  specifically  for  parallel
programming.   Orca allows  creation  of user-defined  data types  which
processes on different  machines can share in a controlled  way. This in
effect  simulates  an  object-based  distributed shared  memory  over  a
network.

A typical Amoeba installation will have dedicated terminals, a processor
pool, and specialized servers (file and  directory). Those can be run on
processor pool or  dedicated hardware. It may be seen  that this is just
mainframe (time-sharing) computing, but note that processor pool doesn't
mean a single  computer or that access is granted  for only specifically
requested  taks. Rather  the  processor  pool, that  can  as  well be  a
computer cluster, from user's point of view is part of the system.

Years  since   v5.3  was  released   in  1996,  an   unofficial  revised
distribution called [FSD] was released and was kept in development until
it was frozen in 2002. FSD  includes many kernel extensions and changes,
new hardware  driver-related addition, and improvements  for third-party
software. The system  was used for developer's physical  studies. It can
be downloaded from its [SF project page][fsd-sf].

Ending this  section, [Guido  van Rossum  created][amoeba-python] Python
for this operating system. Amoeba has its own system call interface that
wasn't easily available from shell.  Alongside the lack of exceptions in
shell lead Guide to write  a generally extensible language with ABC-like
syntax, a language  whose implementation Guido had  experience with, and
exceptions inspired from Modula-3.

## Sprite

[Sprite]  was  developed  at  the   University  of  California  by  John
Ousterhout's research  group between 1984  (initial work; 1987  was used
for day-to-day  computing) and  1992. It was  Unix-like but  was written
from scratch.  It was used  as testbed  for research in  various topics,
among them network, log-structured, and striped filesystems.

[At  the   time][sprite-retrospective]  ([updated][sprite-updated])  the
project started there were no good network filesystems and even predated
NFS.    Also,  administration   of   a  network   of  workstations   was
difficult. Its  goal was to  build a  new operating system  designed for
network  support from  the start.   In the  end it  had a  few technical
accomplishments that stand out.

 *   Sprite's   network   filesystem   utilizing   file   caching   (see
   [paper][sprite-fc]) for high performance,  which allowed file sharing
   transparently between workstations. By  implementing I/O using pseudo
   (in   modern   terms,   virtual)   devices   and   filesystems   (see
   [paper][sprite-pfs]),  it allowed  access  to  I/O devices  uniformly
   across the network.

 * Process migration mechanism  (see [paper][sprite-pmm]), which allowed
   processes sharing  (that is  processes could be  moved) transparently
   between workstations. The  mechanism kept track of  idle machines and
   evicted migrated  processes when local resources  were again required
   (when the  workstation user  returned). Ideas from  process migration
   have found their way in virtual machine monitors (hypervisors).

 *  Single-system image,  which means  Sprite appears  and feels  like a
   single system with storage  and processing resources shared uniformly
   among the workstations. Administration was scale invariant.  Adding a
   new  machine   was  not  any   different  than  adding  a   new  user
   account. Sprite also supported different machine architectures in the
   same   cluster    by   utilizing    a   framework    that   separated
   architecture-independent and architecture-specific information.  This
   model  was adapted  for cluster  and grid  computing in  the form  of
   cluster  management systems.   An example  is [MOSIX],  that provides
   single-system image capabilities to Linux.

 * Log-structured filesystem (see [paper][sprite-lsfs]), which was a new
   approach to filesystem  design. This kind of system  treated the disk
   like  a tap.  By having  information written  sequentially it  allows
   better  efficiency   especially  when   reading  and   writing  small
   files. The last  one resulted by having many  large sequential writes
   batched together. Other advantages were fast crash recovery and block
   size  variation per  file.  Among the  most advanced  [log-structured
   filesystem][wiki-lsfs] nowadays are [NOVA], developed at the UoC same
   as  Sprite, and  [F2FS],  developed by  Samsung.  F2FS is  especially
   designed for flash memory-based storage  devices and has been adopted
   by few Android devices.

 *      Zebra    (see   paper   [on   design][zebra-design]    and   [on
   implementation][zebra-implem]),  a   distributed  file   system  that
   increased throughput by striping files across multiple servers giving
   it _scalable  performance_. Zebra  also wrote parity  information for
   each stripe similar to RAID arrays. This could allow system operation
   to continue even in the event  that a server is unavailable giving it
   _high  availability_.   The striping  approach,  in  contrast to  the
   file-based   approach  of   other  stripping   filesystems,  utilized
   techniques  from log-structured  filesystem.  This  simplified parity
   mechanism,  reduced parity  overhead,  and allowed  clients to  batch
   together small writes giving it _high server efficiency_.

A [paper][amoeba-vs-sprite]  written by Douglies,  Ousterhout, Kaashoek,
and  Thnenbaum, compares  Amoeba and  Sprite.  Although  they've similar
goals,   they   diverge   philosophically.   Specifically   on   whether
distributing  computing or  traditional  Unix-style applications  should
emphasized,  and  on  whether  a  combination  of  terminal  and  shared
processors  or  a  workstation-centered  model  (workstations  and  file
servers)  should be  used.  Those  diverged philosophies  result in  the
following differences.

| Amoeba                   | Sprite                         |
| ---                      | ---                            |
| object-based             | shared filesystem-oriented     |
| processor pool           | process migration model        |
| server-only caching      | client-level caching available |
| microkernel              | monolithic                     |
| (hence) shared services  | (hence) services redunancy     |
| user-level IPC mechanism | pseudo-devices and files       |

Microkernel  approaches for  Sprite  were  also explored.   Specifically
[Sprite  kernel was  ported][sprite-mach]  to run  as user-level  server
process on  [Mach microkernel], which  was developed at  Carnagie Mellon
University between 1985 and 1994. The Sprite server was smaller than the
original kernel and it contained almost  no machine specific code.  As a
downside it was  benchmarked at about 1/3 of the  native perfomance.  An
expected issue as bad performance was common to microkernels of the era.

### Sprite's demise

The project ended when the kernel  became hard to maintain for its small
development team.  Another problem  was the inability  to catch  up with
features added  on commercial  UNIX systems of  the era.  Those features
weren't  research oriented  making those  tasks mundane  for a  foremost
research operating system.

The  source  code  is [archived  on  OSPreservProject][ospp-sprite].   A
precompiled  DECstation  image is  also  available  that can  run  using
GXemul.  Downloading  the image and  starting the emulator is  done with
(adapted from [GXemul docs][gxemul-sprite]):

```
wget https://github.com/OSPreservProject/sprite/raw/master/ds5000.bt
gxemul -X -e 3max -M128 -d ds5000.bt -j vmsprite -o ''
```

At the first boot up the following network settings should be entered.

```
Your machine's Ethernet address:    10:20:30:00:00:10
Your machine's IP:                  10.0.0.1
Subnet mask:                        0xff000000
Gateway's Ethernet address:         60:50:40:30:20:10
Gateway's IP:                       10.0.0.254
```

Note that the bootable Sprite image  is merely a demonstration, rather a
robust  system.  It  misses floating  point and  network support.   Once
logged in someone can run `xinit` to start the X11 environment.

Ending  this section,  John Ousterhout  also created  the Tcl  scripting
language  and  the  Tk widget  toolkit  [alongside][pptcl-preface]  this
operating system.

## Plan 9

[Plan  9   from  Bell  Labs][plan9]  (see   [intro  paper][plan9-paper])
originated  at  Bell Labs  developed  by  the  fathers of  Unix  between
late-80s (first public  release in 1992) and 2002.  It  has been refered
to  as _what  Unix should  have been_.  Initially commercial  but freely
available for academic use, after  its demise it became source-available
(license  [didn't qualify  as  open source][gnu-plan9],  let alone  free
software) and few years ago was re-licensed under GPLv2.

Everything   starts   out   with   9P,   a   lightweight   network-level
transport-independent  protocol  that   enables  transparent  access  to
resources  independent  of  their   location.   All  the  resources  are
represented  as   files  within  an  hierarchical   filesystem.   Having
resources named  and accessed like  files in an  hierarchical filesystem
implies the _everything is a file_ upon which Unix was designed is taken
to extreme.  On top, a naming  system is built that lets processes build
customized views  of the  network resources.  Therefore,  Plan 9  lets a
process  build a  private environment  rather doing  all computing  on a
single   workstation.   This   model  of   per-process  namespaces   and
filesystem-like resources is then extended throughout the system.

An  example where  this  is applied,  is  rio (and  8½  before it),  its
windowing system, that is implemented as  a file server.  Each window is
created in  a separate  namespace. Thanks  to its  9P interface,  rio is
network transparent even without including any network-aware code.  This
is in contrast  to X server that specifically includes  such code.  Also
in contrast to X server, a remote  rio application sees its files in the
usual location  and therefore  doesn't know whether  it runs  locally or
remotely.

It  should be  noted that  X  used in  previous systems  bears an  extra
complexity  not  required  as, even  without  its  network-capabilities,
windows can be run over the  network thanks to the distributed nature of
those systems.

In a way it combines the  approach of the previous two systems.  Similar
to Sprite, it  is a monolithic system and  utilizes virtual filesystems,
whereas similar to Amoeba, considers that computers can handle different
tasks and the importance of  parallel computing. Expanding on the later,
A  typical  Plan  9  installation will  have  dedicated  terminals,  CPU
servers, and file servers. The  CPU server differs from Amoeba processor
pool.   Plan 9,  rather making  use of  many processors,  it uses  a few
multiprocessors. This is  also the reason a  process migration mechanism
isn't provided. Note that a computer can be set up for any task. Someone
can even have all tasks handled in the same system.

Historically, used  in first and  second edition, Alef was  developed, a
concurrent programming  language with  C-like syntax and  semantics.  It
holds heritage from Newsqueak,  another language developed previously at
Bell Labs.   Similar to it,  Alef had a CSP  (channel-based) concurrency
style. In order to maintain one less language, it was abandoned in favor
of  thread   library  for   C.   Plan   9  favoring   [concurrency  over
parallelism][waza-talk]  relates to  the  philosophical difference  with
Amoeba (see paragraph on Orca) on how processors should be handled.

In contrast  to Amoeba  and Sprite that  were specifically  designed for
local-area  networks, [Plan  9  considers][plan9-net]  the existence  of
wide-area  networks  and  _grids_  could   exist  even  over  low  speed
connections  (internet). It  is  assumed that  a  high speed  connection
exists between CPU and file servers  though it isn't a hard requirement.
The environment can be configured to be as distributed or centralized as
required by its usage.

The latest  version can be downloaded  from the [mirror of  the official
site][plan9-download].  Virtual  disk images  can be found  in [9legacy]
site. This site also offers numerous  patches that can be applied to the
latest  Plan  9  release.   Another  option  is  [9front],  an  actively
developed fork.  Also  checkout [Plan B][planb], a set  of user programs
that run on top of Plan 9.

### Inferno

Plan   9    was   to   be    succeeded   by   [Inferno]    (see   [intro
paper][inferno-paper]). Also started  by Bell Labs, it  is now developed
and maintained  by Vita  Nuova.  Inferno  is based on  Plan 9  ideas but
takes a more radical approach, as seen by the following new aspects.

 *   [Limbo], a  new garbage-collected  concurrent language  with C-like
   syntax. It can  be considered a director successor to  Alef. The very
   popular nowadays Go contains ideas found in Limbo.

 * Dis, a virtual machine designed for portability and JIT.

 * Runs on hardware standalone  or hosted. Explainining, Inferno can run
   as a user application on top of an existing operating system.

This  design  (a  virtual  machine)  that  offers  the  ability  to  run
Limbo-written software  atop another  system bears similarity  to Java's
initial  goal to  _write once  run  anywhere_. Though  the systems  have
similar goals, the implementation differs.

### Plan 9 in Cyberspace

Both  Plan 9  and Inferno  had  their development  stopped because  they
brought no  financial gains  enough to  justify continued  investment in
Bell Labs part. Today, and basically this article was written because of
it, Bell Labs (now  owned by Nokia) [announced][plan9-announcement] that
is transferring  copyright to  [Plan 9 Foundation][p9f]  incorporated by
the Plan 9 creators allowing development  to carry on.  Along with this,
all Plan 9 releases were relicensed under MIT.

Concluding this section, it should be noted that Plan 9 is known for far
more than its distributed model,  and posts covering those other aspects
should eventually follow.

[ast-dos]: https://cds.cern.ch/record/400319/files/p101.pdf
[ast-rvr-dos]: https://research.vu.nl/en/publications/distributed-operating-systems
<!-- Amoeba resources -->
[Amoeba]: https://www.cs.vu.nl/pub/amoeba/
[amoeba-intro]: https://www.cs.vu.nl/pub/amoeba/Intro.pdf
[amoeba-90s]: https://www.cs.vu.nl/~ast/Publications/Papers/computer-1990.pdf
[amoeba-experiences]: https://www.cs.vu.nl/~ast/Publications/Papers/cacm-1990.pdf
[amoeba-status]: https://www.cs.vu.nl/~ast/Publications/Papers/compcom-1991.pdf
[amoeba-lecture]: https://cds.cern.ch/record/400320/files/p109.pdf
[Orca]: https://research.vu.nl/en/publications/orca-a-language-for-parallel-programming-of-distributed-systems
[FSD]: http://fsd-amoeba.sourceforge.net/start.html
[fsd-sf]: https://sourceforge.net/projects/fsd-amoeba/files/
[amoeba-python]: https://docs.python.org/3/faq/general.html#why-was-python-created-in-the-first-place
<!-- Sprite resources -->
[Sprite]: https://www2.eecs.berkeley.edu/Research/Projects/CS/sprite/sprite.html
[sprite-paper]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1987/6229.html
[sprite-retrospective]: https://www2.eecs.berkeley.edu/Research/Projects/CS/sprite/retrospective.html
[sprite-updated]: https://web.stanford.edu/~ouster/cgi-bin/spriteRetrospective.php
[sprite-fc]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1987/5993.html
[sprite-pfs]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1989/6165.html
[sprite-pmm]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1990/6382.html
[MOSIX]: http://www.mosix.org/index.html
[sprite-lsfs]: https://people.eecs.berkeley.edu/~brewer/cs262/LFS.pdf
[wiki-lsfs]: https://en.wikipedia.org/wiki/List_of_log-structured_file_systems
[NOVA]: https://github.com/NVSL/linux-nova
[F2FS]: https://f2fs.wiki.kernel.org/
[zebra-design]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1992/6138.html
[zebra-implem]: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1993/6277.html
[ospp-sprite]: https://github.com/OSPreservProject/sprite
[gxemul-sprite]: http://gavare.se/gxemul/gxemul-stable/doc/guestoses.html#sprite
[amoeba-vs-sprite]: https://research.vu.nl/en/publications/a-comparison-of-two-distributed-systems-amoeba-and-sprite
[sprite-mach]: https://www.usenix.org/conference/usenix-mach-iii-symposium/sprite-mach
[Mach]: /posts/gnu-hurd-the-kernel-that-was-not/#mach
[pptcl-preface]: http://www.beedub.com/book/3rd/preface.pdf
<!-- Plan 9 resources -->
[plan9]: https://9p.io/plan9/
[plan9-matters]: https://www.usenix.org/system/files/login/articles/546-mirtchovski.pdf
[plan9-paper]: https://9p.io/sys/doc/9.html
[gnu-plan9]: https://www.gnu.org/philosophy/plan-nine.en.html
[waza-talk]: https://blog.golang.org/waza-talk
[plan9-net]: https://9p.io/sys/doc/net/net.html
[plan9-download]: https://9p.io/wiki/plan9/download/index.html
[9legacy]: http://9legacy.org/download.html
[9front]: http://9front.org/
[planb]: https://web.archive.org/web/20201105205650/https://lsub.org/ls/planb.html
[Inferno]: http://www.vitanuova.com/inferno/
[inferno-paper]: http://www.vitanuova.com/inferno/papers/bltj.html
[mjl-inferno]: https://www.ueber.net/who/mjl/inferno/
[Limbo]: http://www.vitanuova.com/inferno/papers/descent.html
[plan9-announcement]: https://www.bell-labs.com/institute/blog/plan-9-bell-labs-cyberspace/
[p9f]: https://p9f.org/
<!-- To check at another time -->
[malte2013]: http://cs.brown.edu/~malte/pub/papers/2013-apsys-dios.pdf
