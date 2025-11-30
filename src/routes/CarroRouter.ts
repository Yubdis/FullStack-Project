import { Request, Response, Router } from "express";
import { CarroController } from "../controller/CarroController";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    const unique = `${base}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp/;
  const mimetype = allowed.test(file.mimetype);
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && ext) cb(null, true);
  else cb(new Error("Invalid file type"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export const carroRotas = (controller: CarroController): Router => {
  const router = Router();

  // create: accept multipart with optional 'imagem'
  router.post("/", upload.single("imagem"), async (req: Request, res: Response) => {
    try {
      // pass req to controller so it can access req.file and req.body
      await controller.inserir(req, res);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message ?? "Internal error" });
    }
  });

  router.get("/", controller.listar);
  router.get("/:id", controller.buscarPorId);

  // update: allow replacing image
  router.put("/:id", upload.single("imagem"), async (req: Request, res: Response) => {
    try {
      await controller.atualizar(req, res);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message ?? "Internal error" });
    }
  });

  router.delete("/:id", controller.deletar);

  // optional separate endpoint (can keep for manual uploads)
  router.post("/imagens/upload", upload.single("imagem"), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const publicPath = `/uploads/${req.file.filename}`;
    res.json({ path: publicPath });
  });

  return router;
};
