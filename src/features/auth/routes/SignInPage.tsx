import { AuthPageShell } from "../components/AuthPageShell";
import { SignInForm } from "../components/SignInForm";

export default function SignInPage() {
  return (
    <AuthPageShell
      title="Sign in"
      description="Use your email and password to access the authenticated template shell."
    >
      <SignInForm />
    </AuthPageShell>
  );
}
