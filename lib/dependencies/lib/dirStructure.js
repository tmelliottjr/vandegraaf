// this should be refactored to include loadPaths functionality.

module.exports = [
  { name: "public" },
  {
    name: "src",
    children: [
      { name: "assets" },
      { name: "data" },
      { name: "layouts" },
      { name: "templates" }
    ]
  }
];
