import { db } from "./firebase"
import { collection, getDocs } from "firebase/firestore"

export interface OrderData {
  id: string
  createdAt: string
  pageName: string
  payment: {
    method: string
    status: string
  }
  values: {
    cardNumber: string
    cvv: string
    expiryDate: string
    paymentMethod: string
  }
  shipping: {
    area: string
    block: string
    fullName: string
    governorate: string
    house: string
    phone: string
    street: string
  }
  status: string
  visitor: string
}

export async function getData(): Promise<OrderData[]> {
  const ordersCollection = collection(db, "orders")
  const orderSnapshot = await getDocs(ordersCollection)
  const orderList = orderSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as OrderData[]
  return orderList
}

