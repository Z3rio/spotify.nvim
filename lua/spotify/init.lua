local M = {}

---@type SpotifyOption
M.Opts = {
  debug = false,
  clientId = "",
  redirectUri = "http://localhost:8888/callback",
}

M.IsAuthorized = false
M.IsServerStarted = false

---@class SpotifyOption
---@field debug boolean
---@field redirectUri string
---@field clientId string

---@param msg string
M.debugLog = function(msg)
  if M.Opts.debug == true then
    print("SPOTIFY [DEBUG] - " .. msg)
  end
end

---@param options SpotifyOption
M.setup = function(options)
  M.debugLog("called setup")

  M.Opts = vim.tbl_deep_extend("force", M.Opts, options)

  if M.IsServerStarted == false then
    M.StartServer()
  end

  if M.IsAuthorized == false then
    M.authorize()
  end
end

M.OpenBrowserLink = function(link)
  M.debugLog("tried to open link: " .. link)

  if vim.fn.has("mac") == 1 then
    vim.cmd("silent !open " .. link)
  elseif vim.fn.has("unix") == 1 then
    vim.cmd("silent !xdg-open " .. link)
  else
    vim.cmd('silent !start "' .. link .. '"')
  end
end

M.StartServer = function()
  M.IsServerStarted = true
  os.execute("cd " .. vim.fn.stdpath("data") .. "/lazy/Spotify.nvim/server && npm run start")
end

M.authorize = function()
  M.debugLog("tried to authorize")

  -- M.OpenBrowserLink(
  --   "https://accounts.spotify.com/authorize?client_id="
  --   .. M.Opts.clientId
  --   .. "&response_type=code&redirect_uri="
  --   .. M.Opts.redirectUri
  -- )
end

return M
