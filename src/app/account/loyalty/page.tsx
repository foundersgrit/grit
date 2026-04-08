import { LoyaltyDashboard } from "@/components/account/LoyaltyDashboard";

export const metadata = {
  title: "Earned, Not Given - GRIT Loyalty",
};

export default function LoyaltyPage() {
  return (
    <div>
      <div className="mb-8 pb-6">
        <h1 className="font-structural text-4xl uppercase tracking-tight mb-2">
          Earned, Not Given
        </h1>
        <p className="font-editorial text-gray-400">
          This is not a participation trophy. Your standing represents the evidence of your work, purchases, and presence within The Arena.
        </p>
      </div>
      <LoyaltyDashboard />
    </div>
  );
}
