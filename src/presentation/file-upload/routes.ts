import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";

export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();
        const service = new FileUploadService()
        const controller = new FileUploadController(service)

        router.use(FileUploadMiddleware.containFiles)

        // api/upload/single/ user | category | product 
        // api/upload/multiple/ user | category | product 
        router.post('/single/:type', controller.uploadFile )
        router.post('/multiple/:type', controller.uploadMultipleFiles )

        return router;
    }
}
