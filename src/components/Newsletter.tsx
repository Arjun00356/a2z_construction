import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
          <p className="text-foreground text-lg">
            Sign up to receive exclusive news and offers about the latest launches
          </p>
          <div className="flex gap-4 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="md:w-80 bg-background"
            />
            <Button 
              type="submit"
              className="bg-muted-foreground hover:bg-muted-foreground/90 text-background uppercase text-xs tracking-wider px-8"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
