---
title: NixOS without display manager
---
A display manager or login manager is a graphical interface shown at the
end  of boot.   It  presents the  user  with a  login  screen, and  when
credentials are entered it starts a session on an X server.  Examples of
such software can be found in  [Debian], [Arch], and [Gentoo] wiki.  The
default on a NixOS installation is LightDM, a relatively lightweight and
highly customizable  display manager with various  front-ends (greeters)
written  in a  variety  of toolkits  (NixOS defaults  to  the GTK  one).
Though a  good choice, for an  one-user system where user  wants to just
run their session without much else its features are mostly unneeded.

## Disabling the display manager

NixOS allows  decleratively setting various  options, among them  is the
default  session  and  autologin  which are  dependent  on  the  display
manager.  For example if the  user named user (cleverly thought, right?)
wants  to  login  automatically  at   their  i3  session  the  following
configuration may be used.

```
...
  services.xserver = {
      displayManager = {
        defaultSession = "none+i3";
        autoLogin = {
          enable = true;
          user = user;
        };
      };
      windowManager.i3.enable = true;
  };
...
```

In order for  the display manager to be suppressed  the following option
exists.   According   to  the   documentation,  this  enables   a  dummy
pseudo-display   manager.    Basically    it   disables   LightDM,   the
display-manager systemd  service and sets  Xorg's log file to  null (see
<[nixpkgs/.../start.nix][nixpkgs]>).  Most  importantly it  enables  the
xinit and startx (wrapper to xinit) commands at the global environment.

```
...
  services.xserver = {
      displayManager = {
        startx.enable = true;
      };
  };
...
```

Unfortunately it also means losing  autologin functionality and some set
up done  by the display  manager. In  case anyone wonders,  autologin is
useful  when full-disk  encryption is  used.  As a  password is  entered
during the boot the need for a second password just few seconds later is
mostly pointless.

## Autologin

Automatical login  of a  user can  be done  creating a  systemd (system)
service. For this the following  configuration can used, adapted from an
[@caadar's  gist][caadar]. Specifically  a  new target  is created,  the
kernel logging  is suppressed, and  the service  logs in the  user named
user after the multi-user target has been reached.

```
...
  systemd.targets = {
    "autologin-tty1" = {
      requires = [ "multi-user.target" ];
      after = [ "multi-user.target" ];
      unitConfig.AllowIsolate = "yes";
    };
  };

  systemd.services = {
    "autovt@tty1" = {
      enable = true;
      restartIfChanged = false;
      description = "autologin service at tty1";
      after = [ "suppress-kernel-logging.service" ];
      wantedBy = [ "autologin-tty1.target" ];
      serviceConfig = {
        ExecStart =  builtins.concatStringsSep " " ([
          "@${pkgs.utillinux}/sbin/agetty"
          "agetty --login-program ${pkgs.shadow}/bin/login"
          "--autologin user --noclear %I $TERM"
        ]);
        Restart = "always";
        Type = "idle";
      };
    };
    "suppress-kernel-logging" = {
      enable = true;
      restartIfChanged = false;
      description = "suppress kernel logging to the console";
      after = [ "multi-user.target" ];
      wantedBy = [ "autologin-tty1.target" ];
      serviceConfig = {
        ExecStart = "${pkgs.utillinux}/sbin/dmesg -n 1";
        Type = "oneshot";
      };
    };
...
```

The `restartIfChange` is  set to `false` so, if  a `nixos-rebuild` takes
place and the  service has changed, the session  won't absurdly restart.
Nevertheless it will restart if user decides to exit the sesssion.

## Autostarting X

There're two  ways to  autostart X  on console  login. Either  using the
profile, or as a systemd user service. Theoretically the optimal will be
the later since  the profile is for shell  configuration and environment
set up  rather running services. This  is for the service  manager to do
(systemd in NixOS case).  But  it is also substantially more complicated
(see [Pitt's slides][Pitt]) and moreover  requires running a Xorg server
as root (though the session will be run as user). In contrast the former
way is mostly trivial and also runs Xorg as user.

First, we need  to source the `~/.profile`. This isn't  done by default.
Rather  the following  configuration has  to  be added.   This makes  an
`/etc/profile.local`   sourced    by   `/etc/profile`    which   sources
`~/.profile`.

```
...
  environment.etc = {
      "profile.local".text = ''
        # /etc/profile.local: DO NOT EDIT -- this file has been generated automatically.
        if [ -f "$HOME/.profile" ]; then
          . "$HOME/.profile"
        fi
      '';
  };
...
```

The `startx` will run the `~/.xinitrc`  file. Therefore to run i3 adding
the following will be enough.

```
exec i3
```

Then at  the end of `~/.profile`  the following will run  `startx` if no
display has been set and only on logging at tty1. Therefore it won't run
on other consoles or when the shell opens in a terminal.

```
if [ -z "$DISPLAY" ] && [ $TTY == "/dev/tty1" ]; then
  exec startx
fi
```

Someone  may  argue  that  it could  be  added  in  `/etc/profile.local`
directly.  But  in that case  X will  run before any  user configuration
takes place.

## Set-up X

The  display manager  loads  `~/.xprofile` which  is  used to  execute
commands at  the beginning  of the  user session,  and `~/.Xresources`
which sets  parameters for  X applications.  Therefore simply  add the
following before executing the window manager.

```
[ -f ~/.xprofile ] && . ~/.xprofile
[ -f ~/.Xresources ] && xrdb -merge ~/.Xresources
```

A display manager also  loads the `~/.pam_environment`.  The variables
used in it have  to be moved to `~/.profile` before  starting up X. It
should  be noted  that on  NixOS there's  no `/etc/environment`  or or
`/etc/security/pam_env.conf` file, rather environment variables set in
configuration.nix will be added in  `/etc/profile`.  This is the place
where most  of set up takes  place making a display  manager even less
necessary.

Also the  user's dbus  daemon has  to be  set. This  is done  adding the
following to `~/.xinitrc`, taken from [nixos.wiki].

```
if test -z "$DBUS_SESSION_BUS_ADDRESS"; then
  eval $(dbus-launch --exit-with-session --sh-syntax)
fi
systemctl --user import-environment DISPLAY XAUTHORITY

if command -v dbus-update-activation-environment >/dev/null 2>&1; then
  dbus-update-activation-environment DISPLAY XAUTHORITY
fi
```

The wiki  also shows  how to  run X  without installing  it system-wide.
This could be  useful in a multi-user environment or/and  if running Nix
on another  system (non-NixOS).  For  both cases some  modifications are
required.

Finally start the graphical-session target in systemd.

```
systemctl --user start graphical-session.target
```

The  graphical-session  target was  made  for  services that  require  a
graphical session to be running.  As  many services are starting at that
run level, without the previous some of them will never run.

>TODO: Add systemd-based X autostart

>TODO: Add Wayland (sway) instructions

[Debian]: https://wiki.debian.org/DisplayManager
[Arch]: https://wiki.archlinux.org/index.php/display_manager
[Gentoo]: https://wiki.gentoo.org/wiki/Display_manager
[nixpkgs]: https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/x11/display-managers/startx.nix
[caadar]: https://gist.github.com/caadar/7884b1bf16cb1fc2c7cde33d329ae37f
[Pitt]: https://people.debian.org/~mpitt/systemd.conf-2016-graphical-session.pdf
[nixos.wiki]: https://nixos.wiki/wiki/Using_X_without_a_Display_Manager
