
import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { FileUp, BarChart3, FileDown, Code2, RefreshCcw, FileWarning } from "lucide-react";
import { createScrollAnimationObserver } from "@/utils/animationUtils";

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create scroll animation observer for features section
    if (featuresRef.current) {
      const observer = createScrollAnimationObserver("animate-fade-in");
      Array.from(featuresRef.current.children).forEach(child => {
        observer.observe(child);
      });

      return () => {
        if (featuresRef.current) {
          Array.from(featuresRef.current.children).forEach(child => {
            observer.unobserve(child);
          });
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Upload Section */}
      <UploadSection />

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 bg-mesh-gradient dark:bg-mesh-gradient-dark opacity-60" />
        
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Key Features
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Our migration tool offers everything you need to seamlessly upgrade from Bootstrap 3 to Bootstrap 5, saving you time and effort.
            </p>
          </div>

          <div 
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={<FileUp size={24} />}
              title="Simple File Upload"
              description="Upload your entire project as a ZIP file. Our tool handles HTML, CSS, and JSP files seamlessly."
              delay={0}
            />
            <FeatureCard 
              icon={<Code2 size={24} />}
              title="Intelligent Migration"
              description="Automatically converts Bootstrap 3 classes to their Bootstrap 5 equivalents with high accuracy."
              delay={100}
            />
            <FeatureCard 
              icon={<BarChart3 size={24} />}
              title="Detailed Reporting"
              description="Get comprehensive reports on all changes made, with statistics and visual summaries."
              delay={200}
            />
            <FeatureCard 
              icon={<FileWarning size={24} />}
              title="JavaScript Analysis"
              description="Identifies jQuery dependencies and potential JavaScript issues due to Bootstrap 5's jQuery removal."
              delay={300}
            />
            <FeatureCard 
              icon={<RefreshCcw size={24} />}
              title="Zero Storage"
              description="Your files are processed temporarily and deleted after conversion, ensuring maximum privacy."
              delay={400}
            />
            <FeatureCard 
              icon={<FileDown size={24} />}
              title="Instant Download"
              description="Download your migrated project as a ZIP file immediately after processing is complete."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-secondary/50">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Get answers to common questions about our Bootstrap migration tool.
            </p>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up">
              <h3 className="text-lg font-medium mb-2">What exactly does this tool do?</h3>
              <p className="text-muted-foreground">
                Our tool analyzes your Bootstrap 3 project files and automatically converts them to use Bootstrap 5 classes and syntax. It handles HTML, CSS, and JSP files, identifies JavaScript dependencies, and generates a detailed report of all changes.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up delay-100">
              <h3 className="text-lg font-medium mb-2">Is this tool 100% accurate?</h3>
              <p className="text-muted-foreground">
                While our migration tool is highly accurate for standard Bootstrap 3 implementations, some custom or complex implementations may require manual adjustments. The tool identifies these cases and provides clear guidance on what needs to be fixed manually.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up delay-200">
              <h3 className="text-lg font-medium mb-2">What about jQuery dependencies?</h3>
              <p className="text-muted-foreground">
                Bootstrap 5 removed jQuery as a dependency. Our tool identifies jQuery-dependent code in your project and flags it in the report, allowing you to make informed decisions about how to update your JavaScript code.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up delay-300">
              <h3 className="text-lg font-medium mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Yes! Your files are processed temporarily on our servers and are automatically deleted after conversion. We never store or access your code beyond what's needed for the migration process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
