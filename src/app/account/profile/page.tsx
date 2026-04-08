import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata = {
  title: "Profile - GRIT Account",
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="font-structural text-4xl uppercase tracking-tight mb-8">
        Profile Settings
      </h1>
      <ProfileForm />
    </div>
  );
}
