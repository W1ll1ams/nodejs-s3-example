import express from "express";
import fileupload from "express-fileupload";
import {
  uploadFile,
  getFiles,
  getFile,
  downloadFile,
  getFileURL,
} from "./s3.js";

const app = express();

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al Servidor con S3" });
});

app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/files/:filename", async (req, res) => {
  //Op1
  //const result = await getFile(req.params.filename);
  //res.json(result.$metadata);
  //Op2
  const result = await getFileURL(req.params.filename);
  res.json({ url: result });
});

app.get("/downloadfile/:filename", async (req, res) => {
  await downloadFile(req.params.filename);
  res.json({ message: "Archivo descargado" });
});

app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({ result });
});

app.use(express.static("images"));

app.listen(3000);
console.log("Servidor en puerto 3000");
