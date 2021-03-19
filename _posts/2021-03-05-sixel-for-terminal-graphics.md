---
layout: post
title: sixel for terminal graphics
---
"Six-pixel" or "[sixel]" for short is a graphics format originating from
DEC terminals. It  is an 80s technology that went  under the radar until
it was revived the recent decade.  Its data scheme is an escape sequence
for terminals.   Specifically, a  sixel is  a group of  six pixels  in a
vertical  column that  represent  bitmap data.   The terminal  processes
sixel data  as bits  of information.   Meaning that in  order to  view a
sixel image file in a terminal with sixel support someone should do

```
cat image.six
```

A terminal emulator  with sixel support is the de  facto `xterm`. It has
to  be  run by  setting  the  terminal  identifier  to a  sixel  capable
terminal,    such    as   VT340    which    is    noted   [in    xterm's
documentation][ctlseqs] on sixel graphics.  The  simplest way is using a
command-line argument.

```
xterm -ti vt340
```

Alternatively, add the following to `~/.Xresources`

```
xterm*decTerminalID: vt340
```

When xterm  has been configured to  support sixel graphics, a  number of
other resources  have their  values determined by  `decTerminalID`. This
leads to some limitations that have no reason to exist. Add

```
xterm*numColorRegisters: 256
xterm*sixelScrolling: 1
xterm*sixelScrollsRight: 1
```

and then merge the properties to the resource database with

```
xrdb -merge ~/.Xresources
```

Users running a  Wayland compositor may prefer to use  [foot] instead, a
minimal sixel-capable  Wayland-native terminal emulator. For  macOS, the
well known  [iTerm2] has sixel  support since v3. For  Windows, [Mintty]
and  there is  [an  ongoing effort][msterm#448]  for  adding support  in
Microsoft   Terminal.   The   cross    platform   Alacritty   [is   near
ready][alacritty#910].

Test  it downloading  the "snake"  image in  sixel format  from libsixel
project.

```
wget "https://raw.githubusercontent.com/saitoha/libsixel/master/images/snake.six"
cat snake.six
```

ImageMagick supports converting from and to sixel format. Based on that,
if ImageMagick is installed then the following simple script can be used
to show any image in terminal. The `GEOMETRY` environmental variable and
the `-g`  argument (overrides the  previous) can  be used to  change the
size of shown image.

~/bin/catix
```
#!/usr/bin/env bash
if [[ "$1" == "-g" ]]; then
  GEOMETRY="$2"
  shift 2
fi
for f in "$@"; do
  convert "$f" -geometry ${GEOMETRY:=800x480} sixel:-
done
```

Test  it downloading  the  "snake"  image in  png  format from  libsixel
project.

```
wget "https://raw.githubusercontent.com/saitoha/libsixel/master/images/snake.png"
catix snake.png
```

A similar to this but more advanced, giving some more options, script is
[sixcat].  As it's  a script installation is simple.   Just retrieve it,
make it executable and put it in a `$PATH` directory.  If it's called as
`sixgif`,  it will  play  gif  animations in  the  top  left instead  of
scrolling all the frames as multiple images.

```
wget "https://gist.githubusercontent.com/hackerb9/a96cea91e6122d09a6c97f5eb797d5fa/raw/6a030622bf34c2c3f79244023fabb30d44a68e16/sixcat"
sixcat snake.png
```

By the  developer of the  previous script,  a useful tool  building atop
ImageMagick is [lsix]. Also a script and its installation is the same as
before.

```
wget "https://github.com/hackerb9/lsix/raw/master/lsix"
lsix
```

As its description in project page  says, it's like `ls` but for images.
Running it shows  sixel-based thumbnails in terminal.   When run without
arguments  it shows  thumbnails for  every image  in current  directory.
When specific files are required those can be put as argument.  If a gif
is specified, the frames will be expanded and shown as montage.

Recent  gnuplot versions  [have][gnuplot#647] sixel  support.  Basically
gnuplot right now  has two implementations.  The  older `sixel` terminal
uses  built-in  bitmap  code,  whereas the  newer  `sixelgd`  draws  the
graphics  using gdlib.   [Its advantages  are][gnuplot#742] "truecolor",
truetype fonts, transparency, and anti-aliased lines. For an example run

```
gnuplot -e "set term sixelgd truec; test palette"
```

A number  of Julia packages provide  native sixel support, such  as [GR]
and of  course [Gaston],  a front-end to  gnuplot.  Rather  figuring out
which   do,  the   ImageMagick-based   [SixelTerm]  and   libsixel-based
[TerminalGraphics] can be used.  For example using the former,

```
julia> using Plots, SixelTerm

julia> scatter(rand(100))
```

A  library  for  writing  programs outputting  sixel  graphics  is,  the
mentioned a few times already, [libsixel].  Thanks to libsixel, a number
of utilities now exist making use of this format. Those utilities can be
integrated  to popular  programs such  as w3m  and ranger,  in order  to
provide sixel  graphics support.   Installing it  also gets  someone the
`img2sixel` tool which can be considered  a more advanced version of the
two  previous scripts.   Specifically  `img2sixel` can  decode and  play
real-time gif animations.

```
wget "https://raw.githubusercontent.com/saitoha/libsixel/master/images/seq2gif.gif"
img2sixel seq2gif.gif
```

Beyond  that,  the project  page  has  countless sixel  examples.   Some
interesting ones are video streaming  by using a patched ffmpeg, various
applications by  using a patched  SDL (e.g.  games, QEMU,  and NetSurf),
LaTeX output, and others.

Closing  up,  the kitty  terminal  has  put  forward [its  own  graphics
protocol][kitty-gp].  [According to][kitty#33]  kitty's developer Kovid,
this  protocol is  simpler  and  solves some  inherent  issues in  sixel
scheme.   The most  essential being  that this  protocol isn't  an image
format on its own  but rather a way to display  images.  The approach is
similar to what iTerm2 and Mintty  have been doing alongside their sixel
support,  albeit  with their  own  implementations  instead.  This  also
solves another issue, the [lack  of true color][libsixel#44] (24-bit) in
sixel.  The format [supports][aas-http] RGB  or HLS color (smaller color
space; 16-bit) but terminal implementations  may be limited to number of
color registers.   Sixel being  palette-based means that  for efficiency
that number should be low (up to 256 colors).

[sixel]: https://vt100.net/docs/vt3xx-gp/chapter14.html
[ctlseqs]: https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h2-Sixel-Graphics
[foot]: https://codeberg.org/dnkl/foot/
[iTerm2]: https://gitlab.com/gnachman/iterm2
[Mintty]: https://mintty.github.io/
[msterm#448]: https://github.com/microsoft/terminal/issues/448
[alacritty#910]: https://github.com/alacritty/alacritty/issues/910
[sixcat]: https://gist.github.com/hackerb9/a96cea91e6122d09a6c97f5eb797d5fa
[lsix]: https://github.com/hackerb9/lsix
[gnuplot#647]: https://sourceforge.net/p/gnuplot/patches/647/
[gnuplot#742]: https://sourceforge.net/p/gnuplot/patches/742/
[GR]: https://github.com/jheinen/GR.jl
[Gaston]: https://github.com/mbaz/Gaston.jl
[SixelTerm]: https://github.com/tshort/SixelTerm.jl
[TerminalGraphics]: https://github.com/m-j-w/TerminalGraphics.jl
[libsixel]: https://github.com/saitoha/libsixel
[kitty-gp]: https://sw.kovidgoyal.net/kitty/graphics-protocol.html
[kitty#33]: https://github.com/kovidgoyal/kitty/issues/33
[libsixel#44]: https://github.com/saitoha/libsixel/issues/44
[aas-http]: https://web.archive.org/web/20010222145233/http://www.cs.utk.edu/~shuford/terminal/all_about_sixels.txt
