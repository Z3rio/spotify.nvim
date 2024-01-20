#! /usr/bin/env node
import open from "open";
import Koa from "koa";
import Router from "@koa/router";

const args = process.argv.splice(2);

if (args[0]) {
  switch (args[0]) {
    case "auth":
      const clientId = args[1];
      const redirectUri = "http://localhost:8888/callback";

      if (clientId && redirectUri) {
        const app = new Koa();
        const router = new Router();

        router.get("", "/callback", (ctx) => {
          const { code } = ctx.request.query;

          if (code && typeof code == "string") {
            console.log(code);
            process.exit(0);
          }
        });

        app.use(router.routes()).use(router.allowedMethods());

        // app.on("listening", () => {

        // });

        app.listen(8888);

        open(
          `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
        );
      }

      break;
  }
}
