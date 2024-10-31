export class CreateCategoryDto {
    private constructor(
        private readonly name: string,
        public readonly available: boolean
    ) {}

    static create(object: { [key: string ]: any }): [string?, CreateCategoryDto?]{

      const { name, available = false } = object
      let availableBolean = available

      if(!name) return ['Missing name']
      if(typeof available !== 'boolean'){
         availableBolean = (available === 'true')
      }



      return [undefined, new CreateCategoryDto(name, availableBolean)]
    }
}
