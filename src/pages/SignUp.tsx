import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInSignUp() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
      className="flex flex-col gap-3 max-w-sm mx-auto p-6 border rounded-2xl shadow"
    >
      <h2 className="text-xl font-bold">
        {step === "signIn" ? "Sign In" : "Create Account"}
      </h2>

      <Input name="email" placeholder="Email" type="email" required />
      <Input name="password" placeholder="Password" type="password" required />
      <input name="flow" type="hidden" value={step} />

      <Button type="submit">
        {step === "signIn" ? "Sign in" : "Sign up"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() =>
          setStep(step === "signIn" ? "signUp" : "signIn")
        }
      >
        {step === "signIn"
          ? "No account? Create one"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}