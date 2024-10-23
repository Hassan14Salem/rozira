import { Category } from "src/app/category/Models/category";

export interface Product {
    id:string,
    productName: string,
    description: string,
    traderPrice: number,
    traderDiscount: number,
    priceAfterTraderDiscount: number,
    customerPrice: number,
    customerDiscount: number,
    priceAfterCustomerDiscount: number,
    quantity: number,
    NewImages:string[],
    images: string[],
    categoryId: string,
    category:Category
}
