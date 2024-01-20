#! /usr/bin/env node
import open from "open";
import Koa from "koa";
import Router from "@koa/router";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cfgPath = fileURLToPath(new URL("../data.json", import.meta.url));
const defaultCfgData = { authCode: null };
const args = process.argv.splice(2);

function saveCfg(data) {
  writeFileSync(cfgPath, data);
}

function getRawCfg() {
  if (!existsSync(cfgPath)) {
    saveCfg(JSON.stringify(defaultCfgData));
  }

  const content = readFileSync(cfgPath, { encoding: "utf8", flag: "r" });

  if (content) {
    return content;
  }

  return null;
}

function getParsedCfg() {
  const rawCfg = getRawCfg();

  try {
    return JSON.parse(rawCfg);
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function updateConfigValue(key, value) {
  const cfg = getParsedCfg();
  console.log("save", key, value);

  if (cfg) {
    cfg[key] = value;

    saveCfg(JSON.stringify(cfg));
  }
}

function getAuthCode() {
  const content = getParsedCfg();

  if (content) {
    return content.authCode;
  }
}

function getNewAuthCode() {
  const clientId = args[1];
  const redirectUri = "http://localhost:8888/callback";

  if (clientId && redirectUri) {
    const app = new Koa();
    const router = new Router();

    router.get("", "/callback", (ctx) => {
      const { code } = ctx.request.query;

      if (code && typeof code == "string") {
        updateConfigValue("authCode", code);
        process.exit(0);
      }
    });

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(8888);

    open(
      `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
    );
  }
}

if (args[0]) {
  switch (args[0]) {
    case "auth":
      const authCode = getAuthCode();

      if (authCode) {
      } else {
        getNewAuthCode();
      }

      break;
  }
}
