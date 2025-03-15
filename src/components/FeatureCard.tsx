
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createScrollAnimationObserver } from "@/utils/animationUtils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  className,
  delay = 0
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = createScrollAnimationObserver("animate-scale-in");
    observer.observe(cardRef.current);
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "opacity-0 glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg",
        "hover:translate-y-[-5px] overflow-hidden",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
