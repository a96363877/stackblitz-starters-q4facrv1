import { OrderDetails } from './components/order-details';
import { getNotifications } from './lib/getNotifications';

export default async function Home() {
  const initialOrders = await getNotifications();
  return <OrderDetails initialOrders={initialOrders} />;
}
