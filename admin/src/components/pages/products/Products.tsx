import AddProductForm from "./ui/addProductForm/AddProductForm"
import ProductsList from "./ui/productsList/ProductsList"

const Products = () => {
  return (
    <div className="flex flex-col gap-4 capitalize">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-3xl text-base-content">Products</h2>
                <p className="font-light text-base-content/60">Manage your product inventory</p>
            </div>
            <div>
               <AddProductForm/>
            </div>
        </div>
        <ProductsList/>
    </div>
  )
}

export default Products