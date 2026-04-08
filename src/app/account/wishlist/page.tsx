import { WishlistGrid } from "@/components/account/WishlistGrid";

export const metadata = {
  title: "Wishlist - GRIT Account",
};

export default function WishlistPage() {
  return (
    <div>
      <h1 className="font-structural text-4xl uppercase tracking-tight mb-8">
        Saved Gear
      </h1>
      <WishlistGrid />
    </div>
  );
}
