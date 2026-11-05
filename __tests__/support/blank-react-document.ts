// Vite normally injects this preamble into index.html. In-memory documents
// must install it before importing production TSX modules.
export const blankReactDocument = `<!doctype html><html><head>
<script type="module">
import RefreshRuntime from '/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
</script></head><body>Isolated frontend fixture</body></html>`;
