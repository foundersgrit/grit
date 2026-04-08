import { CheckoutFlow } from "@/components/shop/CheckoutFlow";

export const metadata = {
  title: "Checkout - GRIT Gear",
  description: "Securely finalize your order and earn your gear.",
};

export default function CheckoutPage() {
  return (
    <div className="flex-1 bg-dark-slate pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="sr-only">Checkout</h1>
        <CheckoutFlow />
      </div>
    </div>
  );
}
