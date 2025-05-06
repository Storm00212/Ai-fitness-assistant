import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import TerminalOverlay from "@/components/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/*corner decaration*/}
            <div className="absolute -top-10 left-0 w-40 h-40 border-t-2 border-l-2" />
            {/* left side content*/}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Transform</span>
                </div>

                <div>
                  <span className="text-primary">Your Body</span>
                </div>

                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>

                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary">Technology</span>
                </div>
              </h1>
              {/*separator line*/}
              <div className="h-px w-full  bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
              <p className="text-lg text-muted-foreground">
                Get personalized workout plans, nutrition advice, and progress
                tracking with our AI-powered fitness assistant.
              </p>
              {/*stats*/}
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl text-primary font-bold">1000+</span>
                    <span className="text-sm text-muted-foreground">
                       Active Users
                    </span>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"/>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl text-primary font-bold">3 min</span>
                    <span className="text-sm text-muted-foreground">
                      Generation
                    </span>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"/>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl text-primary font-bold">100%</span>
                    <span className="text-sm text-muted-foreground">
                      Personalised
                    </span>
                  </div>
                </div>



              </div>
              {/*button*/}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                size={"lg"}
                className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                  asChild>
                  <Link href={"/generate-program"} className="flex items-center font-mono">
                    Let's Get Started
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>
            {/* right side content */}
            <div className="lg:col-span-5 relative">
              {/** corner pieces */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute -top-0 -left-0 w-16 h-16 border-t-2 border-l-2 border-border" />
                <div className="absolute -top-0 -right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute -bottom-0 -left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute -bottom-0 -right-0 w-16 h-16 border-b-2 border-r-2 border-border" />
              </div>
              {/**image container */}
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="relative overflow-hidden rounded-lg bg-cyber-black">
               <img src="/hero-ai2.png " alt="AI Fitness Assistant" className="object-cover size-full object-center" />
               {/**scan lines */}
               <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />
               {/**Decorations on top of the image */}
                <div className="absolute inset-0 pointer-events-none">
                  {/** Targeting circle */}
                 <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full"/>
                 {/** Targeting lines */}
                 <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50"></div>
                 <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50"></div>
                 <div className="absolute top-0 left-1/2 w-px h-1/4 bg-primary/50"></div>
                 <div className="absolute bottom-0 left-1/2 w-px h-1/4 bg-primary/50"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"/>


              </div>
              {/**terminal overlay */}
              <TerminalOverlay />
            </div>
            

            </div>
          </div>
        </div>
      </section>
      <UserPrograms />
    </div>
  );
};

export default HomePage;
