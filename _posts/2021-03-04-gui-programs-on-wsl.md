---
title: GUI programs on WSL
---
[Windows Subsystem for Linux][wsl-about] or  WSL is the successor to the
Unix  subsystem  present  to  previous  Windows  versions  (except  8.1)
introduced in Windows  10. It was developed by  Microsoft and Canonical,
the corporation behind Ubuntu.

There're   two   architecturally    different   WSL   versions.    [WSL1
is][blog-wsl-overview]  a thin-layer  atop NT  translating Linux  system
calls to Win32. Specifically Linux  programs are run as isolated minimal
processes. It's similar but differs  from the POSIX subsystem present in
initial Windows NT versions. Also  it differs from Cygwin, which creates
a Unix-like environments  on Windows. WSL1 isn't doing  any emulation or
virtualization and directly uses the  host file system and some hardware
parts.

Though conceptually  interesting, it has some  limitations. Specifically
there're incompatibilities  and anything requiring a  real kernel cannot
run. This is  where WSL2 comes in. [WSL2  is][wsl-compver] a lightweight
Hyper-V-based VM running an actual  Linux kernel image. Rather using the
host file  system, it uses an  extendable virtual hard disk  image. This
approach is similar to now unmaintained coLinux.

In this post I'll showcase how Linux  GUI programs can run on Windows by
utilizing  the  WSL starting  from  WSL  installation itself.   There're
various guides around the web but  none is CLI-focused meaning you've to
follow a Windows  workflow of next-next-finish rather  Linux workflow of
running a bunch  of commands and be  done with.  That said,  this is the
same approach widely known (specifically this  post is based on [Win Dev
AppConsult][src-x] for graphics and [x410.dev][src-pa] for sound).

Note that  all Windows  command-lines, on  which the  commands mentioned
will  be   used,  require,  except  if   mentioned  otherwise,  elevated
privileges (being run as administrator).

## Installation

From [Microsoft's  docs][wsl-install] and  [Canonical's page][canonical]
on  WSL, WSL1  can be  enabled  with following  command (run  in cmd  or
PowerShell)

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

WSL2 can be enabled with the following command, after running the previous

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

If  PowerShell is  used, thanks  to  DISM cmdlet  which can  be used  to
perform same functions  with `dism.exe`, for WSL1  the following command
can be run instead

```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -All -NoRestart
```

and, for WSL2 respectively, after running the previous

```
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -All -NoRestart
```

After running  them restart the  system. The restart is  **required** as
some of the  infrastructure can only be loaded during  boot. On previous
commands  if  `NoRestart` argument  is  skipped  you'll be  prompted  to
restart  after the  command  has finished  successfully. After  restart,
install the WSL2 kernel update with the following in PowerShell

```
Invoke-WebRequest -Uri https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi -OutFile wsl_update_x64.msi -UseBasicParsing
msiexec /i wsl_update_x64.msi
Remove-Item wsl_update_x64.msi
```

Then WSL2 can be set as default running

```
wsl --set-default-version 2
```

Linux distros can  be installed on WSL either from  Store or downloading
offline packages or  importing a rootfs.  The links for  the packages of
all  officially   available  distros   can  be  found   on  [Microsoft's
docs][wsl-distros].   For downloading  and  installing  Debian, run  the
following in PowerShell

```
$Url = "https://aka.ms/wsl-debian-gnulinux"
$File = "debian.appx"
Invoke-WebRequest -Uri $Url -OutFile $File -UseBasicParsing
Add-AppxPackage $File
Remove-Item $File
```

To  boot  up on  the  distro  run  either  `$distro` (in  previous  case
`debian`) or `bash`.  After that set up username,  password, update, and
upgrade as in a normal Linux installation.

## Graphics

The  essential  software   is  an  X  server  running   on  the  Windows
environment. My recommendation is the Xorg-based [VcXsrv]. The installer
can be downloaded from the project's  page or installed directly using a
package manager. The  ones having it are the  third-party Chocolatey and
first-party winget. The commands are respectively

```
choco install vcxsrv
```

and

```
winget install vcxsrv
```

Running the  program will  show a  wizard to  configure the  server. The
recommended settings  are "multiple  windows" display,  "display number"
set  to 0,  clipboard enabled,  native  OpenGL, and  for WSL2,  "disable
access control"  is **required**.   The "multiple windows"  allows Linux
graphical programs to  appear side by side with  normal Windows programs
rather be a big window in which the programs run.

For simplicity a shortcut can be made with location set to the following.

```
"C:\Program Files\VcXsrv\vcxsrv.exe" :0 -multiwindow -clipboard -wgl -ac
```

On first  run, allow private  network access  **only**. This will  add a
block rule  for public network access.  If WSL2 is used,  the public TCP
rule has to be changed to allow for WSL subnet.

```
netsh advfirewall firewall set rule name="VcXsrv windows xserver" profile=Public protocol=TCP new action=Allow remoteip=172.16.0.0/12
```

Now, moving on to the Linux shell. Programs can't connect to the running
X server before setting up  the `DISPLAY` environmental variable. Rather
running  the following  commands on  every login  manually, they  can be
added to `~/.bashrc`.

If WSL1 is used, add the following.

```
export DISPLAY=:0
```

If WSL2 is used, add the  following. The reason this is more complicated
is that WSL2 and the Windows host are not in the same network device.

```
export DISPLAY=$(awk '/nameserver/{print $2}' /etc/resolv.conf):0
```

And, if native OpenGL is checked (or `-wgl` argument is used)

```
export LIBGL_ALWAYS_INDIRECT=1
```

Fixing scaling to HDPI displays can be done with

```
disp_scaling=$(wslsys -S -s)
export GDK_SCALE=$disp_scaling
export QT_SCALE_FACTOR=$disp_scaling
```

Test the X forwarding configuration by running `xeyes` installed with

```
$ sudo apt install x11-apps
```

Rather opening the  shell to launch something, a shortcut  can made. For
example  in order  to  run `xeyes`  make a  shortcut  with following  as
location.

```
wsl.exe bash -i -c "xeyes"
```

This  leaves  an  open  command-line window.  Instead  of  shortcut  the
following vbs  file can be made,  where `command_name` should be  set to
whatever program someone wants to open.

```
Set objShell = CreateObject("Wscript.Shell")
Dim sh
Dim command_name
sh = "%comspec% /c wsl.exe bash -i -c "
command_name = "xeyes"
objShell.Run sh & command_name, 0, false
```

An  easier  way is  using  `wslusc`  part  of  [wslu], a  collection  of
utilities for  WSL installable  on Linux  distros running  on it.  Is is
pre-installed in  latest Ubuntu,  but not any  other distro.  From their
project [page on GitHub][wslu-gh], to install it on Debian run

```
sudo apt install wget gnupg2 apt-transport-https
wget -O - https://access.patrickwu.space/wslu/public.asc | \
  sudo apt-key add -
echo "deb https://access.patrickwu.space/wslu/debian buster main" | \
  sudo tee -a /etc/apt/sources.list
sudo apt update
sudo apt install wslu
```

Then a shortcut for `COMMAND` to user's Desktop on host can be made with
the following

```
$ wslusc -g COMMAND
```

where  `-g` is  required for  GUI programs.  After having  it run  once,
making new shortcuts boils down to  making a shortcut with the following
location, replacing `xeyes` with whatever program one wants.

```
wscript.exe C:\Users\user\wslu\runHidden.vbs debian.exe run /usr/share/wslu/wslusc-helper.sh "xeyes"
```

## Sound

Similarly  to   graphics,  traditional  GNU/Linux  environments   use  a
client-server model for audio as well in the form of PulseAudio.  An old
PulseAudio  version   can  either  be  downloaded   from  [freedesktop's
PulseAudio page][fd-pa] using (non-admin) PowerShell

```
$Site = "https://bosmans.ch/pulseaudio"
$Pkg = "pulseaudio-1.1.zip"
Invoke-WebRequest -Uri $Site/$Pkg -OutFile $Pkg -UseBasicParsing
Expand-Archive -LiteralPath $Pkg -DestinationPath C:\pulse
Remove-Item $Pkg
```

or installed with Chocolatey

```
choco install pulseaudio
```

A more recent version can be downloaded from [X2go's site][x2go-pa].

```
$Site = "https://code.x2go.org/releases/binary-win32/3rd-party/pulse"
$Pkg = "pulseaudio-5.0-rev18.zip"
Invoke-WebRequest -Uri $Site/$Pkg -OutFile $Pkg -UseBasicParsing
Expand-Archive -LiteralPath $Pkg -DestinationPath C:\
Remove-Item $Pkg
```

The modifications required are similar  for the two PulseAudio versions.
Only difference  is the  files used.   For the  old version,  append the
following lines to file  `C:\pulse\etc\pulse\default.pa`.  For the newer
version, create a file `config.pa` in the `C:\pulse` directory.

```
load-module module-waveout sink_name=output source_name=input record=0
```

If WSL1 is used, append the following lines as well.

```
load-module module-esound-protocol-tcp auth-ip-acl=127.0.0.1
load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1
```

If WSL2 is used, append the following lines instead.

```
load-module module-esound-protocol-tcp auth-ip-acl=172.16.0.0/12
load-module module-native-protocol-tcp auth-ip-acl=172.16.0.0/12
```

Then  run the  `C:\pulse\bin\pulseaudio.exe` binary  if running  the old
version, or make the following shortcut if running the newer version.

```
C:\pulse\pulseaudio.exe -F C:\pulse\config.pa
```

Similar to  VcXsrv before,  on first run,  allow private  network access
**only**. If  WSL2 is  used, the public  TCP rule has  to be  changed to
allow for WSL subnet.

```
netsh advfirewall firewall set rule name="pulseaudio" profile=Public protocol=TCP new action=Allow remoteip=172.16.0.0/12
```

By default  PulseAudio will exit  in 20s  if no client  connection takes
place. Because that  is probably unwanted behavior the  following can be
appended  to `C:\pulse\etc\pulse\daemon.conf`  if the  first verison  is
used.

```
exit-idle-time = -1
```

Alternatively  the  `--exit-idle-time=-1`  argument  can  be  used  when
running the binary. That applies to both versions. For the newer version
combining with the previous, someone can make a shortcut that runs

```
C:\pulse\pulseaudio.exe -F C:\pulse\config.pa --exit-idle-time=-1
```

Then install PulseAudio on the distro

```
sudo apt install pulseaudio
```

As  already mentioned  PulseAudio works  like Xorg  allowing a  [network
setup][fd-pa-net].  Again  similar to before, an  environmental variable
has to be set.  This can be  added in `~/.bashrc` and sets the host name
of the PulseAudio server.  Alternatively the file `~/.pulse/client.conf`
can  be  modified  setting  `default-server`.  That  will  be  a  static
configuration which won't work for WSL2.

If WSL1 is used, add the following.

```
export PULSE_SERVER=tcp:localhost
```

If WSL2 is used, add the following.

```
export PULSE_SERVER=tcp:$(awk '/nameserver/{print $2}' /etc/resolv.conf)
```

Test the sound configuration by playing a random noise.

```
$ pacat /dev/urandom
```

A better option  for both graphics and sound to  the ones mentioned, are
[using AF_UNIX][vcxsrv-wsl] (Unix domain sockets) rather TCP networking.
Not only har better performance but  is less resource intensive as well.
A [presentation][vcxsrv-wsl-yt] was done by  Martin Wang on his channel.
Unfortunately though process is exactly  similar in Windows side (thanks
to Martin  providing pre-built packages), it  requires patching packages
in Linux side.  Also, WSL2 isn't  supported.  For WSL2 a superior option
for graphics  is using VSOCK (virtual  socket).  This can be  done using
[wsld] and  also solves  some other issues  that the  approach presented
has.  The program  comes in two parts, one installed  in each side.  The
program in Linux side will forward Unix socket over VSOCK to the program
in Windows side which then will forward  it to TCP to which the X server
listens to. Though it isn't  supported, the exactly similar approach can
be  applied  to  PulseAudio.   In  any case  with  WSLG,  a  first-party
Wayland-based native display server on  tracks the graphics part will be
solved. See [presentation][wslg-yt] by Steve Pronovast on XDC 2020.

>TODO: Add AF_UNIX instructions

>TODO: Add wsld instructions

[wsl-about]: https://docs.microsoft.com/en-us/windows/wsl/about
[blog-wsl-overview]: https://docs.microsoft.com/en-us/archive/blogs/wsl/windows-subsystem-for-linux-overview
[wsl-compver]: https://docs.microsoft.com/en-us/windows/wsl/compare-versions
[src-x]: https://techcommunity.microsoft.com/t5/windows-dev-appconsult/running-wsl-gui-apps-on-windows-10/ba-p/1493242
[src-pa]: https://x410.dev/cookbook/wsl/enabling-sound-in-wsl-ubuntu-let-it-sing/
[canonical]: https://ubuntu.com/wsl
[wsl-install]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
[wsl-distros]: https://docs.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions
[VcXsrv]: https://sourceforge.net/projects/vcxsrv/
[wslu]: https://wslutiliti.es/wslu/
[wslu-gh]: https://github.com/wslutilities/wslu
[fd-pa]: https://www.freedesktop.org/wiki/Software/PulseAudio/Ports/Windows/Support/
[x2go-pa]: https://code.x2go.org/releases/binary-win32/3rd-party/pulse/
[fd-pa-net]: https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Network/
[vcxsrv-wsl]: https://github.com/Martin1994/vcxsrv-wsl/wiki/Launch-GUI-applications-in-WSL-with-Unix-Domain-Socket
[vcxsrv-wsl-yt]: https://www.youtube.com/watch?v=xKclDH0MYC8
[wsld]: https://github.com/nbdd0121/wsld
[wslg-yt]: https://www.youtube.com/watch?v=EkNBsBx501Q
