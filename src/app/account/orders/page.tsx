import { OrdersList } from "@/components/account/OrdersList";

export const metadata = {
  title: "Order History - GRIT Account",
};

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="font-structural text-4xl uppercase tracking-tight mb-2">
          Order History
        </h1>
        <p className="font-editorial text-gray-400">
          The gear you&apos;ve earned. GRIT products are meant to be repaired, not replaced. Use the repair portal for any structural issues.
        </p>
      </div>
      <OrdersList />
    </div>
  );
}
