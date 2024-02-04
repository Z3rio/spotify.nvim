# Spotify.nvim

Simple Spotify integration for Neovim

## Note:

This is still a work in progress and everything will not be perfect.

I highly appreciate contributions, so if you have any ideas, go ahead!

## Setup

### Lazy.nvim

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

### NPMJs CLI

Go into `./cli` and run `npm install -g .`

## Usage

### Get current song

```lua
local currentSong = require("spotify").getCurrentSong()
```
