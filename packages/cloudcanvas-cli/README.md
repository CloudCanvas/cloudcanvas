oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cloudcanvas-cli
$ cloudcanvas COMMAND
running command...
$ cloudcanvas (--version)
cloudcanvas-cli/0.0.1 darwin-x64 node-v16.13.2
$ cloudcanvas --help [COMMAND]
USAGE
  $ cloudcanvas COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cloudcanvas help [COMMAND]`](#cloudcanvas-help-command)
* [`cloudcanvas plugins`](#cloudcanvas-plugins)
* [`cloudcanvas plugins:install PLUGIN...`](#cloudcanvas-pluginsinstall-plugin)
* [`cloudcanvas plugins:inspect PLUGIN...`](#cloudcanvas-pluginsinspect-plugin)
* [`cloudcanvas plugins:install PLUGIN...`](#cloudcanvas-pluginsinstall-plugin-1)
* [`cloudcanvas plugins:link PLUGIN`](#cloudcanvas-pluginslink-plugin)
* [`cloudcanvas plugins:uninstall PLUGIN...`](#cloudcanvas-pluginsuninstall-plugin)
* [`cloudcanvas plugins:uninstall PLUGIN...`](#cloudcanvas-pluginsuninstall-plugin-1)
* [`cloudcanvas plugins:uninstall PLUGIN...`](#cloudcanvas-pluginsuninstall-plugin-2)
* [`cloudcanvas plugins update`](#cloudcanvas-plugins-update)
* [`cloudcanvas sketch [FILE]`](#cloudcanvas-sketch-file)

## `cloudcanvas help [COMMAND]`

Display help for cloudcanvas.

```
USAGE
  $ cloudcanvas help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cloudcanvas.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `cloudcanvas plugins`

List installed plugins.

```
USAGE
  $ cloudcanvas plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ cloudcanvas plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.2/src/commands/plugins/index.ts)_

## `cloudcanvas plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ cloudcanvas plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ cloudcanvas plugins add

EXAMPLES
  $ cloudcanvas plugins:install myplugin 

  $ cloudcanvas plugins:install https://github.com/someuser/someplugin

  $ cloudcanvas plugins:install someuser/someplugin
```

## `cloudcanvas plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ cloudcanvas plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ cloudcanvas plugins:inspect myplugin
```

## `cloudcanvas plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ cloudcanvas plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ cloudcanvas plugins add

EXAMPLES
  $ cloudcanvas plugins:install myplugin 

  $ cloudcanvas plugins:install https://github.com/someuser/someplugin

  $ cloudcanvas plugins:install someuser/someplugin
```

## `cloudcanvas plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ cloudcanvas plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ cloudcanvas plugins:link myplugin
```

## `cloudcanvas plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cloudcanvas plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cloudcanvas plugins unlink
  $ cloudcanvas plugins remove
```

## `cloudcanvas plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cloudcanvas plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cloudcanvas plugins unlink
  $ cloudcanvas plugins remove
```

## `cloudcanvas plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cloudcanvas plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cloudcanvas plugins unlink
  $ cloudcanvas plugins remove
```

## `cloudcanvas plugins update`

Update installed plugins.

```
USAGE
  $ cloudcanvas plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `cloudcanvas sketch [FILE]`

describe the command here

```
USAGE
  $ cloudcanvas sketch [FILE] [-n <value>] [-f]

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ cloudcanvas sketch
```

_See code: [dist/commands/sketch.ts](https://github.com/brianfoody/cloucanvs-cli/blob/v0.0.1/dist/commands/sketch.ts)_
<!-- commandsstop -->
