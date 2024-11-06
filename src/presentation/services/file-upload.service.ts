import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from 'fs'
import { Uuid } from "../../config";

export class FileUploadService {
    // DI
    constructor(private readonly uuid = Uuid.v4) {}

    private checkFolder(folderPath: string) {
        if(!fs.existsSync(folderPath)){
         fs.mkdirSync(folderPath)
        }
    }

    public async uploadSingle(file: UploadedFile, folder: string = 'uploads', validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif' ]) {
      try {
         const fileExtension = file.mimetype.split('/').at(1)
         const destination = path.resolve(__dirname, '../../../', folder)
         this.checkFolder(destination)
         const fileName = `${this.uuid()}.${fileExtension}`
         file.mv(`${destination}/${fileName}`)

         return { fileName }
         
      } catch (error) {
         console.log(error)
      }
    }

    public async uploadMultiple(file: UploadedFile, folder: string = 'uploads', validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif' ]) {}
}
