interface Product {
	id: string
	business_id: string
	name: string
	stock: number
	price: number
}

type ProductsCart = Pick<Product, 'name' | 'price' | 'id'>

interface Cart extends ProductsCart {
  quantity: number
}

type CartByUserId = {
  [user_id: string]: Cart[]
}