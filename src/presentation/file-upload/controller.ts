import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
    // DI
    constructor(private readonly fileUploadService: FileUploadService ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server" });
    };

    uploadFile = (req: Request, res: Response) => {
      // const files = req.files
      const { type } = req.params

      const file = req.body.files.at(0)

      this.fileUploadService.uploadSingle(file!, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res))
    };

    uploadMultipleFiles = (req: Request, res: Response) => {
              // const files = req.files
      const { type } = req.params

      const files = req.body.files

      this.fileUploadService.uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res))
    };
}
