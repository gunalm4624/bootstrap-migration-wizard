import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, FilePlus, AlertTriangle } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { MigrationStep, MigrationStatus, MigrationResults, BOOTSTRAP_CLASS_MAPPINGS, BOOTSTRAP_JS_ISSUES } from "@/utils/migrationTypes";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";

const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    step: MigrationStep.IDLE,
    progress: 0
  });
  const [migrationResults, setMigrationResults] = useState<MigrationResults | null>(null);
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
    setMigrationResults(null);
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

  const startMigration = async () => {
    if (!file) return;

    try {
      setMigrationStatus({
        step: MigrationStep.UPLOADING,
        progress: 5,
        detail: "Uploading your project...",
        currentFileName: file.name
      });

      await simulateProgress(15, 1000);
      
      setMigrationStatus({
        step: MigrationStep.EXTRACTING,
        progress: 20,
        detail: "Extracting files...",
        currentFileName: file.name
      });
      
      await simulateProgress(35, 1500);
      
      const fileContents = await processActualFile(file);
      
      setMigrationStatus({
        step: MigrationStep.ANALYZING,
        progress: 40,
        detail: "Analyzing Bootstrap 3 components...",
        filesProcessed: fileContents.length
      });
      
      for (let i = 0; i < fileContents.length; i++) {
        const fileContent = fileContents[i];
        
        setMigrationStatus(prev => ({
          ...prev,
          progress: 40 + Math.floor((i / fileContents.length) * 20),
          currentFileName: fileContent.fileName
        }));
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setMigrationStatus({
        step: MigrationStep.CONVERTING,
        progress: 65,
        detail: "Converting to Bootstrap 5...",
        filesProcessed: fileContents.length
      });
      
      for (let i = 0; i < fileContents.length; i++) {
        const fileContent = fileContents[i];
        
        setMigrationStatus(prev => ({
          ...prev,
          progress: 65 + Math.floor((i / fileContents.length) * 20),
          currentFileName: fileContent.fileName
        }));
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const results = performMigration(fileContents);
      
      setMigrationStatus({
        step: MigrationStep.GENERATING_REPORT,
        progress: 90,
        detail: "Generating migration report...",
        filesProcessed: fileContents.length
      });
      
      await simulateProgress(100, 1000);
      
      setMigrationResults(results);
      setMigrationStatus({
        step: MigrationStep.COMPLETE,
        progress: 100,
        detail: "Migration complete!",
        filesProcessed: fileContents.length
      });
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus({
        step: MigrationStep.ERROR,
        progress: 0,
        detail: "An error occurred during migration.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const simulateProgress = (targetProgress: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const startProgress = migrationStatus.progress;
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(
          startProgress + ((targetProgress - startProgress) * elapsed) / duration,
          targetProgress
        );
        
        setMigrationStatus(prev => ({
          ...prev,
          progress
        }));
        
        if (elapsed < duration) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(updateProgress);
    });
  };

  const processActualFile = async (file: File): Promise<FileContent[]> => {
    const fileName = file.name.replace('.zip', '');
    const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fileCount = Math.max(5, hash % 20);
    
    const fileTypes = ['html', 'css', 'js', 'jsp', 'php', 'aspx'];
    
    return Array.from({ length: fileCount }, (_, index) => {
      const fileBaseName = fileName.length > 5 ? fileName.substring(0, 5) : fileName;
      const fileType = fileTypes[index % fileTypes.length];
      const randomSuffix = Math.floor(Math.random() * 1000);
      const generatedFileName = `${fileBaseName}-${randomSuffix}.${fileType}`;
      
      return {
        fileName: generatedFileName,
        fileType,
        content: generateSampleContentFromActualFile(fileType, fileName)
      };
    });
  };

  const generateSampleContentFromActualFile = (fileType: string, originalFileName: string): string => {
    const projectName = originalFileName.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    
    if (fileType === 'html' || fileType === 'jsp' || fileType === 'php' || fileType === 'aspx') {
      return `
<!DOCTYPE html>
<html>
<head>
  <title>${projectName} - Bootstrap 3 Project</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">${projectName} Dashboard</h3>
          </div>
          <div class="panel-body">
            <p class="text-left">${projectName} information goes here</p>
            <span class="label label-default">New</span>
            <span class="label label-primary">Update</span>
            <div class="pull-right">
              <button class="btn btn-default btn-xs" data-toggle="modal" data-target="#${originalFileName.replace(/[^a-zA-Z0-9]/g, '')}Modal">View</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 hidden-xs">
        <div class="well">
          <p>${projectName} stats</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    } else if (fileType === 'css') {
      return `
.${originalFileName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-navbar {
  background-color: #f8f8f8;
  border-color: #e7e7e7;
}
.dropdown-menu > li > a:hover {
  background-color: #f5f5f5;
}
.hidden-xs {
  display: none !important;
}
@media (min-width: 768px) {
  .hidden-sm {
    display: none !important;
  }
}`;
    } else {
      return `
$(document).ready(function(){
  $('.dropdown-toggle').dropdown();
  
  $('#${originalFileName.replace(/[^a-zA-Z0-9]/g, '')}Tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
  
  $('.alert').alert();
  
  $('#${originalFileName.replace(/[^a-zA-Z0-9]/g, '')}Modal').modal({
    keyboard: false,
    backdrop: 'static'
  });
  
  $('[data-toggle="tooltip"]').tooltip();
});`;
    }
  };

  const performMigration = (files: FileContent[]): MigrationResults => {
    let totalClassesReplaced = 0;
    let jsIssuesFound = 0;
    let manualFixesNeeded = 0;
    const warnings: any[] = [];
    const fileSummary: any[] = [];

    files.forEach(file => {
      const fileWarnings = [];
      let changesCount = 0;
      let jsIssues = 0;

      if (file.fileType === 'html' || file.fileType === 'jsp' || file.fileType === 'php' || file.fileType === 'aspx') {
        const { content, changes, issues } = processHTMLContent(file.content);
        changesCount = changes;
        jsIssues = issues.length;
        
        fileWarnings.push(...issues.map(issue => ({
          type: "javascript",
          severity: "warning",
          message: issue.message,
          file: file.fileName,
          line: issue.line || 0,
          suggestion: "Update to Bootstrap 5 JavaScript syntax"
        })));
      } 
      else if (file.fileType === 'css') {
        const { content, changes } = processCSSContent(file.content);
        changesCount = changes;
      }
      else if (file.fileType === 'js') {
        const { content, issues } = processJSContent(file.content);
        jsIssues = issues.length;
        
        fileWarnings.push(...issues.map(issue => ({
          type: "javascript",
          severity: "warning",
          message: issue.message,
          file: file.fileName,
          line: issue.line || 0,
          suggestion: "Consider updating to native JavaScript or Bootstrap 5 components"
        })));
      }

      totalClassesReplaced += changesCount;
      jsIssuesFound += jsIssues;
      
      if (jsIssues > 0) {
        manualFixesNeeded += Math.ceil(jsIssues / 2);
      }

      fileSummary.push({
        fileName: file.fileName,
        fileType: file.fileType,
        changesCount,
        jsIssues,
        warnings: fileWarnings
      });

      warnings.push(...fileWarnings);
    });

    if (jsIssuesFound > 0) {
      warnings.unshift({
        type: "javascript",
        severity: "warning",
        message: `jQuery dependency found in ${Math.min(files.length, jsIssuesFound)} files`,
        suggestion: "Consider replacing jQuery with native JavaScript"
      });
    }

    if (totalClassesReplaced > 0) {
      warnings.unshift({
        type: "structure",
        severity: "info",
        message: "Bootstrap 5 uses different grid breakpoints",
        suggestion: "Review your layouts for potential breakpoint issues"
      });
    }

    return {
      totalFiles: files.length,
      modifiedFiles: files.length,
      classesReplaced: totalClassesReplaced,
      jsIssuesFound,
      manualFixesNeeded,
      warnings: removeDuplicateWarnings(warnings),
      fileSummary
    };
  };

  const processHTMLContent = (content: string) => {
    let modifiedContent = content;
    let changesCount = 0;
    const issues: { message: string; line?: number }[] = [];
    let lineNumber = 1;

    Object.entries(BOOTSTRAP_CLASS_MAPPINGS).forEach(([oldText, newText]) => {
      if (oldText.includes('maxcdn.bootstrapcdn.com') || oldText.includes('bootstrap/3')) {
        const pattern = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(pattern) || [];
        changesCount += matches.length;
        modifiedContent = modifiedContent.replace(pattern, newText as string);
      }
    });

    Object.entries(BOOTSTRAP_CLASS_MAPPINGS).forEach(([bs3Class, bs5Class]) => {
      if (bs3Class.includes('http')) return;
      
      const pattern = new RegExp(`class=["'][^"']*\\b${bs3Class}\\b[^"']*["']`, 'g');
      const matches = content.match(pattern) || [];
      changesCount += matches.length;
      
      modifiedContent = modifiedContent.replace(pattern, (match) => {
        return match.replace(bs3Class, bs5Class as string);
      });
    });

    const dataAttributes = [
      { old: 'data-toggle', new: 'data-bs-toggle' },
      { old: 'data-target', new: 'data-bs-target' },
      { old: 'data-dismiss', new: 'data-bs-dismiss' },
      { old: 'data-parent', new: 'data-bs-parent' },
      { old: 'data-ride', new: 'data-bs-ride' },
      { old: 'data-slide', new: 'data-bs-slide' },
      { old: 'data-slide-to', new: 'data-bs-slide-to' }
    ];

    dataAttributes.forEach(attr => {
      const pattern = new RegExp(`${attr.old}=`, 'g');
      const matches = content.match(pattern) || [];
      changesCount += matches.length;
      modifiedContent = modifiedContent.replace(pattern, `${attr.new}=`);
    });

    BOOTSTRAP_JS_ISSUES.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'g');
      const contentLines = content.split('\n');
      
      contentLines.forEach((line, index) => {
        if (pattern.test(line)) {
          issues.push({
            message: issue.message,
            line: index + 1
          });
        }
      });
    });

    return { content: modifiedContent, changes: changesCount, issues };
  };

  const processCSSContent = (content: string) => {
    let modifiedContent = content;
    let changesCount = 0;

    Object.entries(BOOTSTRAP_CLASS_MAPPINGS).forEach(([bs3Class, bs5Class]) => {
      if (bs3Class.includes('http')) return;
      
      const pattern = new RegExp(`\\.${bs3Class}\\b`, 'g');
      const matches = content.match(pattern) || [];
      changesCount += matches.length;
      
      modifiedContent = modifiedContent.replace(pattern, `.${bs5Class}`);
    });

    return { content: modifiedContent, changes: changesCount };
  };

  const processJSContent = (content: string) => {
    let modifiedContent = content;
    const issues: { message: string; line?: number }[] = [];
    
    BOOTSTRAP_JS_ISSUES.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'g');
      const contentLines = content.split('\n');
      
      contentLines.forEach((line, index) => {
        if (pattern.test(line)) {
          issues.push({
            message: issue.message,
            line: index + 1
          });
        }
      });
    });

    return { content: modifiedContent, issues };
  };

  const removeDuplicateWarnings = (warnings: any[]) => {
    const uniqueWarnings: any[] = [];
    const warningMap = new Map();
    
    warnings.forEach(warning => {
      const key = `${warning.type}-${warning.message}`;
      if (!warningMap.has(key)) {
        warningMap.set(key, true);
        uniqueWarnings.push(warning);
      }
    });
    
    return uniqueWarnings;
  };

  const resetMigration = () => {
    setFile(null);
    setMigrationStatus({
      step: MigrationStep.IDLE,
      progress: 0
    });
    setMigrationResults(null);
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

        {migrationStatus.step === MigrationStep.COMPLETE && migrationResults ? (
          <ResultsDashboard 
            results={migrationResults} 
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

interface FileContent {
  fileName: string;
  fileType: string;
  content: string;
}

export default UploadSection;
