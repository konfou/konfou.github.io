---
layout: post
title: Android TV as HTPC
---
The  dumb TVs  have  slowly given  up their  place  to so-called  [smart
TVs][smart_tv], not much  different of how dumb  phones were (relatively
quickly rather) slowly replaced by  smartphones. Basically a smart TV is
a  traditional  TV  with  integrated  features  once  found  in  set-top
boxes.  Though   initially  every  manufacturer  was   using  their  own
proprietary  firmware,   Android,  the  dominant  (by   installed  base)
operating system in smartphones, has, also,  taken its place on most new
smart TVs.

[Android TV][android_tv] refers to the Android builds running on set-top
boxes, plug-in sticks,  and TVs but can simply refer  to the TVs running
it.  It actually  is a  successor to  [Google TV][google_tv],  a similar
platform but not  that tied to Android. Interestingly  the first devices
running  Google  TV  were   x86-based  making  them  basically  personal
computers hidden in  plain sight. Later devices and every  Android TV is
ARM-based  making them  more like  big  Android tablets  with TV  remote
control rather touch input and TV tuner.

[Home-theater  PC][htpc] or  HTPC  refers to  a  personal computer  with
software for  media playback and  recording that integrated with  a home
entertainment  system.  Those  computers  basically  run  a  specialized
application, called media center software,  on top of a common operating
system (Windows or Linux). The software basically made the device usable
with a  remote controller  providing a convenient  interface as  the one
smart  TVs  have. In  the  past  they're predominantly  traditional  x86
computers but  nowadays ARM  is common thanks  to the  popularization of
low-cost    low-consumption   ARM    computers   such    as   [Raspberry
Pi][rpi]. Videogame consoles were also  commonly used for this position,
at least  my PS3 did  for a long time  (thanks to Movian  and multiMAN's
NTFS support for external HDD).

## Wireless adb

The  [Android   Debug  Bridge][adb]   or  `adb`   is  a   tool  allowing
communication with an Android device.  Among the variety actions allowed
it can be used to exchange files, app installation and Unix shell access
on the  device. It  normally works over  wired connection  something not
convenient with a TV, but can also be used over Wi-Fi.

NixOS   users   can  enable   it   adding   the  following   in   system
configuration.  This  also installs  and  the  required udev  rules  for
smartphones. Not that important in our case.

```
  programs.adb.enable = true;
  users.users.user.extraGroups = [ ] ++ "adbusers"
```

To  enable it  on TV,  you've to  open Settings  > Device  Preferences >
About. Scroll down to 'Build', then click  it a bunch of times until the
message "You are a developer" appears.  Now go to Settings > Preferences
\> Developer  options >  USB debugging and  enable the  option. Finally,
Setting  > Network  &  Internet >  active connection,  and  note the  IP
address.

The  connection  can   be  done  using  the   following  command,  where
`IP=192.168.1.2`  the IP  found previously.  A prompt  requesting access
will appear on TV.

```
adb connect 192.168.1.2
```

Files can be send with

```
adb push
```

Programs can be installed with

```
adb install /path/to/downloaded/program.apk
```

A Unix shell can be opened with

```
adb shell
```

## Alternative input methods

TV  remote controllers  aren't always  the best  input. Especially  when
having to  write anything such as  in a search box.  Android TVs support
Bluetooth keyboards just fine. Rather getting one an alternative will be
using a smartphone as keyboard or sending input from laptop.

The simplest  solution for the first  is using the official  [Android TV
Remote Control][android-tv-remote] app. It allows three functionalities,
(i) dpad navigation,  (ii) touchpad input, and (iii)  keyboard input. It
can work over Bluetooh  but can also work over Wi-Fi as  long as the two
devices are  in the  same network.  Also some apps  may offer  a [second
screen experience][androdev-aim]  utilizing the  Nearby API.  Those will
prompt  a  user  to  initiate   connection  on  smartphone  and  further
interaction will proceed on smartphone.

The second  comes a bit  unexpected. Android usually run  on smartphones
and therefore people primarily wanted a way to control their PC from the
smartphone rather their smartphone from  PC. Therefore there aren't many
solutions for this.  Text input at least can easily  be send using `adb`
as follows

```
adb shell input text "text to send"
```

It  also has  commands for  sending keyevents  and taps  but isn't  very
user-friendly.  Touch   taps  specifically  require  the   exact  screen
coordinates to be supplied making  it tedious at least. Schedenig Marian
[made a wrapper][schedenig] that doesn't only allow sending the previous
commands   conveniently    but   also    shows   the    display   (kinda
laggy). Basically it's like an Android emulator running but is connected
to a device  over adb. Though made for debugging  a broken smartphone it
applies to this case as well.

Download [from previous page][schedenig-dl], unzip and run the following
command in the unzipped folder.

```
#!/bin/sh
mkdir -p /home/$USER/.cache
cat <<EOF > config.properties
	adbCommand = `which adb`
	screenshotDelay = 100
	localImageFilePath = /home/$USER/.cache/adbcontrol_screenshot.png
	phoneImageFilePath = /mnt/sdcard/adbcontrol_screenshot.png
EOF
```

Then, having a Java runtime installed

```
java -jar adbcontrol.jar
```

## File manager

Like smartphones or/and  tablets the pre-installed file  manager is very
barebones. There're a few good file managers. Unfortunately none of them
is   free   as  in   freedom.   The   one   I'll  recommend   is   [File
Commander][fileman]. It is freeware  (ad-supported), feature-rich, has a
traditional interface  making it braindead  simple to use,  and supports
FTP  and SMB.  More  interestingly it  integrates another  functionality
usually provided  by another app  which has  no good contenders  for the
place. That functionality is file  transfer by allowing access to device
files  and upload  through a  web browser.  Another option  is [FX  File
Explorer][fx] which  has a  more modern interface  but all  its advanced
features and networking functionality requires payment.

As both apps  are on store, their file sharing  capabilities can be used
to send  apks and install  them on device  rather using the  `adb` shown
previously.

## Web browser

There're uses for  a web browser even  on an HTPC, such  as checking the
router panel or various media-related sites. During the move from Google
TV  to Android  TV, Chrome  got  removed from  the default  installation
leaving  Android TV  without a  web  browser. Basically  the Play  Store
doesn't   have  any   of   the  popular   Android   browsers  found   in
smartphones. Instead  it only a  has handful ones  specifically designed
for Android TV. I found none of them good and had issues with all that I
tried. Also, none of them is free (as in freedom).

Both Chromium  and Firefox can be  sideloaded onto an Android  TV device
but  none of  them has  a  suitable interface.  Nevertheless there's  an
official [Firefox for Fire TV][firefox-tv] version. Fire TV is an Amazon
brand which functions identical to Android TV, and [Fire OS][fire-os] is
basically Android-based and for time being Android compatible. Therefore
Firefox for Fire TV can run fine on Android TVs.

Someone  has   to  download   the  (latest   available)  apk   from  the
[releases][firefox-tv-releases] page  and then  install it  either using
`apk` or sending it on TV by other means (see previous section).

## Media player

The most basic functionality a HTPC requires is media playback. Again, a
pre-installed media player is usually  available but is very simple. One
of the most popular media players on computers, [VLC], is also available
for Android with a [TV-suitable interface][vlc-android-tv] available. It
can be  installed from  the [Store][vlc-store]  or downloaded  from [the
official site][vlc-releases] and installed using  `apk` or sending it on
TV and  installing it  there. VLC allows  adding and  reading (S)FTP(S),
SMB, and NFS locations.

Though I  used VLC  for long time,  some years after  moving on  Linux I
started  using  [mpv][mpv],   a  CLI-first  keyboard-driven  application
lacking a traditional interface. It is  a fork of (short lived) mplayer2
that in  turn is a fork  of venerable (and still  alive) [MPlayer] which
predates VLC itself. Both mpv (and ancestors) and VLC essentially depend
on ffmpeg.  An unofficial Android  port exists called  [mpv-android]. It
can  be installed  from the  [Store][mpv-android-store] (not  on TV)  or
downloaded  from   [releases][mpv-android-releases]  page.   Unlike  its
computer counterpart it  has a minimal GUI to allow  opening files (only
from internal storage) and editing  some configuration. In order to play
from external storage or  a network location it has to  be opened from a
file managers (which for later it has to be supported from the manager).

## Streaming

Looking for content to  watch on TV is a hassle. What  is the most usual
entertainment is search  film on computer, add it on  queue on a service
with  available app,  then open  app, and  start watching.  Basically TV
interfaces are  difficult to search  content on. That is  how Chromecast
[came to be][chromecast-blog].  It cuts the part where you  need to open
an   app  or   even   requiring   a  device   that   supports  apps   at
all. Specifically it  started as an HDMI toggle which  streams video (or
music) off the internet. Android TVs have Chromecast support built-in. A
Chromium-based  browser  should be  used  on  computer or  Firefox  with
[fx_cast].  On supported  sites an  "cast button"  appears which  can be
clicked to make the  TV stream the video. At that point  the page on the
computer doesn't have to remain open.

Chromecast can also be used to stream a local file from computer. It can
either  be done  using  VLC  (on desktop)  or  the  Videostream [app  on
Chrome][videostream-app].  For VLC,  open  the program  then from  menus
Playback > Renderer  > appropriate Chromecast device,  and finally start
playing  a video  or audio  file.  The file  will begin  playing on  the
TV. The  VLC controls continue  working as  they're for a  file rendered
locally.  To  run Videostream  after  being  installed on  Chromium  the
following  script can  be used  to run  it without  having to  open from
within the browser.

```
#!/bin/sh
chromium --enable-nacl --profile-directory=Default --app-id=cnciopoikihiagdjbjpnocolokfelagl
```

## Media center

Though using a file  manager, a media player, and various  apps is a way
to use  an Android  TV, thanks  to its  interface (basically  the entire
system functions as a media center)  another is the more traditional way
of installing a dedicated media  center software that integrates all the
functionality  in  a  single  program.  Most  popular  one  among  them,
[Kodi].  Kodi is  an open  source home  theater software  that is  media
player designed  to work from small  screens such as phones  to big ones
like TVs. The reason for its popularity is its vast customizability with
skins and  plug-ins allowing access  to streaming services. It  even has
PVR  functionality but  as  there's  no front-end  to  Android TV  Input
Framework  this doesn't  work for  OTA  broadcasting. It  can either  be
downloaded from [Store][kodi-store]  or the [releases][kodi-releases] on
the official site.


## Media sharing

Kodi is nice if storage is mounted  directly on the device or is network
accessible.   The  problem   is  what   to   do  when   none  of   those
happen. Specifically suppose  you've some media files on  the laptop you
want to watch on TV. Till here the  options are, (i) send the file on TV
and  (ii) Chromecast.  The first  is  ridiculous whereas  the second  is
computer-first  approach. If  things are  organized and  searching isn't
required,  the media  center  interface is  kinda  comfy making  casting
unnecessary.

Let's move a bit  further than what a vanilla HTPC is  supposed to do to
what  is usually  expected  to  do. It  shouldn't  be  capable of  media
playback   but   also    allow   access   to   its    media   to   other
devices. Concluding,  we'll require  to set-up a  server on  two devices
which can be complicated. The solution  is a program that functions both
as a server and as a player that makes media sharing seamless.

The first and more popular software  to do this is [Plex], a proprietary
freemium system and nowadays ad-supported  streaming service as well. It
is actually  a media  player with  client-server model  originating from
Kodi  (then  known as  XMBP).  Though  very  polished, my  media  server
software of choice is [Jellyfin]. Jellyfin is a fork of, formerly mostly
open-source with  closed-source components  and now  proprietary, [Emby]
which was  originally made as  a own-content-only Plex  alternative with
plug-in     support.     Jellyfin     can     be     downloaded     from
[Store][jellyfin-tv-store] or the [releases][jellyfin-tv-releases].

## Issues

In  contrast  to what  this  post's  title is,  this  is  in no  case  a
replacement for  a standalone HTPC.  There're many issues  arising. From
Android's  architecture that  limits the  software  that runs  on it  to
Android   TV   firmware   itself   being  broken   usually   thanks   to
manufacturers. One  that is  made obvious  in this  post is  the limited
availability of  relevant software. This was  to be expected since  as I
mentioned in  the beginning Android TVs  can be regarded as  big tablets
meaning it comes with all idiosyncrasies a tablet has... and more.

Another is framebuffer being limited  to resolution (1080p) smaller than
TV's native  resolution (4K). Meaning  the UI  is rendered at  1080p and
then gets upscaled  to 4K.  That means  apps are locked to  running to a
lower  resolution. Utilizing  a specific  API it  is possible  to render
video to  the 4K  output directly. Unfortunately  all apps  mentioned in
this post don't and only a handful do such as YouTube and Netflix.

Others are codec issues. ARM installed  on TVs aren't M1-level beasts by
any  margin,  meaning  that  videos  with  codecs  not  having  hardware
acceleration  will be  hard  to run  if run  at  all. Also  high-quality
configurations  for mpv  on desktop  will've  difficulty to  run in  any
case. On topic of  quality, lack of x86 and Windows  also means no madVR
possibility.

Beyond any  issues, a smart TV  and stand-alone NAS is  simpler, cheaper
and more than enough  for most users than building a  HTPC. And with the
move to streaming rather using local content the NAS is also unneeded.

[smart_tv]: https://en.wikipedia.org/wiki/Smart_TV
[android_tv]: https://en.wikipedia.org/wiki/Android_TV
[google_tv]: https://en.wikipedia.org/wiki/Google_TV_(smart_TV_platform)
[htpc]: https://en.wikipedia.org/wiki/Home_theater_PC
[rpi]: https://www.raspberrypi.org/
[adb]: https://developer.android.com/studio/command-line/adb
[android-tv-remote]: https://play.google.com/store/apps/details?id=com.google.android.tv.remote
[androdev-aim]: https://android-developers.googleblog.com/2018/08/alternative-input-methods-for-android-tv.html
[schedenig]: https://marian.schedenig.name/2014/07/03/remote-control-your-android-phone-through-adb/#post-581:~:text=ADB%20Control,-I
[schedenig-dl]: https://marian.schedenig.name/2014/07/03/remote-control-your-android-phone-through-adb/#post-581:~:text=Download,-ADB
[fileman]: https://play.google.com/store/apps/details?id=com.mobisystems.fileman
[fx]: https://play.google.com/store/apps/details?id=nextapp.fx
[fire-os]: https://developer.amazon.com/docs/fire-tv/fire-os-overview.html
[firefox-tv]: https://github.com/mozilla-mobile/firefox-tv
[firefox-tv-releases]: https://github.com/mozilla-mobile/firefox-tv/releases
[VLC]: https://www.videolan.org/index.html
[vlc-android-tv]: https://developer.android.com/stories/apps/vlc-android-tv
[vlc-store]: https://play.google.com/store/apps/details?id=org.videolan.vlc
[vlc-releases]: https://www.videolan.org/vlc/download-android.html
[mpv]: https://github.com/mpv-player/mpv
[mpv-android]: https://github.com/mpv-android/mpv-android
[mpv-android-store]: https://play.google.com/store/apps/details?id=is.xyz.mpv
[mpv-android-releases]: https://github.com/mpv-android/mpv-android/releases
[MPlayer]: http://www.mplayerhq.hu/design7/info.html
[chromecast-blog]: https://www.blog.google/products/chromecast/heres-five-years-chromecast/
[fx_cast]: https://hensm.github.io/fx_cast/
[videostream-app]: https://chrome.google.com/webstore/detail/videostream-for-google-ch/cnciopoikihiagdjbjpnocolokfelagl
[Kodi]: https://kodi.tv/
[kodi-store]: https://play.google.com/store/apps/details?id=org.xbmc.kodi
[kodi-releases]: https://mirrors.kodi.tv/releases/android/arm64-v8a/
[Plex]: https://en.wikipedia.org/wiki/Plex_(software)
[Emby]: https://en.wikipedia.org/wiki/Emby
[Jellyfin]: https://jellyfin.org/
[jellyfin-tv-store]: https://play.google.com/store/apps/details?id=org.jellyfin.androidtv
[jellyfin-tv-releases]: https://github.com/jellyfin/jellyfin-androidtv/releases
