require("isomorphic-fetch");
require("jsdom-global")();

// when unhandledRejection happens, do nothing
process.on("unhandledRejection", e => {
  e.preventDefault();
});

jest.mock("react-dom", () => ({
  findDOMNode() {
    return null;
  },
  render() {
    return null;
  }
}));
