"use client";

import React from "react";
import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, LocalShipping, HourglassEmpty, Receipt } from "@mui/icons-material";

const OrderTimeline = ({ status }: { status: string }) => {
  const steps = [
    { label: "Processing", icon: HourglassEmpty, active: true },
    { label: "Dispatched", icon: Receipt, active: ["Shipped", "Delivered"].includes(status) },
    { label: "Out for Delivery", icon: LocalShipping, active: ["Delivered"].includes(status) },
    { label: "Received", icon: CheckCircle, active: status === "Delivered" },
  ];

  return (
    <div className="flex items-center gap-1 mt-6 overflow-x-auto pb-4 scrollbar-none">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              step.active ? "bg-wattle text-bottle-green" : "bg-white/5 text-gray-600"
            }`}>
              <step.icon sx={{ fontSize: 16 }} />
            </div>
            <span className={`font-structural text-[8px] uppercase tracking-widest text-center ${
              step.active ? "text-wattle" : "text-gray-600"
            }`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-[1px] w-8 shrink-0 transition-colors ${
              steps[idx + 1].active ? "bg-wattle" : "bg-white/10"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export function OrdersList() {
  const { orders, isLoading } = useUserContext();

  if (isLoading) return <div className="text-gray-400 font-editorial">Loading orders...</div>;
  if (!orders || orders.length === 0) return <div className="text-gray-400 font-editorial">No historical data.</div>;

  return (
    <div className="flex flex-col gap-8">
      {orders.map((order) => {
        let badgeColor = "bg-dark-slate text-white";
        if (order.status === "Shipped") badgeColor = "bg-wattle text-bottle-green";
        if (order.status === "Delivered") badgeColor = "bg-bottle-green text-white border border-white/20";

        return (
          <div key={order.id} className="border border-white/10 bg-bottle-green/30 p-8 flex flex-col gap-8 group hover:border-white/30 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="font-structural text-xl uppercase tracking-wider">{order.orderNumber}</span>
                  <span className={`font-structural text-xs uppercase tracking-widest px-2 py-1 ${badgeColor}`}>
                    {order.status}
                  </span>
                </div>
                <span className="font-editorial text-gray-400 text-sm">Placed on {order.date} • {order.itemCount} items</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <span className="font-structural text-2xl text-white ml-auto">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <OrderTimeline status={order.status} />
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-end border-t border-white/5 pt-6">
              {order.status === "Delivered" && (
                <Link href="/support/returns-repairs" className="w-full md:w-auto">
                  <Button variant="ghost" className="w-full text-xs text-gray-500 hover:text-white border-white/10">
                    Request Repair
                  </Button>
                </Link>
              )}
              <Button variant="secondary" className="w-full md:w-auto text-xs px-12">
                Invoice
              </Button>
              <Button variant="accent" className="w-full md:w-auto text-xs px-12">
                Track Package
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
