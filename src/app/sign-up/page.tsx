import { SignupForm } from "../_components/sign-up-form";
import { LoginHero } from "../_components/login-hero";
import { LoginHeader } from "../_components/login-header";

export default function SignUp() {
  return (
    <div className="flex h-screen">
      <LoginHeader buttonText="Login" href="/" />
      <div className="hidden lg:flex w-1/2 bg-zinc-900 border-r">
        <LoginHero />
      </div>
      <div className="flex w-full lg:w-1/2 justify-center p-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
