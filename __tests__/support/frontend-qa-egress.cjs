// Functional-test process guard, not an OS sandbox or security certification.
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS preload loaded via `node --require`. */
const net = require("node:net");
const dns = require("node:dns");
const local = (host) => ["localhost", "127.0.0.1", "::1", "[::1]", "::ffff:127.0.0.1"].includes(String(host).toLowerCase());
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  let options = args[0];
  if (Array.isArray(options)) options = options[0];
  if (options && typeof options === "object") {
    if (options.path) {
      if (!String(options.path).startsWith("\\\\.\\pipe\\")) throw new Error("QA_BLOCKED_NONLOCAL_PIPE");
    } else if (!local(options.host ?? "localhost")) {
      throw new Error("QA_BLOCKED_NODE_EGRESS");
    }
  } else if (typeof options === "number") {
    if (typeof args[1] === "string" && !local(args[1])) throw new Error("QA_BLOCKED_NODE_EGRESS");
  } else if (typeof options === "string") {
    if (!options.startsWith("\\\\.\\pipe\\")) throw new Error("QA_BLOCKED_NONLOCAL_PIPE");
  } else {
    throw new Error("QA_BLOCKED_UNKNOWN_CONNECTION");
  }
  return connect.apply(this, args);
};
const lookup = dns.lookup;
dns.lookup = function (hostname, ...args) {
  if (!local(hostname)) throw new Error("QA_BLOCKED_DNS");
  return lookup.call(this, hostname, ...args);
};
for (const name of ["resolve", "resolve4", "resolve6", "resolveAny", "resolveCaa", "resolveCname", "resolveMx", "resolveNaptr", "resolveNs", "resolvePtr", "resolveSoa", "resolveSrv", "resolveTxt", "reverse"]) {
  dns[name] = () => { throw new Error("QA_BLOCKED_DNS"); };
}
require("node:dgram").createSocket = () => { throw new Error("QA_BLOCKED_UDP"); };
