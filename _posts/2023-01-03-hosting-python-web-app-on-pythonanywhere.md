---
title: hosting Python web app on PythonAnywhere
---
[PythonAnywhere] is a simple-to-use (WSGI-based) hoster for Python web apps
that has a free tier. It makes an excellent platform for anyone wanting to
quickly test an app they're making. For, mainly personal but potentially
useful to someone else, reference the steps to upload and run a locally
developed project are the following. Replace `user` with own username and
`mysite` with some other name if want to.

## Upload project

 * Archive the project directory. Can use the command `zip -r mysite.zip
   mysite/`. If it is a git repo it can be archived with `git archive
   --format zip --output mysite.zip master`. The later will require
   generating or uploading independently any files not commited such as
   SQLite database files.

 * Upload the archive in the Files tab.

 * Open a bash console on home by the link right of path in the Files
   tab. Preferably in new tab.

 * Extract the archive with `unzip mysite.zip -d mysite` if archive was
   made with `git archive`. Else first extract to temp directory with
   `unzip mysite.zip -d tempdir` and move accordingly. If zip command in
   first step was used do `mv tempdir/mysite mysite`.

This is [one of the options][uploading-a-zip-file] in documentation. The
others will be upload to code share site such as GitHub and saner ones,
available only to paying accounts, sftp and rsync options.

## Set virtual environment

The simplest approach to this will be to upload an archive of the
environment directory similar to what was done for project. Can extract to
`/home/user/venv` and then set this path to the following section.

The more correct approach will be:

 * Export environment configuration with `pip freeze > requirements.txt` in
   project directory.

 * Make a new virtual environment with `mkvirtualenv myvenv`. The
   `mkvirtualenv` is not just a tool but [a project][mkvenv] consisting of a
   collection of handy wrappers to `virtualenv` tool for managing virtual
   environments that PythonAnywhere has preinstalled.

   After creating it, the environment is activated automatically. In case
   it needs to be accessed afterwards the command `workon myvenv` can be
   used.

 * Enter the project directory and install requirements with `pip install -r
   requirements.txt`.

Paying accounts also have the option to run those commands in an [ssh
session][ssh].

## Set app

 * Visit the Web tab and add a new web app from left sidebar. PythonAnywhere
   provides some options but those create a new project and require manual
   intervetion to run a local project. Rather just select the manual option.

 * Edit the source code link in the Code section to the directory containing
   the uploaded code. If previous steps have been followed this will be
   `/home/user/mysite`.

 * Replace the contents in `wsgi.py` file. This is project-dependent and
   default file has instructions to what to edit it to for Django and Flask.

For Flask project, it's required just to import app as application, as
done in `run.py`, but not run it.

```
import sys
path = '/home/user/mysite' # edit
if path not in sys.path:
    sys.path.append(path)

from app import app as application
```

For Django project, it's similar to the automitically generated default
wsgi.py file but fixing path. The `mysiteconfig` value should be changed
to the project config directory (by default same name as project directory).

```
import sys
path = '/home/user/mysite' # edit
if path not in sys.path:
    sys.path.append(path)

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysiteconfig.settings') # edit

application = get_wsgi_application()
```

 * Set virtualenv to `/home/user/.virtualenvs/myvenv`.

 * Add directories containing static files. For Django projects usual ones
   are `/static/` and `/media/` found in `/home/user/mysite/static/` and
   `/home/user/mysite/media/` respectively.

 * Reload project and voila! App should now be running.

Of course here it's assumed that project is otherwise configured correctly.
For example in a Django project someone may have to add
`'user.pythonanywhere.com'` in `settings.py`'s `ALLOWED_HOSTS` list.

*Trivia:* Apparently it was [acquired] few months ago by Anaconda. There's
also an [experimental API][api] that could be used for setting up the
app. Thus a paying account can theoretically upload and run an app purely
from a local terminal.

[PythonAnywhere]: https://www.pythonanywhere.com
[uploading-a-zip-file]: https://help.pythonanywhere.com/pages/UploadingAndDownloadingFiles/#uploading-a-zip-file
[mkvenv]: https://virtualenvwrapper.readthedocs.io/en/latest/
[ssh]: https://help.pythonanywhere.com/pages/SSHAccess/
[acquired]: https://www.anaconda.com/blog/anaconda-acquires-pythonanywhere
[api]: https://help.pythonanywhere.com/pages/API/
