---
title: i3 quake terminal
---
Whoever  has played  enough videogames  may have  seen that  few have  a
drop-down console, most prominent example  being Quake.  That console is
instantaneously shown (and hidden) using a single key stroke and dropped
down from  the top  of the  screen.  The in-game  console is  similar to
shells in  Unix-like systems.  Meaning they're  a command-line interface
with  a specific  command  set and  not a  window  that accesses  or/and
modifies the  running code.   There've been a  few Linux  terminals that
mimic the behavior of those  consoles.  Well-known examples are [Guake],
[Tilda], and [Yakuake]

Rather  using such  a specialized  terminal, i3  users can  make use  of
scratchpad  functionality for  a  similar result.   Similar  as in  that
there's no  drop-down animation  that other  options have.   Instead the
terminal appears and disappears in top half of the display.  For binding
that  "drop-down"  terminal  to  grave accent  (similar  to  Quake)  the
following may be added to i3's config.

```
for_window [instance="scratchterm"] \
  move scratchpad; \
  scratchpad show; \
  resize set 80 ppt 40 ppt; \
  move absolute position 283 0

bindsym grave exec --no-startup-id scratchterm
```

Where `scratchterm` is the following script found in `$PATH`.

```
#!/bin/sh
if ! i3-msg -t get_tree | grep -q '"instance":"scratchterm"'; then
  urxvt -name scratchterm &
else
  i3-msg "[instance=\"scratchterm\"] scratchpad show"
fi
```

If no terminal  with scratchterm class name is being  run, it runs urxvt
with specific  name, then i3 moves  it to scratchpad, shows  it, resizes
and moves it to  top of display.  The script may also  be edited to open
another  terminal than  urxvt.  On  subsequent calls  it just  shows the
scratchpad.

Size  and  position should  be  specified  according to  preference  and
display resolution  (mine is  1366x768).  An  interesting thing  here is
that someone can  move the terminal using i3's mod  key and drag-n-drop.
In order  for the  location to  be reset  someone will  have to  run the
resize and move command.  A simpler way is modifying the above script to
include such "reset" functionality.

```
#!/bin/sh
if ! i3-msg -t get_tree | grep -q '"instance":"scratchterm"'; then
  urxvt -name scratchterm &
else
  if [ "$1" == "reset" ]; then
    i3-msg "[instance=\"scratchterm\"]
      resize set 80 ppt 40 ppt,
      move absolute position 283 0"
  else
    i3-msg "[instance=\"scratchterm\"] scratchpad show"
  fi
fi
```

Then someone may run the following command to reset size and location.

```
scratchterm reset
```

This can be also be bound to i3's config, for example to Alt + grave.

```
set $Alt Mod1
bindsym $Alt+grave exec --no-startup-id scratchterm reset
```

Some  more featureful  i3-specific  alternatives will  be  using one  of
[i3-quickterm],  [i3-quake], [i3-quaketerm],  and [i3quake].   The first
three are Python  programs whereas the last is written  in Go.  The last
actually  sets up  the window  and then  i3's scratchpad  show is  used.
Therefore  it  can be  used  in  place  of  calling urxvt  directly  and
`for_window` in i3  config.  For a window manager-independent  way to do
it [tdrop] can help, which also  comes with various other goodies.  As a
downside  it depends  on  few  X tools  (xprop,  xwininfo, xdotool).   A
barebones alternative as in above can be done just using xdotool.

>TODO: Check whether instructions can be adapted for sway

[Guake]: http://guake-project.org/
[Tilda]: https://github.com/lanoxx/tilda
[Yakuake]: https://invent.kde.org/utilities/yakuake
[tdrop]: https://github.com/noctuid/tdrop
[i3-quickterm]: https://github.com/lbonn/i3-quickterm
[i3-quake]: https://github.com/NearHuscarl/i3-quake
[i3-quaketerm]: https://github.com/gawen947/i3-quaketerm
[i3quake]: https://hg.sr.ht/~ser/i3quake
