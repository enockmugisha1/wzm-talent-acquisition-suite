// This file is replaced during build by esbuild
export default function handler(_req, res) {
  res.status(503).json({ message: "Build in progress" });
}
