"use client";

import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  return (
    <form className="flex w-full md:w-auto gap-4" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="ENTER EMAIL" 
        className="px-4 py-2 bg-bottle-green border border-white/20 text-white font-structural uppercase text-sm focus:outline-none focus:border-wattle w-full md:w-64"
      />
      <Button variant="accent" type="submit">Join</Button>
    </form>
  );
}
