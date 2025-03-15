
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient dark:bg-mesh-gradient-dark p-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full text-center animate-scale-in">
        <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! This page doesn't exist.</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild>
          <a href="/" className="inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
