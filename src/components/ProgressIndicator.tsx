
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, XCircle, RefreshCw, File } from "lucide-react";
import { MigrationStatus, MigrationStep } from "@/utils/migrationTypes";

interface ProgressIndicatorProps {
  status: MigrationStatus;
}

const ProgressIndicator = ({ status }: ProgressIndicatorProps) => {
  const [progressValue, setProgressValue] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    setProgressValue(status.progress);
  }, [status.progress]);

  // Generate steps based on current status
  const steps = [
    { id: MigrationStep.UPLOADING, label: "Upload" },
    { id: MigrationStep.EXTRACTING, label: "Extract" },
    { id: MigrationStep.ANALYZING, label: "Analyze" },
    { id: MigrationStep.CONVERTING, label: "Convert" },
    { id: MigrationStep.GENERATING_REPORT, label: "Report" }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === status.step);
  };

  const isStepActive = (stepId: MigrationStep) => {
    return status.step === stepId;
  };

  const isStepComplete = (stepId: MigrationStep) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(step => step.id === stepId);
    return stepIndex < currentIndex;
  };

  return (
    <div className="space-y-4">
      {/* Steps indicator */}
      <div className="hidden sm:flex items-center justify-between relative mb-8">
        {/* Connect line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground/20" />
        
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="relative z-10 flex flex-col items-center"
          >
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isStepComplete(step.id) 
                  ? "bg-primary text-primary-foreground" 
                  : isStepActive(step.id)
                  ? "bg-primary/15 text-primary border border-primary"  
                  : "bg-muted text-muted-foreground"
              } transition-colors`}
            >
              {isStepComplete(step.id) ? (
                <CheckCircle2 size={16} />
              ) : (
                index + 1
              )}
            </div>
            <span 
              className={`mt-2 text-xs ${
                isStepActive(step.id) || isStepComplete(step.id) 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{status.detail}</span>
          <span className="text-muted-foreground">{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Current operation details */}
      <div className="text-sm text-muted-foreground">
        {status.step === MigrationStep.UPLOADING && (
          <div className="flex items-center">
            <RefreshCw size={12} className="mr-2 animate-spin" />
            Uploading file: {status.currentFileName || "file.zip"}
          </div>
        )}
        
        {status.step === MigrationStep.EXTRACTING && (
          <div className="flex items-center">
            <RefreshCw size={12} className="mr-2 animate-spin" />
            Extracting: {status.currentFileName || "ZIP contents..."}
          </div>
        )}
        
        {status.step === MigrationStep.ANALYZING && (
          <div className="flex items-center">
            <File size={12} className="mr-2" />
            Analyzing: {status.currentFileName || "Bootstrap 3 components..."}
          </div>
        )}
        
        {status.step === MigrationStep.CONVERTING && (
          <div className="flex items-center">
            <File size={12} className="mr-2" />
            Converting: {status.currentFileName || "Bootstrap 3 to 5..."}
          </div>
        )}
        
        {status.step === MigrationStep.GENERATING_REPORT && (
          <div className="flex items-center">
            <RefreshCw size={12} className="mr-2 animate-spin" />
            Generating report from {status.filesProcessed || 0} files...
          </div>
        )}

        {status.step === MigrationStep.ERROR && (
          <div className="flex items-center text-destructive">
            <XCircle size={12} className="mr-2" />
            Error: {status.error || "An unexpected error occurred"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
