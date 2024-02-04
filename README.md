# Spotify.nvim

Simple Spotify integration for Neovim

## Note:

This is still a work in progress and everything will not be perfect.

I highly appreciate contributions, so if you have any ideas, go ahead!

## FAQ

- Why is there a NodeJS CLI for this? Why not write it in LUA?
  > I saw this as the easiest way to handle this. Since we need to be able to host a web server for the Spotify callbacks.
  > As well as the fact that we need to open the auth link in the user's browser.
  >
  > This very well **might** be possible with some trickery in Lua. But at the time of writing this, I did not feel like spending a bunch of hours just to set up a WS in NVim Lua.
  > Which at the end of the day most likely would just end up freezing/locking NVim's input whilst running tasks.

## Setup

### Install into NVim

(Example with lazy.nvim as pkg manager)

```lua
{
  "Z3rio/spotify.nvim",

  config = function()
    require("spotify").setup({
      debug = false,
      clientId = "",
      clientSecret = ""
    })
  end,

  lazy = false
},
```

### Install the Node CLI

(This runs the background tasks, such as Spotify auth, etc)

Go into `./cli` and run `npm install -g .`

## Usage

### Get the current song

```lua
local currentSong = require("spotify").getCurrentSong()
```
