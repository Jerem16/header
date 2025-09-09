/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    options: {
        doNotFollow: { path: "node_modules|\\.next|dist|build|out" },
        exclude:
            "node_modules|\\.next|dist|build|out|__tests__|\\.spec\\.|\\.test\\.",
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"],
        },
        outputType: "json",
    },
};
