---
layout: post
title: local Firefox New Tab page
---
A long time ago, that is six years ago (pre-v41), it used to be possible
on   Firefox   to  choose   a   custom   New   Tab  page   editing   the
`browser.newtab.url`  option.  This  was generally  unrestricted and  it
could access remote and local files.   It was eventually removed and now
an extension is  required (if not root or sudo  access is available that
is).  The problem  is that no extension can access  local files, and the
same applies even to home page. Some workarounds are possible. The local
startpage, that is the page to be used as home and as new tab page, will
be located at `~/srv/www/startpage/index.html`  with linked files inside
the same folder.

It should be noted that in  Chromium an extension, such as the excellent
[NewTab  Redirect][NewTab-Redirect],  is enough  and  can  load a  local
startpage with JS support and without any delay.

## Local web server

There're a  few extensions that  allow changing  the new tab  page.  The
recommended  ones are  [New  Tab  Homepage][new-tab-homepage], [New  Tab
Override][new-tab-override],       and       [Custom       New       Tab
Page][custom-new-tab-page].  The  first is  the simplest one  and merely
redirects the  new tab to  the homepage. The  homepage can be  edited at
about:preferences#home, and setting homepage  to custom urls. The second
one  similarly  redirects  to  the  page  selected  in  the  extension's
settings. This can  either be the current  home page, a custom  URL or a
local file  (this will be covered  in the next section).  A problem with
the two previous is  that they don't the leave the  URL bar empty, which
is something the last one does.

In order  to load  the startpage  a local  web server  can be  run.  The
[@willurd's gist][willurd]  contain numerous  one-liners that can  run a
static web  server in a directory.  Based on them the  following scripts
can be used to run a web server to particular directory. The tools shown
are the  most commonly available  in a  Linux box: busybox,  python, and
ruby (well, the first not that much).

```
#!/bin/sh
busybox httpd -p 8000 -f "$1"
```

or

```
#!/bin/sh
python -m http.server 8000 --directory "$1"
```

or

```
#!/bin/sh
ruby -run -ehttpd "$1" -p8000
```

Then the first script may be run with the startpage as argument, and the
later can be run  with the directory this is located  in. Though not the
optimal solution,  it is by far  the simplest one and  works without any
issues.

For  performance and  lower  resource usage  there're  small static  web
servers which may perhaps be a better options.  Examples of such servers
are the ones mentioned in [my comment][comment] in aforementioned gist.

## Inline

The  extension [New  Tab  Override][new-tab-override]  allows loading  a
single local HTML  file into the extension's storage.  This  can then be
used as  content for the  new tab.  The catch  is that any  linked files
(such as images,  stylesheets, and JS files) have to  accessible via web
which gets us to step... two.  That is those extra files can be combined
to single HTML  file containing everything inlined.   The tool [inliner]
can be used for this, which can be installed with

```
npm install -g inliner
```

Then the following script can be used

```
#!/bin/sh
wwwd=~/srv/www/startpage/
inliner $wwwd/index.html > $wwwd/index.inliner.html
```

This combines everything in a single  HTML file which can then be loaded
on the extension. This is the closest to the old functionality.  The two
issues are  (i) no  JS support on  the local page,  and (ii)  a slightly
delay from opening the new tab to displaying the startpage.

## AutoConfig

Firefox  installations  can be  customized  using  a configuration  file
called  [AutoConfig][autoconfig].   This  file resides  on  the  Firefox
installation directory, and can be used  to set and lock preferences. It
is a method  that, as per the Mozilla support,  is used to automatically
change user preferences or prevent  the end user from modifying specific
preferences.  A common example is  distros disabling autoupdate.  Such a
file  can be  used to  set up  a  local new  tab page.   By placing  the
following files, taken from [@cor-el's answer][corel] in Mozilla support
forums, the local startpage will be used.

The first  is basically used to  enable the AutoConfig file.   In recent
versions sandbox  is required to  be disabled  in order to  access local
files.

/usr/lib/firefox/defaults/pref/autoconfig.js

```
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
```

The other  is the actual  configuration file. The configuration  file is
actually a  superset of pref files  such as the one  above. It overrides
the `AboutNewTab.jsm` service with a custom local file.

/usr/lib/firefox/autoconfig.cfg

```
// skip line -- required comment
var { classes:Cc, interfaces:Ci, utils:Cu } = Components;
try {
  Cu.import("resource:///modules/AboutNewTab.jsm");
  AboutNewTab.newTabURL = "file:///home/user/srv/www/startpage/index.html";
} catch (e) {
  Cu.reportError(e);
}
```

The previous has the address bar focused rather than the page itself. If
someone  wishes to  have  the  new page  focused  the  following may  be
appended to  the previous file, taken  from [@Vallode's answer][vallode]
in Mozilla support forums.

```
try {
  Cu.import("resource://gre/modules/Services.jsm");
  Cu.import("resource:///modules/BrowserWindowTracker.jsm");
  Services.obs.addObserver((event) => {
    window = BrowserWindowTracker.getTopWindow();
    window.gBrowser.selectedBrowser.focus();
  }, "browser-open-newtab-start");
} catch (e) {
  Cu.reportError(e);
}
```

<!--
 This used to work sometime in the past.
 Keeping it here for historical reasons.
 Basically a bad way but pretty direct.
-->
<!--
## Modifying omni.ja

The  new  tab  page  is  actually  packed  inside,  among  other  files,
/usr/lib/firefox/[omni.ja][mdnomnija],   colloquially  called   omnijar,
which  is a  jar  file ie  a  zip  with some  changes.   This the  least
configurable option but is the the fastest one. The following script can
be used  to replace the  new tab page directly  in it, by  unpacking it,
copying the files, and then repacking it.

```
#!/usr/bin/env bash
wwwd=~/srv/www/startpage/
omnija=/usr/lib/firefox/browser/omni.ja
tempja=$(mktemp)
exdir=$(mktemp -d)
cp $omnija{,-}
unzip $omnija -d $exdir
cp $wwwd/* $exdir/chrome/browser/content/browser/newtab/
zip -qr9XD -x $tempja $exdir
cp $tempja $omnija
```
-->

>TODO: Add NixOS instructions for last section

[NewTab-Redirect]: https://github.com/jimschubert/NewTab-Redirect
[new-tab-homepage]: https://addons.mozilla.org/en-US/firefox/addon/new-tab-homepage/
[new-tab-override]: https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/
[custom-new-tab-page]: https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page/
[willurd]: https://gist.github.com/willurd/5720255
[comment]: https://gist.github.com/willurd/5720255#gistcomment-2176217
[inliner]: https://github.com/remy/inliner
[autoconfig]: https://support.mozilla.org/en-US/kb/customizing-firefox-using-autoconfig
[corel]: https://support.mozilla.org/en-US/questions/1283835#answer-1303758
[vallode]: https://support.mozilla.org/en-US/questions/1291938#answer-1331299
[mdnomnija]: https://developer.mozilla.org/en-US/docs/Mozilla/About_omni.ja_(formerly_omni.jar)
