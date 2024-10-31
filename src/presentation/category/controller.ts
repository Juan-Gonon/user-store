import { CreateCategoryDto, CustomError } from "../../domain";
import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    //DI
    constructor(private readonly categoryService: CategoryService) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server" });
    };

    createCategory = async (req: Request, res: Response) => {
      const [error, createCategoryDto ] = CreateCategoryDto.create(req.body)

      if(error) res.status(400).json(error)

      this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res) )
    };

    getCategories = async (req: Request, res: Response) => {

      res.json(req.body)
    };
}
