import Image from "next/image";

export const LoginHero = () => {
  return (
    <div className="flex flex-1 h-full flex-col p-10 text-white">
      <div className="relative flex flex-col justify-between flex-1">
        <div className="relative flex flex-1 flex-col justify-center z-10">
          <h1
            className="text-[120px] font-semibold tracking-tight"
            style={{ fontFamily: "Londrina Outline" }}
          >
            LetterLinc
          </h1>
          <p className="text-gray-300 text-sm">
            {`An AI-based Personalized Cover Letter Generator is designed to
            assist job seekers in creating custom-tailored cover letters. This
            tool takes the user's professional information, such as work
            history, skills, and educational background, and analyzes the job
            they're applying for. It uses AI algorithms to align the applicant's
            profile with the job requirements, emphasizing relevant experiences
            and skills.`}
          </p>
          <div className="w-full absolute blur-2xl opacity-20">
            <Image
              src="/login-illustrate.png"
              alt="login-illustrate"
              className="w-full h-full"
              width={300}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
