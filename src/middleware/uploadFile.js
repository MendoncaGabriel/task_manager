import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

export default async function uploadFile(req, res){
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.writeHead(500).end("Erro ao fazer upload")
      }
      const data = req.file.buffer.toString("utf-8")
      req.file = data
    })
  }
}
 