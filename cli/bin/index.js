#! /usr/bin/env node
import open from "open";
import Koa from "koa";
import Router from "@koa/router";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import axios from "axios";

const cfgPath = fileURLToPath(new URL("../data.json", import.meta.url));
const defaultCfgData = { authCode: null, authToken: null };
const args = process.argv.splice(2);
const clientId = args[1];
const clientSecret = args[2];
const redirectUri = "http://localhost:8888/callback";

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

async function getAuthToken(code) {
  const resp = await axios.post(
    "https://accounts.spotify.com/api/token",
    {
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(clientId + ":" + clientSecret).toString("base64")
      }
    }
  );

  if (resp.status === 200) {
    return [resp.data.access_token, resp.data.refresh_token];
  } else {
    return null;
  }
}

const getNewAuthCode = (resolve) => {
  if (clientId && clientSecret) {
    const app = new Koa();
    const router = new Router();
    const controller = new AbortController();

    router.get("", "/callback", (ctx) => {
      const { code } = ctx.request.query;

      if (code && typeof code == "string") {
        updateConfigValue("authCode", code);
        controller.abort();
        resolve(code);
      }
    });

    app.use(router.routes()).use(router.allowedMethods());

    app.listen({
      host: "localhost",
      port: 8888,
      signal: controller.signal
    });

    open(
      `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=user-read-currently-playing&response_type=code&redirect_uri=${redirectUri}`
    );
  }
};

if (args[0]) {
  switch (args[0]) {
    case "auth":
      // let authCode = getAuthCode();

      // if (!authCode) {
      const authCode = await new Promise(getNewAuthCode);
      // }

      const [authToken, refreshToken] = await getAuthToken(authCode);

      if (authToken) {
        updateConfigValue("refreshToken", refreshToken);
        updateConfigValue("authToken", authToken);
      }

      break;

    case "getCurrentSong":
      const cfg = getParsedCfg();

      if (cfg) {
        const resp = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: `Bearer ${cfg.authToken}`
            }
          }
        );

        if (resp.status === 200) {
          console.log(
            `${resp.data.item.artists.map((a) => a.name).join(", ")} - ${
              resp.data.item.name
            }`
          );
        }
      }

      break;
  }
}
