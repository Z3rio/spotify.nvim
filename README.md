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
