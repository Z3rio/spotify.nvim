# Spotify.nvim

Simple spotify integration for neovim

## Setup

### Lazy.nvim

```lua
{
  "Z3rio/spotify.nvim",

  config = function()
    require("spotify").setup({
      debug = false
    })
  end,

  lazy = false
},
```

note:
this requires the npm package `neovim` to be globally installed