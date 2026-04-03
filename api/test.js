export default function handler(req, res) {
  res.status(200).json({ ok: true, env: !!process.env.MONGODB_URI, node: process.version });
}
