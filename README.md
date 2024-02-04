# Spotify.nvim

Simple Spotify integration for Neovim

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
