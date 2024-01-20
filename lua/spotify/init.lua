local M = {}

---@type SpotifyOption
M.Opts = {
  debug = false,
  clientId = "",
  clientSecret = "",
  redirectUri = "http://localhost:8888/callback",
}

---@class SpotifyOption
---@field debug boolean
---@field redirectUri string
---@field clientId string
---@field clientSecret string

---@param msg string
M.debugLog = function(msg)
  if M.Opts.debug == true then
    print("SPOTIFY [DEBUG] - " .. msg)
  end
end

M.execCommand = function(cmd)
  local handle = io.popen(cmd)

  if handle then
    local result = handle:read("*a")
    handle:close()

    return result
  end

  return nil
end

M.auth = function()
  M.execCommand("spotifynvimcli auth " .. M.Opts.clientId .. " " .. M.Opts.clientSecret)
end

local lastValue = nil
local lastUpdated = nil
M.getCurrentSong = function()
  local currTime = os.clock()
  if lastValue == nil or currTime - lastUpdated > 10 then 
    lastUpdated = currTime
    vim.schedule(function()
      lastValue = M.execCommand("spotifynvimcli getCurrentSong")
    end)
  end

  return lastValue
end

---@param options SpotifyOption
M.setup = function(options)
  M.debugLog("called setup")

  M.Opts = vim.tbl_deep_extend("force", M.Opts, options)

  vim.schedule(M.auth)

  vim.api.nvim_create_user_command("GetCurrentSong", M.getCurrentSong, {})
end

return M
