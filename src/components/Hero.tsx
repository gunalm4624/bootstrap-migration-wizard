
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const scrollToContent = () => {
    const uploadSection = document.getElementById("upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-mesh-gradient dark:bg-mesh-gradient-dark" />
      
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgOGgydjJoLTJ2LTJ6bTIgMGgydjJoLTJ2LTJ6bS0yLThoMnYyaC0ydi0yek0zNCAzMGg0djJoLTR2LTJ6bTAtOGgzdjJoLTN2LTJ6bTAgMTBoMXYyaC0xdi0yek0zMiAyOGgxdjJoLTF2LTJ6bS0yIDJoMnYyaC0ydi0yem0yIDBoMnYyaC0ydi0yem0tNCAwaDJ2MmgtMnYtMnptMCA4aDJ2MmgtMnYtMnptOCAxMmgtOHYtMmg4djJ6bTAtNGgtNHYtMmg0djJ6bTAtMTZoLTJ2LTJoMnYyem0tNC04aDJ2MmgtMnYtMnptLTQgOGgydjJoLTJ2LTJ6bS00IDBocFszJXdqdGsxMzAzOTMzYjl1MHlicQ=='/60/0.4)]"
        style={{ opacity: 0.025 }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <div
          className={`transform transition-all duration-1000 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="mr-1.5 h-2 w-2 animate-pulse-slow rounded-full bg-primary"></span>
            Upgrade your Bootstrap 3 projects effortlessly
          </div>
        </div>

        <h1
          className={`transition-all duration-1000 delay-100 ${
            loaded
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          } text-balance font-bold tracking-tight`}
        >
          Bootstrap <span className="text-primary">3 to 5</span> Migration Wizard
        </h1>

        <p
          className={`mt-6 text-lg text-muted-foreground transition-all duration-1000 delay-200 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } max-w-2xl mx-auto text-balance`}
        >
          The easiest way to upgrade your Bootstrap 3 projects to Bootstrap 5. 
          Upload your files, get a detailed migration report, and download your modernized project — all with just a few clicks.
        </p>

        <div
          className={`mt-10 flex justify-center gap-4 transition-all duration-1000 delay-300 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden rounded-full px-8 shadow-md"
            onClick={scrollToContent}
          >
            Start Migration
            <span className="absolute inset-0 -z-10 translate-y-[100%] rounded-full bg-primary/80 transition-transform duration-300 group-hover:translate-y-0"></span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 backdrop-blur-sm"
            asChild
          >
            <a href="#features">Learn More</a>
          </Button>
        </div>

        <div
          className={`mt-16 animate-bounce-subtle opacity-60 transition-opacity duration-300 hover:opacity-100`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToContent}
            aria-label="Scroll down"
          >
            <ArrowDown size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
