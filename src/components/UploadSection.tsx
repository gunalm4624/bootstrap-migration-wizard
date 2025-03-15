import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileUp, FilePlus, AlertTriangle } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { MigrationStep, MigrationStatus, MOCK_MIGRATION_RESULTS } from "@/utils/migrationTypes";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";

const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    step: MigrationStep.IDLE,
    progress: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/zip" && !selectedFile.name.endsWith(".zip")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing your Bootstrap 3 project.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB. Please upload a smaller file.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setMigrationStatus({
      step: MigrationStep.IDLE,
      progress: 0
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startMigration = () => {
    setMigrationStatus({
      step: MigrationStep.UPLOADING,
      progress: 0,
      detail: "Uploading your project..."
    });

    const steps = [
      { step: MigrationStep.UPLOADING, duration: 1500, detail: "Uploading your project..." },
      { step: MigrationStep.EXTRACTING, duration: 2000, detail: "Extracting files..." },
      { step: MigrationStep.ANALYZING, duration: 3000, detail: "Analyzing Bootstrap 3 components..." },
      { step: MigrationStep.CONVERTING, duration: 4000, detail: "Converting to Bootstrap 5..." },
      { step: MigrationStep.GENERATING_REPORT, duration: 2000, detail: "Generating migration report..." },
      { step: MigrationStep.COMPLETE, duration: 0, detail: "Migration complete!" }
    ];

    let totalTime = 0;
    let lastProgress = 0;

    steps.forEach((step, index) => {
      totalTime += step.duration;
      
      setTimeout(() => {
        setMigrationStatus({
          step: step.step,
          progress: lastProgress,
          detail: step.detail
        });

        const startProgress = lastProgress;
        const endProgress = index === steps.length - 1 ? 100 : startProgress + (100 / steps.length);
        const stepDuration = step.duration;
        const intervalTime = 50;
        const totalIntervals = stepDuration / intervalTime;
        const progressIncrement = (endProgress - startProgress) / totalIntervals;

        let currentInterval = 0;
        const progressInterval = setInterval(() => {
          currentInterval++;
          const currentProgress = startProgress + (progressIncrement * currentInterval);
          
          setMigrationStatus(prev => ({
            ...prev,
            progress: Math.min(currentProgress, endProgress)
          }));

          if (currentInterval >= totalIntervals) {
            clearInterval(progressInterval);
            lastProgress = endProgress;
          }
        }, intervalTime);
      }, totalTime - step.duration);
    });
  };

  const resetMigration = () => {
    setFile(null);
    setMigrationStatus({
      step: MigrationStep.IDLE,
      progress: 0
    });
  };

  const downloadResults = () => {
    toast({
      title: "Download started",
      description: "Your migrated project is being downloaded.",
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your migrated project has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div 
      id="upload-section"
      className="relative min-h-screen py-16 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-white dark:bg-gray-950" />
      <div 
        className="absolute -top-[50%] left-[50%] -z-10 h-[1000px] w-[1000px] -translate-x-[50%] rounded-full bg-gradient-radial from-primary/5 to-transparent" 
      />

      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Effortless Migration
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Upload your Bootstrap 3 project, and our intelligent migration tool will analyze and convert it to Bootstrap 5, giving you a detailed report of all changes.
          </p>
        </div>

        {migrationStatus.step === MigrationStep.COMPLETE ? (
          <ResultsDashboard 
            results={MOCK_MIGRATION_RESULTS} 
            onReset={resetMigration}
            onDownload={downloadResults}
          />
        ) : (
          <div className="glass-card rounded-xl shadow-sm max-w-3xl mx-auto overflow-hidden">
            <div className="p-6 sm:p-8">
              {file ? (
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileUp size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetMigration}
                      className="flex-shrink-0"
                    >
                      Change
                    </Button>
                  </div>

                  {migrationStatus.step !== MigrationStep.IDLE ? (
                    <ProgressIndicator status={migrationStatus} />
                  ) : (
                    <div className="space-y-8">
                      <div className="bg-muted/40 rounded-lg p-4 border border-border">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-sm">
                            <h4 className="font-medium mb-1">Before you start</h4>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Make sure your project is a ZIP file with HTML, CSS, and/or JSP files.</li>
                              <li>Your file will be processed temporarily and deleted after conversion.</li>
                              <li>For large projects, the migration might take a few minutes.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={startMigration} 
                        className="w-full py-6 text-lg rounded-lg"
                      >
                        Start Migration
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragOver 
                      ? "border-primary bg-primary/5" 
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {isDragOver ? "Drop your file here" : "Upload your project"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag and drop your ZIP file here, or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button onClick={openFileDialog} variant="outline">
                    <FilePlus size={16} className="mr-2" />
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
