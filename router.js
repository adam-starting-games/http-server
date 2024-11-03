const { existsAsync, readFileAsync } = require("./utils");

class Router {
  constructor({ publicFileDirectory, supportedFileTypes }) {
    this._publicFileDirectory = publicFileDirectory;
    this._supportedFileTypes = supportedFileTypes;

    this._pages = [];
    this._routes = [];
  }

  page(urlPattern, htmlPath) {
    this._pages.push([urlPattern, htmlPath]);
  }

  add(urlPattern, route) {
    route.urlPattern = urlPattern;
    this._routes.push([urlPattern, route]);
  }

  async route(request, response) {
    try {
      if (request.method === "GET" && this._publicFileDirectory) {
        const [_, htmlPath] =
          this._pages.find(([urlPattern]) =>
            new RegExp(urlPattern).test(request.url)
          ) || [];

        const requestedFilePath =
          process.cwd() + this._publicFileDirectory + (htmlPath || request.url);

        const fileExists = await existsAsync(requestedFilePath);
        const [extension] = requestedFilePath.match(/\..+$/) || [];

        if (extension) {
          if (!fileExists) {
            throw { statusCode: 404 };
          }

          const supportedContentType = this._supportedFileTypes[extension];

          if (!supportedContentType) {
            throw { statusCode: 415 };
          }

          const encoding = supportedContentType.startsWith("image")
            ? null
            : "utf-8";

          const data = await readFileAsync(requestedFilePath, encoding);

          response
            .writeHead(200, {
              "Content-Length": Buffer.byteLength(data),
              "Content-Type": supportedContentType,
            })
            .end(data);
          return;
        }
      }

      const [_, route] =
        this._routes.find(([urlPattern]) =>
          new RegExp(urlPattern).test(request.url)
        ) || [];

      if (!route) {
        throw { statusCode: 404 };
      }

      await route.handle(request, response);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      const { message = "" } = error;

      response
        .writeHead(error.statusCode || 500, {
          "Content-Length": Buffer.byteLength(message),
          "Content-Type": "text/plain",
        })
        .end(message);
    }
  }
}

module.exports = Router;
