import Image from "next/image";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { buttonVariants } from "./ui/button";

interface LoginHeaderProps {
  buttonText: string;
  href: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  buttonText,
  href,
}) => {
  return (
    <div className="flex justify-between absolute inset-0 items-center h-16">
      <div className="relative z-20 flex items-center text-lg gap-2 ml-6 font-bold">
        <Image src="/logo.png" alt="Logo" width={24} height={24} />
        LetterLinc
      </div>
      <Link
        href={href}
        className={cn(buttonVariants({ variant: "ghost" }), "mr-6")}
      >
        {buttonText}
      </Link>
    </div>
  );
};
