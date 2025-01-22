"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { db } from "../lib/firebase"
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore"

export function NotificationsDashboard({
  initialNotifications,
}: {
  initialNotifications: any[]
}) {
  const [notifications, setNotifications] = useState<any[]>(initialNotifications)

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[]
      setNotifications(newNotifications)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleClearAll = async () => {
    try {
      const deletePromises = notifications.map((notification) => deleteDoc(doc(db, "orders", notification.id)))
      await Promise.all(deletePromises)
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white" dir="rtl">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">جميع الإشعارات</h1>
          <div className="space-x-2 space-x-reverse">
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleClearAll}>
              مسح جميع الاشعارات
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <Card className="bg-[#1e2536] border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-right text-gray-400">حذف</TableHead>
                <TableHead className="text-right text-gray-400">الاشعارات</TableHead>
                <TableHead className="text-right text-gray-400">الوقت</TableHead>
                <TableHead className="text-right text-gray-400">الصفحة الحالية</TableHead>
                <TableHead className="text-right text-gray-400">المعلومات</TableHead>
                <TableHead className="text-right text-gray-400">الاسم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id} className="border-gray-700">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">2</Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(notification.createdAt).toLocaleString("ar-SA")}
                  </TableCell>
                  <TableCell className="text-gray-300">خطوة - 1</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="bg-red-500">
                        لا يوجد معلومات
                      </Badge>
                      <Badge variant="destructive" className="bg-red-500">
                        لا يوجد بطاقة
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{notification.shipping?.fullName || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

