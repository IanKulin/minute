import { expect } from "chai";
import sinon from "sinon";
import fs from "fs/promises";
import { getVersion } from "../utilities.js";

function suppressConsoleError() {
  const originalConsoleError = console.error;
  console.error = () => {};
  return () => {
    console.error = originalConsoleError;
  };
}

describe("getVersion - utilities.js", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return the version from package.json", async () => {
    const mockPackageJson = JSON.stringify({ version: "1.2.3" });
    sandbox.stub(fs, "readFile").resolves(mockPackageJson);
    const version = await getVersion();
    expect(version).to.equal("1.2.3");
  });

  it("should return null if package.json is not found", async () => {
    const restoreConsoleError = suppressConsoleError();
    sandbox.stub(fs, "readFile").rejects(new Error("File not found"));
    const version = await getVersion();
    expect(version).to.be.null;
    restoreConsoleError();
  });

  it("should return null if there is an error parsing package.json", async () => {
    const restoreConsoleError = suppressConsoleError();
    const mockPackageJson = "invalid json";
    sandbox.stub(fs, "readFile").resolves(mockPackageJson);
    const version = await getVersion();
    expect(version).to.be.null;
    restoreConsoleError();
  });
});
