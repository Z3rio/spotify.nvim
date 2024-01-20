local M = {}

---@type SpotifyOption
M.Opts = {
  debug = false,
  clientId = "",
  redirectUri = "http://localhost:8888/callback",
}

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
  print(M.execCommand("spotifynvimcli auth " .. M.Opts.clientId))
end

---@param options SpotifyOption
M.setup = function(options)
  M.debugLog("called setup")

  M.Opts = vim.tbl_deep_extend("force", M.Opts, options)

  M.auth()
end

return M
