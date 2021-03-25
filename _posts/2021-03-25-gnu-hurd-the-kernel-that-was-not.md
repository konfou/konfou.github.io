---
layout: post
title: GNU Hurd, the kernel that was not
---

>This covers some ground but not at the level I want.
>Some parts are to be added, expanded, and rewritten.
>Also there're some pages and reports that I haven't read yet.

## Introduction

Back in early  80s, [GNU project started][gnu-initial] with  the goal to
provide  a _free_  Unix-compatible software  system.  The  intent was  a
system with everything needed to write and run C programs.  At the heart
of  an operating  system  lies  the kernel,  the  core that  facilitates
interactions  between hardware  and  software.  For  GNU  in [the  early
years][gnu-bull2],  the plan  was  to use  MIT-developed  TRIX that  its
authors have  decided to distribute for  free.  Soon after the  plan was
changed to the CMU-developed  message-parsing Mach.  Mach was originally
based  on  BSD  kernel  that  was  re-implemented  on  message-pas  sing
concepts.  BSD then  contained AT&T proprietary code and  Mach devs were
working   to  separate   this   code  from   the   kernel.   [A   decade
after][gnu-bull11]  GNU  project  started,   and  with  userland  having
matured, development started on the kernel part.  Its name, Hurd.

Unfortunately  for Hurd,  soon after  Linux  started as  well. Its  more
_boring_ design meant that  it was easier to hack it,  and in short time
its momentum came to far surpass Hurd's. This prompted [GNU to decide to
use Linux][gnu-linux] as  their kernel and concentrate  their efforts to
make userland work reliably on Linux.  As a consequence Hurd development
stagnated.  Nevertheless people continued  to contribute, and eventually
it started working.   This is an important point. **It  works.** It is a
popular misconception that Hurd is vaporware, but it isn't. It may never
be ready for prime-time but it can run and provide a functioning system.

This post  will cover  Mach and Hurd  architecture, status,  and issues.
The goal is  to provide a general overview for  anyone interested as the
the official site  has information spread across the  site.  Depending I
may eventually move some of the more extensive parts to Hurd site.

## Mach

[Mach]  was developed  at Carnegie  Mellon University  between 1985  and
1994, and later by GNU project, which  is why nowadays it is referred to
as GNU Mach. As mentioned in introduction, Mach was originally developed
as a BSD  variant.  By the third and final  version, the kernel provided
only Mach  related facilities  and features  required to  support higher
system layers.  Basically οnly the base upon which operating systems can
be built is provided.

This design is referred to as microkernel, and Mach was among the first.
It brought  forth numerous new  concepts, and it can  be said it  was an
academical success.  Nevertheless,  it isn't state of  the art nowadays,
something covered in later section.

Mach's  goal is  to minimize  abstractions provided  by the  kernel, and
every abstraction  is associated  with a rich  set of  semantics.  Those
abstractions are

| task          | resource allocation             |
| thread        | CPU utilization                 |
| port          | communication channel           |
| message       | data objects                    |
| memory object | internal memory management unit |

The traditional notion of _process_  is not provided. Instead _task_ and
_thread_  are in  its  place. The  thread provides  a  point of  control
whereas the task provides resources  for its containing threads, meaning
a thread  is collection  of resources.  Tasks  can share  resources over
ports if they've sufficient rights.

A port is an  entity that can be seen as  a message queue. Communication
across  ports is  asynchronous. As  a  consequence messages  have to  be
copied inside the kernel and queued there which slows down IPC.

In the end, the microkernel is  just manager that provides resources and
services. The resources provided by the  kernel that can be directly, as
in requests can made, manipulated are

 * threads
 * tasks
 * processors
 * hosts
 * devices and events

This is only a simple overview of Mach kernel based [on its presentation
paper][mach-foundation].  The  user visible architecture  is extensively
documented in the [kernel principles book][mach-principles].

## Hurd

In few  words, [GNU Hurd][hurd]  is actually a collection  of components
(servers, libraries, and interfaces) than  run atop the Mach microkernel
and which implements the functionality that a Unix kernel is expected to
have.  Essentially,  Hurd formally  defines the  communication protocols
that servers can use to implement the same interface.

The  following overview  is  based  primarily on  the  [overview by  its
creators][hurd-paper] and [presentation by Marcus Brinkmann][hurd-talk].

This  requirement  for  communication   between  servers  comes  with  a
performance penalty,  an issue common among  microkernel-based operating
systems of the era, and, of course,  extra work to design the strict set
required.  It is the reason why Hurd took decades to be useful.

The  procedure  by  which  the  microkernel is  loaded  and  control  is
transferred to the Hurd servers  is called _bootstrapping_.  The Hurd is
bootstrapped by  loading the microkernel,  the root filesystem,  and the
exec  server.   After Hurd  has  been  booted,  other servers  start  in
parallel.

Files in Hurd are  an extension of the I/O interface,  and every file is
represented by  a port connected  to the  server that manages  the file.
Any  Hurd server  that  provides basic  filesystem  interface is  called
_translator_.

>Translators are an important part of GNU Hurd,
>and a section covering is probably required.

## Advantages

Hurd  has [few  enticing features][hurd-advantages]  (also see  [post by
Arne  Babenhauserheide][draketo]).  Besides  the  philosophical part  of
being  free, something  considered common  nowadays, there're  technical
advantages.

The essential  one is  its modular  structure.  This  modularity differs
from  the one  seen in  Linux  and other  monolithic Unix-like  kernels.
[Those allow][tldp-modules] dynamically loading and unloading components
of the system as required.  These so-called modules are code that can be
dynamically linked in to the kernel at any point.  But these when loaded
are part of  the kernel as any  normal kernel code, and run  in the same
address space.  That is a loaded  module can crash the operating system.
In Hurd  most components  are running  as isolated  user-space processes
each  having  a  different  address  space,  a  design  referred  to  as
_multiserver_.

The  advantage  of the  design  lies  in  its tolerance  against  faulty
processes.  Deferences inside the  servers cannot corrupt data elsewhere
or  even  bring down  the  whole  kernel.   This separation  also  makes
possible to  run new  kernel components  without interfering  with other
users   and,   moreover,   without   requiring   some   special   system
privileges. On  development, having  servers on user-space  means common
libraries (e.g. libc) and source-level debugger (e.g. gdb) can be used.

An example is  making specific programs responsible  for specific nodes.
Translators can be started on  any node without requiring modifying that
node.   Those   are  volatile  and   affect  only  the   user's  private
view. On-demand mounting can be done via a passive translator.

In  topic  of filesystems,  I/O  abstractions  are implemented  allowing
resources be exposed via a URI  syntax.  This is referred to as _network
transparency on  the filesystem_. Also  unions exist allowing  to modify
the private view of a readonly filesystem by writing elsewhere.

Security-wise Hurd  utilizes capabilities. Permissions can  be given and
taken away  from processes  at runtime. This  is done  without requiring
special privileges.

>Also talk on the lightweight virtualization that Arnes talks about.

## Challenges

A  [paper   by  Walfield  and  Brinkmann][hurd-critique],   called  _the
critique_ provides  a critique  in some  of the  decisions made,  and [a
later paper][hurd-proposal],  called _the  proposal_, provides  a design
for a future system.

The shortcomings are

 *  Malicious  filesystems,  which  are not  not  considered  by  legacy
   application; something  reasonable on  systems where  filesystems are
   part of the reliance set.

 *  Dynamically  typed objects,  such  as  directory objects  that  also
   implement a file interface which was the case in early Unix systems.

 * Dot-dot directory requires server help, which introduces complication
   for chrooted processes. A proposed  solution comes by adopting Plan 9
   semantics, where  the one  responsible for  resolving dot-dot  is the
   application.

 * Passive  translators and naming  raises the problem that  a malicious
   user may be able to confuse filesystems.

 * Server allocations even if an object has only read access. A proposed
   solution is  having read-only interfaces  designed such that  they do
   not require server allocations.

 * Lack  of mechanisms  for enforcing  security policies  for particular
   program instances.

>A major roadblock for Hurd is Mach; to mention Mach issues.

## Ports

As Mach  has moved  under the GNU  umbrella (developed  alongside Hurd),
after the  project ended in CMU,  Hurd now as term  frequently refers to
the union  of the microkernel  and the  servers. But those  shouldn't be
confused. The reason for utilizing a microkernel, is that the Hurd layer
can run atop another microkernel.

## Comparisons

Interestingly the last decade feautures  that have existed in Hurd since
the beginning of the new millennium have found their way in Linux. Those
are (by [Arne's post][draketo])

 * Socket-activation  startup, similar to passive  translators.  This is
   provided by systemd  and depends on dbus, therefore can  only be used
   by dbus-aware programs.   In contrast translators can be  used by any
   program that has filesystem access.
 *  Jailed  privilege escalation,  similar  to  capabilities. This  also
   depends on dbus and specialized services.

This shows  that features  can be implemented  through layers  of hacks.
The design may  not be as clean  and the layers on  which those features
are implemented may be wrong, but  for most intents and purposes that is
good enough.   It is that _worse  is better_ philosophy that  made Linux
won and Hurd to never accumulate enough interest.

Also there're [similarities  with Plan 9][hurd-plan9], as  well as major
differences.

 * The filesystem interface is one  of the more celebrated Plan 9 design
   decisions. Hurd  servers can be  attached to the filesystem  tree and
   export  filesystem  interface  as  well.   Though  (almost)  all  are
   attached to  the filesystem tree,  not all export such  a filesystemx
   interface.   Among  them are  those  that  implement the  filesystems
   themselves.

 * Filesystems are decentralized and  clients always talk to the servers
   directly without  making use of  a central virtual  filesystem layer.
   Moreover   the  filesystem   modification  can   be  implemented   as
   translators.

 * Both  can modify the private  local environment. Hurd allows  that to
   happen at a lower level.

A very  similar kernel (multiserver) is  developed since 2001 to  now at
Charles University in Prague, as  part of HelenOS.  There's an extensive
[comparison  on  their  site][helenos-hurd].   In  summary,  it  doesn't
attempt to  have a Unix-like  interface and most components  are written
(as  part  of  student  projects  and theses;  which  means  that  those
components  are also  well-documented) specifically  for HelenOS  rather
being ported  from elsewhere.   It is  primarily single-user  system but
work has gone in adding multi-user support.

Though dropping POSIX  is kinda interesting, overall it  doesn't find me
interested.  Reasons are the lack of by design proper multi-user support
and  the translator  mechanism.  That  said, it  is coming  out as  more
useful.  Especially considering that  single-user systems are probably a
good  fit  to  desktops  and   embedded  systems.   Also  having  active
developers certainly helps.

Finally there's,  what has probably  deprecated Hurd, Minix.   Minix was
created  in 1987  at Vrije  Universiteit Amsterdam  by Andrew  Tanenbaum
whose   group  the   same  era   had  developed   the  microkernel-based
[distributed  operating system  Amoeba][amoeba].  Initially  created for
education purposes and as monolithic  Unix-like system, turned to hybrid
with v2,  but it shifted focus  starting with v3 announced  in 2005.  It
has been redesigned  to a multiserver microkernel with  focus in [highly
reliability][minix3], employing self-healing features.   By adding the X
windowing system  alongside numerous Unix  utility programs a  few years
later  and utilizing  a  modern,  state of  the  art microkernel,  Minix
displaced Hurd in functionality, performance, and stability.

That said, even if Hurd lacks explicit mechanism to recover from failure
in critical components,  passive translators will restart  the next time
those are accessed.

>Research this further; is self-repairing not possible on Hurd?

As before being  a university-connected projects makes it  easier to get
developers.  Supported by funds from research programs, it can full-time
developers ranking to few tens. In contrast to before, Minix is on a way
_Hurd improved_.

There's also [L4Re],  but I think its development has  stagnated. It has
capability-based and real-time features, and  it was(?)  meant to create
or  be  used  in   virtualized  environments  rather  a  general-purpose
operating system.

[gnu-initial]: https://www.gnu.org/gnu/initial-announcement.html
[gnu-bull2]: https://www.gnu.org/bulletins/bull2.txt
[gnu-bull11]: https://www.gnu.org/bulletins/bull11.html#SEC12
[gnu-linux]: https://www.gnu.org/gnu/linux-and-gnu.html
[Mach]: https://www.cs.cmu.edu/afs/cs/project/mach/public/www/mach.html
[mach-concepts]: https://www.gnu.org/software/hurd/microkernel/mach/concepts.html
[mach-foundation]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.91.3964
[unix-as-an-app]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.52.633
[mach-principles]: https://archive.org/details/Mach3KernelPrinciples
[hurd]: https://www.gnu.org/software/hurd/index.html
[hurd-paper]: https://www.gnu.org/software/hurd/hurd-paper.html
[hurd-talk]: https://www.gnu.org/software/hurd/hurd-talk.html
[hurd-advantages]: https://www.gnu.org/software/hurd/advantages.html
[draketo]: http://www.draketo.de/light/english/free-software/some-technical-advantages-of-the-hurd
[tldp-modules]: https://tldp.org/LDP/tlk/modules/modules.html
[hurd-challenges]: https://www.gnu.org/software/hurd/challenges.html
[hurd-translators]: https://www.gnu.org/software/hurd/hurd/documentation/translators.html
[hurd-manual]: https://www.gnu.org/software/hurd/hurd/reference_manual.html
[hurd-critique]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.486.7316
[hurd-proposal]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.103.9670
[hurd-plan9]: https://www.gnu.org/software/hurd/community/weblogs/antrik/plan9-and-the-hurd-major-differences.html
[Viengoos]: https://www.gnu.org/software/hurd/microkernel/viengoos.html
[mignot]: http://kilobug.free.fr/hurd/pres-en/abstract/html/
[helenos-hurd]: http://www.helenos.org/wiki/FAQ#HowisHelenOSdifferentfromGNUHurd
[amoeba]: /posts/pantheon-of-distributed-operating-systems#amoeba
[minix3]: https://research.vu.nl/en/publications/minix-3-a-highly-reliable-self-repairing-operating-system
[L4Re]: https://l4re.org/

<!-- To check at another time -->
[additional-goals-1]: https://lists.defectivebydesign.org/archive/html/l4-hurd/2005-10/msg00651.html
[additional-goals-2]: https://lists.defectivebydesign.org/archive/html/l4-hurd/2005-10/msg00654.html
[lwn-signs]: https://lwn.net/Articles/452296/
[sthibault2011]: https://www.gnu.org/ghm/2011/paris/slides/samuel-thibault-hurd.pdf
[sthibault2013gnu]: https://www.gnu.org/ghm/2013/paris/slides/hurd--thibault--ghm-2013.pdf
[sthibault2013fosdem]: https://archive.fosdem.org/2013/schedule/event/hurd_microkernel/
[sthibault2014]: https://archive.fosdem.org/2014/schedule/event/07_uk_dde_on_hurd/
[sthibault2015deb]: https://people.debian.org/~sthibault/hurd-i386/2015-08-17-debconf.pdf
[sthibault2015fosdem]: https://archive.fosdem.org/2015/schedule/event/hurd/
[sthibault2016]: https://archive.fosdem.org/2016/schedule/event/microkernels_hurd_rump_sound_usb/
[ragkousis2016]: https://archive.fosdem.org/2016/schedule/event/guixhurd/
[winter2017]: https://archive.fosdem.org/2017/schedule/event/microkernel_virtualization_on_hurd/
[sthibault2018]: https://archive.fosdem.org/2018/schedule/event/microkernel_hurd_pci_arbiter/
[sthibault2019]: https://archive.fosdem.org/2019/schedule/event/roadmap_for_the_hurd/
[hurd-microkernel]: https://www.gnu.org/software/hurd/faq/which_microkernel.html
[hurd-mk-porting]: https://www.gnu.org/software/hurd/history/port_to_another_microkernel.html
[hammar-thesis]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.183.2532
[debian]: https://wiki.debian.org/Debian_GNU/Hurd
[debian-install]: https://www.debian.org/ports/hurd/hurd-install
[deficiencies]: https://www.gnu.org/software/hurd/microkernel/mach/deficiencies.html
