"use client";

import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function OrdersList() {
  const { orders, isLoading } = useUserContext();

  if (isLoading) return <div className="text-gray-400 font-editorial">Loading orders...</div>;
  if (!orders || orders.length === 0) return <div className="text-gray-400 font-editorial">No historical data.</div>;

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => {
        let badgeColor = "bg-dark-slate text-white";
        if (order.status === "Shipped") badgeColor = "bg-wattle text-bottle-green";
        if (order.status === "Delivered") badgeColor = "bg-bottle-green text-white border border-white/20";

        return (
          <div key={order.id} className="border border-white/10 bg-bottle-green/30 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="font-structural text-xl uppercase tracking-wider">{order.orderNumber}</span>
                <span className={`font-structural text-xs uppercase tracking-widest px-2 py-1 ${badgeColor}`}>
                  {order.status}
                </span>
              </div>
              <span className="font-editorial text-gray-400 text-sm">Placed on {order.date} • {order.itemCount} items</span>
              <span className="font-structural text-lg mt-2">${order.total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {order.status === "Delivered" && (
                <Link href="/support/returns-repairs" className="w-full md:w-auto">
                  <Button variant="ghost" className="w-full text-xs text-gray-400 hover:text-white border-white/20">
                    Request Repair
                  </Button>
                </Link>
              )}
              <Button variant="secondary" className="w-full md:w-auto">
                Track Order
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
