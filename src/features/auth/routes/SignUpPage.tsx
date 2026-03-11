import { AuthPageShell } from "../components/AuthPageShell";
import { SignUpForm } from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthPageShell
      title="Create account"
      description="Set up a starter user so you can explore the feature-first application shell."
    >
      <SignUpForm />
    </AuthPageShell>
  );
}
