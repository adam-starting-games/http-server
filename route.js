class Route {
  constructor() {
    this._urlPattern = "/";

    this._posts = [];
    this._gets = [];
    this._puts = [];
    this._deletes = [];
  }

  /**
   * @param {string} pattern
   */
  set urlPattern(pattern) {
    this._urlPattern = pattern;
  }

  get posts() {
    return this._posts;
  }

  get gets() {
    return this._posts;
  }

  get puts() {
    return this._posts;
  }

  get deletes() {
    return this._posts;
  }

  _trimEndpointPattern(endpointPattern) {
    if (endpointPattern === "/") {
      return "";
    }

    return endpointPattern;
  }

  post(endpointPattern, handler) {
    this._posts.push([this._trimEndpointPattern(endpointPattern), handler]);
  }

  get(endpointPattern, handler) {
    this._gets.push([this._trimEndpointPattern(endpointPattern), handler]);
  }

  put(endpointPattern, handler) {
    this._puts.push([this._trimEndpointPattern(endpointPattern), handler]);
  }

  delete(endpointPattern, handler) {
    this._deletes.push([this._trimEndpointPattern(endpointPattern), handler]);
  }

  async handle(request, response) {
    const property = `_${request.method.toLowerCase()}s`;

    const [_, handler] =
      this[property].find(([endpointPattern]) => {
        const [_, endpoint] = request.url.match(
          new RegExp(`${this._urlPattern}(.*)`)
        );

        return new RegExp(endpointPattern).test(endpoint);
      }) || [];

    if (!handler) {
      throw { statusCode: 405 };
    }

    await handler(request, response);
  }
}

module.exports = Route;
