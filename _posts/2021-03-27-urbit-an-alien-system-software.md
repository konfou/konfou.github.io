---
layout: post
title: Urbit, an alien system software
---

I discovered  [Urbit] a decade  ago when  came across its  now forgotten
[bizarre blogpost][moron-urbit] where it was  first presented.  It was a
weird yet intriguing read.  It was years later that searched for what it
had become  and found  that it  was a  functioning project.   More years
later, it still is weird and intriguing.

It is the technical part than I find most interesting. Therefore this is
the one that will mainly be covered in this post.

## About

Urbit (also see [white  paper][paper]) envisions a (Martian) planet-wide
computing infrastructure, designed from  first principles for robustness
and interoperability.   Itself forms the entire  application stack above
the  network  layer.  This  stack  can  run  on anything;  atop  another
operating system, hosted as an overlay, or, in theory even, alone.

The core components in this infrastructure are _frozen_ (see [refinement
post][urbit-frozen]). That  means it is  impossible to upgrade  them any
further.  This  was done by  utilizing _Kelvin versioning_,  a recursive
scheme  where each  component sits  atop components  closer to  absolute
zero.     It    draws    elements   from    Graham's    [hundred    year
language][graham-hundred] and parallels with the _towards limit_ [scheme
used by TeX][tex-future] (tends to $π$) and MetaFont (tends to $e$).

The network  it builds  is URI-like  namespace globally  distributed via
content-centric  networking, forming  a  decentralized digital  identity
system and a single broadcast network.

In Urbit  all data and  code are  distributed via the  global namespace.
For interoperability  a standardized  basis is  required.  The  basis is
Nock, a language to define  higher-level languages.  It is comparable to
lambda calculus but  meant to be foundational system  software. From the
white paper

>Nock is a little like Lisp, if Lisp were only a compiler target and not
>a high-level language.

Basically Nock acts like a  _functional assembly language_.  Above it is
Hoon,  a  self-hosting  language  that  compiles in  Nock  and  used  to
implement the  rest of the stack.   Hoon is a typed  functional language
but it wasn't meant to be abstractional like Lisp and Haskell.

Expressions in  Hoon are  formed with  _runes_, digraphs  (two character
sequence) of ASCII special characters,  rather keywords. This makes Hoon
code look similar to [J], an APL descendant.

Overall,  Urbit  describes a  simple  and  clean architecture  that  can
potentially  replace many  complex system  software. Though  reading the
white paper and  through the documentation gives off  academic vibes, it
actually is not.   It is a software engineering project  and started off
as  Yavin's personal  project in  early  2000s, years  before it  became
public.

To  give an  idea, here's  how  Urbit has  been explained  over time  in
various places[^b].

>[A] static functional namespace
([source][moron-urbit])

>An operating function
([source][github-urbit])

>[A] personal server stack built from scratch
([source][github-urbit])

>[A] new programming and execution environment designed from scratch
([source][urbit-book-0])

>A solid-state interpreter
([source][paper])

>[A] new clean-slate system software stack
([source][paper])

>[A] virtual city of general-purpose personal servers
([source][urbit-overview])

>A clean-slate decentralized software stack
([source][fosdem])

>One way to think about Urbit is as a 100-year computer
([source][urbit-100])

>Your last computer
([source][urbit-last])

>[A] simpler computer, a quieter computer, a more private computer
([source][urbit-last])

>[A] clean-slate OS and network for the 21st century
([source][Urbit])

In  simpler terms,  which  can  be said  to  a  combination of  previous
descriptions, [per the documentation][docs-so]

>Urbit  is  a  clean-slate  software  stack  designed  to  implement  an
>encrypted P2P network of general-purpose personal servers.

After development started, it picked  some custom terminology which made
reading  the documentation  difficult to  parse[^o] and  understand what
each term means and every component does. Adding on that, the site up to
the year  before wasn't much  help.  Fortunately it was  redesigned last
year making things more friendly, though it's still complicated to fully
understand.

## Stack

From before, the stack is comprised of the operating system, the virtual
machine  when  it's  run  atop  another, the  identity  layer,  and  two
languages (a low- and a high-level one).

Nowadays, the  Urbit operating system  and kernel is called  [Arvo]. Its
state is a  pure function, meaning is determined by,  the event-log. For
this reason, it  is referred to as purely functional.   The event-log is
append-only. Arvo is  primarily made to run hosted  therefore it doesn't
do what an _real_ operating system is expected to do (memory management,
I/O, drivers).

It's composed of modules called _vanes_. [Those are][docs-arvo]

| Armes | peer-to-peer networking protocol         |
| Behn  | time                                   |
| Clay  | filesystem and revision-control system |
| Dill  | terminal driver                        |
| Eyre  | HTTP server                            |
| Ford  | build system                           |
| Gail  | userspace supervisor and sandbox       |
| Iris  | HTTP client                            |
| Jael  | identity-related information tracker   |

Clay is a versioning filesystem, but also handles file-change events and
maps  them  between  Arvo  and the  underlying  system.  An  interesting
property is it [being type aware][docs-arvo-clay].

On Unix systems, Arvo runs atop  the virtual machine [Vere], basically a
Nock  runtime environment,  which is  implemented  in C.   It forms  the
intermediate layer between Arvo and  the underlying operating system. In
theory, a  baremetal virtual  machine could  be made  essentially making
Arvo run native.

Finally, the  identity layer is  [Azimunth]. It is  built as a  suite of
smart contrasts on the  Ethereum blockchain. Urbit's constitution wasn't
originally on Ethereum, but  the move [happened][urbit-eth] for security
and other reasons.

Those other reasons basically boil down to convenience.  Ethereum is not
hard coupled  to Urbit and  another method  of consensus [could  be used
instead][urbit-bc]. Azimunth  isn't built  strictly for  Avo and  can be
used as a generalized system for other projects.

There're  limited Azimunth  identities  which gives  them value  (scarce
resource).  Their  number is big  enough though for  that not to  pose a
problem.   Scarcity  is used  alongside  reputation  to fight  malicious
actors.  There's  an hierarchy named after  astronomy terms[^f] (galaxy,
star,  planet), called  points.   In addition  to  them, there're  Urbit
identities  not registered  on Azimunth,  moons and  comets.  Moons  are
meant for  devices owned by  a planet  owner, and comets  are disposable
identities.  Compared  to existing  (common) layers (IPs,  domain names,
user identities), it combines them all into one.

I've few objections  to the identity layer.  Ethereum  just doesn't feel
right when you've designed everything  else independently.  Also the bad
reputation  for  cryptocurrencies  doesn't   help  the  project  either.
Talking about reputation, it  means that philosophical disagreements may
lead to fracture of the network, something often seen in (society itself
and) reputation-based  online communities. From same  communities it has
also been seen that people refrain from talking and behaving freely when
reputation  is at  stake.  Finally,  as mentioned,  scarcity means  that
identities  have  value meaning  joining  Azimunth  by design  won't  be
_free_.

## Comparisons

Urbit according to, its creator,  Yarvin, is a combination of well-known
ideas  that have  never  been  together before.   In  this section  I'll
compare a few projects that I've found to bear similarities.

### Ethereum

There're some parallels between Urbit and Ethereum.  One is both want to
create a decentralized computing platform.  The difference is that Urbit
performs work on one's own computer, whereas Ethereum is used to perform
work on someone else's computer.

Also,  there's  a similarity  in  blockchain  and Arvo  event-log  being
append-only.    Interestingly  Urbit   address  space   [is  a   special
case][urbit-not-bc] of  a consensus  ledger, but  it [lacks  a consensus
engine][urbit-bc] which is why Ethereum ended up being coupled to Urbit.

### Emacs

>Emacs is a great operating system, lacking only a decent editor.

/jk

Emacs is basically Lisp code running atop a Lisp interpreter implemented
in C.   The stack design  is similar.  Arvo  is (compiled to)  Nock code
running atop a  Nock interpreter implemented in C.  Also,  Hoon and Nock
draw elements from Lisp.  Albeit  those languages meant to be comparable
to C  and assembly  respectively.  Similarly  applications can  be built
atop them.

Differences are

 * Emacs isn't operating system but a single-application platform.  That
   is due  to Emacs  lacking parallel threads,  and only  got sequential
   threads few years ago.

 * Emacs  exists only in applications  layer. That is its  networking is
   like in any other common application.

 * They  don't share goals,  no peer-to-peer networking and  no identity
   system. Emacs  is an  extensible text  editor therefore  those aren't
   required.

That said someone  creating a peer-to-peer application on  Emacs isn't a
far strech,  and I won't be  surprised if it exists.  Afterall Emacs has
few clients for various protocols written in pure-ELisp.

### Inferno

[Inferno] is the successor to Plan  9 that similar to its ancestor never
became popular  and remained an  obscure project known  to few. It  is a
distributed operating system that can run hosted or baremetal, utilizing
a virtual machine, and written entirely  in its own language.

Received from its ancestor are 9P,  Venti, and Fossil. 9P is the network
protocol  (and virtual  filesystem), Fossil  is the  filesystem offering
versioning  feautures,  and Venti  is  a  storage system  that  enforces
write-once policy.  Therefore they're similar  to Ames, Clay  and Arvo's
event-log.

In  contrast  to  Urbit,  it   actually  runs  baremetal  (rather  being
theoretical plausible) and has ports to other operating systems (Windows
and even  embedded systems) rather  being coupled to Unix.   No identity
layer exists but instead the common stack is used. 9P isn't peer-to-peer
protocol but  only allows transparently connecting  machines. Also Venti
is only used for data rather permanently store the imperative steps that
lead to its current state. Like before, they don't share goals.

Nevertheless a  peer-to-peer domain and  identity system (such  as Armes
and  Azimunth) may  potentially  be implemented  atop  9P and  therefore
Inferno.  This  will  make  Inferno, an  Urbit  competitor  without  the
clean-slate aspect.

### GNUnet

GNUnet, according [to its official site][gnunet-about]

>[It] is an alternative network stack for building secure, decentralized
>and privacy-preserving distributed applications. Our goal is to replace
>the old insecure Internet protocol stack.

The applications  in the suite  require an underlying  operating system,
meaning it is meant to function  on application layer only.  But it also
defines its own name system based on peer-to-peer networking and its own
decentralized identity  provider.  Philosophically  they share  the same
goal.  That of decentralizing the  internet utilizing a global namespace
for identity.

It is  interesting but, even  though started in 2001,  unpopular project
usually overlooked in disqussions  about the decentralized ecosystem.  A
thought worth  exploring is  whether Urbit  can run  on the  GNUnet name
system, and whether it could be used to provide ownership (identity).

### Nix

Nix is  a functional software  deployment tool.  The important  parts in
this  case, is  that it  implements a  functional programming  language,
which draws elements from Haskell, and a build system.  The similarities
are

 * A  domain-specific language is  made because  it's thought to  be the
   ideal  design in  this case.  Worth  mentioning is  Guix, a  Nix-like
   system, uses Guile, a Scheme (Lisp) dialect, instead.

 * The build result is a pure function of the input recipe, like Arvo is
   a pure function of its event-log.

In genera  Nix fits  nicely with  Urbit.  The  devs probably  thought so
themselves because Urbit  is nowadays using Nix as its  build system for
the Unix side of things. I'm expecting a Hoon-based Nix-lite system will
eventually find its way on Arvo. Or maybe, like Guix, Urbit remade using
an existent general-purpose language.

## Running

Before  proceeding,  as  I've  wrote [in  another  post][hier-home],  in
`$HOME`, I  keep executables  in `~/bin` and  variable data  in `~/var`,
meaning Urbit instances  (ships) are kept in `~/var/urbit`.   Be free to
use whatever directories you like.

The  official site  has  a [good  usage documentation][using],  covering
everything but spread in various page.   The following will be a summary
as I see fit.

In order to connect to the  network, two pieces are required. The system
(stack)  and an  identity. Let's  start  by getting  the system.  Easily
retrievable pre-built  binaries are offered. Meaning  that running Urbit
is as simple as doing

```
wget https://urbit.org/install/linux64/latest -O /tmp/urbit.tgz
tar zxvf /tmp/urbit.tgz --directory ~/bin --strip=1
rm /tmp/urbit.tgz
./urbit
```

Now, let's get  an identity. As mentioned in  previous section, there're
multiple  identities.  To  get  started  you can  create  a _comet_,  an
anonymous _urbit_ (also called _ship_).

```
$ urbit -c comet
...
; ~zod is your neighbor
; ~wanzod is your neighbor
```

This takes  a while, and  the last line  will probably differ.   When is
finished  loading (or  booting),  its console  (called  _dojo_) will  be
shown. The prompt is the following.

```
~firstsyllable_lastsyllable:dojo>
```

**Bug alert:** There's  a bug where lingers in Eyre  state. That is seen
by `http`  appearing right of  `>`. Wait until this  eventually finishes
before proceeding.

Thereafter just `>` will be used and  below will be the result. The ship
is  a persistent  process.   You  can abandon  the  ship (pun  intended,
abandon is not an actual term) with ^D or entering `|exit` into dojo.

In the previous command `comet` is  the name of the directory that hosts
the ship  (instance) state.   This directory  is called  _pier_.  Though
designed to  be portable, moving  it **must** be  done when the  ship is
down.  Also,  as networking  is stateful,  two copies  of the  same ship
cannot run at the same time.

To start the comet again, run

```
$ urbit comet
```

After  starting  it,  rather  using   the  terminal,  a  web  app  named
_Landscape_ can be used instead. Check the line starting `http:` for the
port used.  Then on  the web browser  access `localhost:<port>`.  At the
dojo enter `+code`  and copy-paste the code that appears  in the "Access
Key" field.

You can check connectivity with rest of the network running

```
> |hi ~zod
>=
hi ~zod successful
```

Automatic updates can be enabled running

```
> |ota (sein:title our now our) %kids
>=
kiln: activated OTA from %kids on ~binzod
kiln: downloading OTA update from %kids on ~binzod
```

The status of automatic updates can checked with just

```
> |ota
>=
OTAs enabled from %kids on ~binzod
use |ota %disable or |ota ~sponsor %kids to reset it
```

Filesystem synchronization may be initialized running

```
> |mount %
>=
```

This  creates a  `home` directory  inside  the pier  populated with  few
standard child directories. After  making any modifications, changes may
be synchronized to Clay running

```
> |commit %home
>=
```

This workflow  is exactly  like git  where you  checkout the  repo, make
modifications  and  then commit  those.   The  directory containing  the
"repo" data is `.urb` inside the pier.

In past `%/web` was automatically mounted and served on localhost.  This
made  it  simple  to  statically  publish  a  site  or  run  single-page
apps. Formatting was  done with Udon, a flavored  Markdown dialect. This
functionality was eventually replaced with aforementioned Landscape.

Actually the dojo  isn't just a console (shell) but  a REPL allowing you
to evaluate arbitrary code written in Hoon.

```
> (add 2 2)
4
```

Moreover it isn't the only prompt available in Urbit.  Like an operating
system (such as running `fdisk` in a Unix shell), apps may provide their
own environment.

An essential such app is `:chat-cli`  or just chat.  To enter chat press
^X.  The prompt is the following.

```
~firstsyllable_lastsyllable:chat-cli/
```

<!--
Thereafter just `/` will be used and  below will be the result.

There're [few  groups][thestack-groups] you can  join. In order  to join
one run  the following  _simple_ command replacing  `~bitbet-bolbel` and
`%urbit-community` with those you want to join.

```
/ :group-view &group-view-action [%join [~bitbet-bolbel %urbit-community] ~bitbet-bolbel]
```

Then join a chat in IRC style running

```
/ ;join
```

To check already joined chats

```
/ ;chat
```

You can  switch between chats with  `;~sampel-palnet/chat-name`, and you
can leave a chat with `;leave ~sampel-palnet/chat-name`.
-->

Unfortunately  it  appears  comets  are not  allowed  to  join  channels
anylonger.   Better go  back  to dojo  for now.   This  level isn't  yet
available for your character.

To  go back  to  dojo simply  with  ^X.  You can  see  all commands  and
available tools, alongside an one-line summary running

```
> +help
```

**Bug alert:** There's  an open bug right now where  if you enter `;view
~sampel-palnet/chat-name` in chat  you will forced out  and be prevented
re-entering it.  To fix run the following (taken from the GitHub issue).

```
> |unlink %chat-cli
> |link %chat-cli
```

## Down the rabbit hole

For anyone  interested to learn  more, Neal  Davis taught a  course last
semester  on Urbit  at University  of Illinois,  cleverly named  Martian
Computing.     The    materials    have     a    [public    mirror    on
GitHub][martian-computing].  They are what  lectures notes you'll expect
to  be.   That  is perhaps  the  easiest  way  to  learn in  more  depth
everything discussed here.

After that, or before that if  you feel adventurous, check the [official
documentation][docs].  To  learn Hoon programming  check [Hooniversity].
The  source  code  of  every   Urbit  component  is  available  on  [its
monorepo][github-urbit]. You're warned that  codebase is opaque at first
glance.

Also take  a look at [post  by Erik Newton][urbit-normies] and  [post by
Clark in Popehat][popehat]  for philosophical views and  a commentary on
how Urbit can be used to create a decentralized network. This is an also
important part which I didn't discussed  in this post. For a critique of
this network see [post by  Francis Tseng][tseng-stars]. Similarly to me,
it objects the identity system.

Closing  up,  Urbit is  one  of  the  _cool, cooler,  coolest_  projects
happening.   If   you  pass  over   the  arcane  jargon  used   and  the
cryptocurrency relation  (Ethereum; soft coupled), it  is an interesting
approach to  how computing infrastructure  could be if it  was designed,
rather evolved[^i].

[^o]:
    Reading  the Urbit's  documentation  was (and  is)  like reading  an
    occult grimoire, and [reading Hoon code][source-dojo] like reading a
    incantation.    Maybe  I   should've   called   Urbit  _a   mystical
    computer_. Maybe both are correct and Martians are wizards.

[^f]:
    Initially rather  astronomical terms,  feudalism classes  were used.
    This has  generated, especially  when considering  Yarvin's personal
    political writings, some  bad press. One should  note that _universe
    structure     hierarchy_    captures     perfectly    [decentralized
    networks][garam-distributed].

[^b]:
    The artwork used in the blog posts is amazing.

[^i]:
    On a way, it is what [Ithkuil] is to _natural_ human languages.

[Urbit]: https://urbit.org/
[moron-urbit]: https://moronlab.blogspot.com/2010/01/urbit-functional-programming-from.html
[paper]: http://media.urbit.org/whitepaper.pdf
[urbit-frozen]: https://urbit.org/blog/toward-a-frozen-operating-system/
[graham-hundred]: http://www.paulgraham.com/hundred.html
[tex-future]: https://tug.org/TUGboat/Articles/tb11-4/tb30knut.pdf
[J]: https://www.jsoftware.com/#/
[martian-computing]: https://davis68.github.io/martian-computing/
[urbit-book-0]: https://github.com/cgyarvin/urbit/blob/master/doc/book/0-intro.markdown
[urbit-overview]: https://urbit.org/blog/an-urbit-overview/
[urbit-100]: https://urbit.org/blog/the-100-year-computer/
[urbit-last]: https://urbit.org/blog/your-last-computer/
[docs-so]: https://urbit.org/docs/system-overview/
[Arvo]: https://urbit.org/docs/glossary/arvo/
[Vere]: https://urbit.org/docs/glossary/vere/
[Azimunth]: https://urbit.org/docs/glossary/azimuth/
[docs-arvo]: https://urbit.org/docs/arvo/
[docs-arvo-clay]: https://urbit.org/docs/arvo/clay/architecture/#a-typed-filesystem
[urbit-eth]: https://urbit.org/blog/bootstrapping-urbit-from-ethereum/
[urbit-bc]: https://urbit.org/blog/urbit-and-the-blockchain/
[azimunth-net]: https://azimuth.network/
[urbit-not-bc]: https://urbit.org/blog/why-urbit-probably-does-not-need-a-blockchain/
[Inferno]: /posts/pantheon-of-distributed-operating-systems/#inferno
[gnunet-about]: https://gnunet.org/en/about.html
[hier-home]: /posts/unix-filesystem-hierarchy/#home
[using]: https://urbit.org/using/
[fosdem]: https://archive.fosdem.org/2018/schedule/event/urbit/
[docs]: https://urbit.org/docs/
[Hooniversity]: https://hooniversity.org/
[github-urbit]: https://github.com/urbit/urbit
[urbit-normies]: https://urbit.org/blog/urbit-for-normies/
[popehat]: https://www.popehat.com/2013/12/06/nock-hoon-etc-for-non-vulcans-why-urbit-matters/
[tseng-stars]: http://distributedweb.care/posts/who-owns-the-stars/
[source-dojo]: https://github.com/urbit/urbit/blob/master/pkg/arvo/app/dojo.hoon
[garam-distributed]: https://www.rand.org/pubs/research_memoranda/RM3420.html
[Ithkuil]: http://www.ithkuil.net/
<!-- To check at another time -->
[urbit-objections]: https://urbit.org/blog/common-objections-to-urbit/
[urbit-address-space]: https://urbit.org/blog/the-urbit-address-space/
[urbit-os1]: https://urbit.org/blog/introducing-os1/
[urbit-precepts]: https://urbit.org/blog/precepts-discussion/
[jtobin-nock]: https://jtobin.io/nock
[jtobin-hooney]: https://jtobin.io/basic-hoonery
[jtobin-kelvin]: https://jtobin.io/kelvin-versioning
[subject-intro]: https://subject.network/posts/urbit-introduction/
[subject-drive]: https://subject.network/posts/planetary-drive/
[subject-nginx]: https://subject.network/posts/urbit-nginx-letsencrypt/
[subject-caddy]: https://subject.network/posts/caddyserver-urbit-tls/
[subject-accepting]: https://subject.network/posts/accepting-point/
[subject-about]: https://subject.network/about/
[ulive-names]: https://blog.urbit.live/an-intro-to-urbit-names/
[ulive-hello-world]: https://blog.urbit.live/hello-world-urbit-edition/
[ulive-intro]: https://blog.urbit.live/what-is-urbit-an-introduction/
[ulive-cheatsheet]: https://blog.urbit.live/urbit-operators-cheatsheet/
[Ngnghm]: http://ngnghm.github.io/blog/2016/06/11/chapter-10-houyhnhnms-vs-martians/
[tibru]: https://github.com/tibru/tibru
[pmonk-explains]: https://twitter.com/pcmonk/status/1201298411011629063
[loper-decaying]: http://www.loper-os.org/?p=1390
[jefferson-urbit]: https://jeffersonwhite.com/destroying-progressivism/urbit-creating-a-new-internet/
[krupp-urbit]: https://alexkrupp.typepad.com/sensemaking/2013/12/a-brief-introduction-to-urbit.html
[urbit-martian-computing]: https://web.archive.org/web/20140424223249/http://urbit.org/community/articles/martian-computing/
<!-- Forums -->
[hn20130924]: https://news.ycombinator.com/item?id=6438320
[hn20141008]: https://news.ycombinator.com/item?id=8578151
[hn20150925]: https://news.ycombinator.com/item?id=10278973
[hn20151022]: https://news.ycombinator.com/item?id=10435097
[hn20151104]: https://news.ycombinator.com/item?id=10508935
[hn20160601]: https://news.ycombinator.com/item?id=11817721
[hn20160607]: https://news.ycombinator.com/item?id=11851849
[hn20170207]: https://news.ycombinator.com/item?id=13594025
[hn20170920]: https://news.ycombinator.com/item?id=15299442
[hn20190115]: https://news.ycombinator.com/item?id=18908051
[hn20191030]: https://news.ycombinator.com/item?id=21672481
[reddit-ama]: https://www.reddit.com/r/IAmA/comments/4bxf6f/
[reddit-beta]: https://www.reddit.com/r/programming/comments/4mwld5
