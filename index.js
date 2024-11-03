const { createServer } = require("http");

const Router = require("./router");
const Route = require("./route");

class HTTPServer {
  constructor({ publicFileDirectory, supportedFileTypes }) {
    this._router = new Router({ publicFileDirectory, supportedFileTypes });
    this._server = createServer((request, response) =>
      this._router.route(request, response)
    );
  }

  page(urlPattern, htmlPath) {
    this._router.page(urlPattern, htmlPath);
  }

  add(urlPattern, route) {
    this._router.add(urlPattern, route);
  }

  listen(port, hostname = "localhost") {
    this._server.listen(port, hostname, () => {
      console.log(`Server listening at http://${hostname}:${port}`);
    });
  }
}

function createHTTPServer({
  publicFileDirectory = "",
  supportedFileTypes = {},
} = {}) {
  return new HTTPServer({ publicFileDirectory, supportedFileTypes });
}

module.exports = { createHTTPServer, Route };
