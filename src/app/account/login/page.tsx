import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Authenticate - GRIT",
  description: "Enter your account or join the community.",
};

export default function LoginPage() {
  return (
    <div className="w-full py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-structural text-4xl md:text-5xl uppercase tracking-tighter mb-4">
          Account Access
        </h1>
        <p className="font-editorial text-gray-400">
          Sign in to track your orders, access the repairs portal, and view your loyalty standing.
        </p>
      </div>
      
      <AuthForm />
    </div>
  );
}
