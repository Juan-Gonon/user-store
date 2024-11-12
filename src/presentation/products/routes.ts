import { Router } from "express";
import { ProductsController } from "./controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductService } from "../services";

export class ProductsRoutes {
    static get routes(): Router {
      const router = Router()
      const productService = new ProductService()
      const controller = new ProductsController(productService)

      router.get('/', controller.getProducts )
      router.post('/', [ AuthMiddleware.validateJWT ] ,controller.createProduct )

      return router
    }
}
