import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class CategoryService {
    // DI
    constructor() {}

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
      const categoryExist = await CategoryModel.findOne({ name: createCategoryDto.name })

      if(categoryExist) throw CustomError.badRequest('Category already exists')
      
      try {
         const category = new CategoryModel({
            ...createCategoryDto,
            user: user.id
         })

         await category.save()

         return {
            id: category.id,
            name: category.name,
            available: category.available
         }
         
      } catch (error) {
         throw CustomError.internalServer(`${error}`)
      }
    }

    async getCategories(paginationDto: PaginationDto){
      const { page, limit } = paginationDto
      try {
         const categories = await CategoryModel.find()
            .skip( (page - 1) * limit)
            .limit(limit)

         if(!categories) throw CustomError.badRequest('Categories is empty')
         
         return categories.map((category) => {
            return {
               id: category.id,
               name: category.name,
               available: category.available
            }
         })
         
      } catch (error) {
         throw CustomError.internalServer(`${error}`)
      }
    }
}
