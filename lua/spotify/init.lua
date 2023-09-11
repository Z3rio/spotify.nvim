local M = {}

---@type SpotifyOption
M.Opts = {
	debug = false,
}

---@class SpotifyOption
---@field debug boolean

---@param options SpotifyOption
M.setup = function(options)
	M.Opts = vim.tbl_deep_extend("force", M.Opts, options)
end

return M
