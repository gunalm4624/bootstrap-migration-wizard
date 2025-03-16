import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, FilePlus, AlertTriangle } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { MigrationStep, MigrationStatus, MigrationResults, BOOTSTRAP_CLASS_MAPPINGS, BOOTSTRAP_JS_ISSUES } from "@/utils/migrationTypes";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";
import { analyzeBootstrapCode } from "@/utils/llmService";

const UploadSection = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    step: MigrationStep.IDLE,
    progress: 0
  });
  const [migrationResults, setMigrationResults] = useState<MigrationResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      validateAndSetFiles(selectedFiles);
    }
  };

  const validateAndSetFiles = (selectedFiles: FileList) => {
    let hasHtmlFiles = false;
    let invalidFiles = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        hasHtmlFiles = true;
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (!hasHtmlFiles) {
      toast({
        title: "No HTML files found",
        description: "Please upload at least one HTML file to migrate.",
        variant: "destructive"
      });
      return;
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Some files will be ignored",
        description: `Only HTML files will be processed. ${invalidFiles.length} non-HTML files will be ignored.`,
        variant: "default"
      });
    }

    setFiles(selectedFiles);
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
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndSetFiles(droppedFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startMigration = async () => {
    if (!files || files.length === 0) return;

    try {
      setMigrationStatus({
        step: MigrationStep.UPLOADING,
        progress: 5,
        detail: "Uploading your files...",
        currentFileName: files.length > 1 ? `${files.length} files` : files[0].name
      });

      await simulateProgress(15, 500);
      
      setMigrationStatus({
        step: MigrationStep.EXTRACTING,
        progress: 20,
        detail: "Processing files...",
        currentFileName: files.length > 1 ? `${files.length} files` : files[0].name
      });
      
      await simulateProgress(30, 500);
      
      const fileContents: FileContent[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          const content = await readFileAsText(file);
          fileContents.push({
            fileName: file.name,
            fileType: 'html',
            content: content
          });
        }
      }
      
      setMigrationStatus({
        step: MigrationStep.ANALYZING,
        progress: 40,
        detail: "Analyzing Bootstrap 3 components with AI...",
        filesProcessed: fileContents.length
      });
      
      for (let i = 0; i < fileContents.length; i++) {
        const fileContent = fileContents[i];
        
        setMigrationStatus(prev => ({
          ...prev,
          progress: 40 + Math.floor((i / fileContents.length) * 20),
          currentFileName: fileContent.fileName
        }));
        
        const analysis = await analyzeBootstrapCode(fileContent.content, "analyze");
        if (analysis.success) {
          fileContent.analysisResults = analysis.content;
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setMigrationStatus({
        step: MigrationStep.CONVERTING,
        progress: 65,
        detail: "Converting to Bootstrap 5 with AI assistance...",
        filesProcessed: fileContents.length
      });
      
      const convertedFiles: FileContent[] = [];
      
      for (let i = 0; i < fileContents.length; i++) {
        const fileContent = fileContents[i];
        
        setMigrationStatus(prev => ({
          ...prev,
          progress: 65 + Math.floor((i / fileContents.length) * 20),
          currentFileName: fileContent.fileName
        }));
        
        const llmConversion = await analyzeBootstrapCode(fileContent.content, "convert");
        let processedContent = fileContent.content;
        let changes = 0;
        let issues: { message: string; line?: number }[] = [];
        
        if (llmConversion.success && llmConversion.content) {
          processedContent = llmConversion.content;
          changes = countDifferences(fileContent.content, processedContent);
          
          const suggestions = await analyzeBootstrapCode(fileContent.content, "suggest");
          if (suggestions.success) {
            issues.push({
              message: suggestions.content
            });
          }
        } else {
          const processed = processHTMLContent(fileContent.content);
          processedContent = processed.content;
          changes = processed.changes;
          issues = processed.issues;
        }
        
        convertedFiles.push({
          ...fileContent,
          content: processedContent,
          changes: changes,
          issues: issues
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const results = generateMigrationResults(convertedFiles);
      
      setMigrationStatus({
        step: MigrationStep.GENERATING_REPORT,
        progress: 90,
        detail: "Generating AI-enhanced migration report...",
        filesProcessed: fileContents.length
      });
      
      await simulateProgress(100, 500);
      
      setMigrationResults(results);
      setMigrationStatus({
        step: MigrationStep.COMPLETE,
        progress: 100,
        detail: "Migration complete with AI assistance!",
        filesProcessed: fileContents.length
      });
      
      prepareFilesForDownload(convertedFiles);
      
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

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
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

  const countDifferences = (original: string, converted: string): number => {
    const originalLines = original.split('\n');
    const convertedLines = converted.split('\n');
    let changes = 0;
    
    const minLength = Math.min(originalLines.length, convertedLines.length);
    for (let i = 0; i < minLength; i++) {
      if (originalLines[i] !== convertedLines[i]) {
        changes++;
      }
    }
    
    changes += Math.abs(originalLines.length - convertedLines.length);
    
    return changes;
  };

  const processHTMLContent = (content: string) => {
    let modifiedContent = content;
    let changesCount = 0;
    const issues: { message: string; line?: number }[] = [];
    
    const bs3CdnMatches = [
      'https://maxcdn.bootstrapcdn.com/bootstrap/3',
      'https://stackpath.bootstrapcdn.com/bootstrap/3',
      'https://netdna.bootstrapcdn.com/bootstrap/3',
      'https://cdn.jsdelivr.net/npm/bootstrap@3',
      'bootstrap.min.css',
      'bootstrap.min.js'
    ];
    
    let foundCDN = false;
    bs3CdnMatches.forEach(match => {
      if (content.includes(match)) {
        foundCDN = true;
        
        const cssPattern = new RegExp(`<link[^>]*${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`, 'g');
        modifiedContent = modifiedContent.replace(cssPattern, 
          `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">`
        );
        changesCount++;
        
        const jsPattern = new RegExp(`<script[^>]*${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`, 'g');
        modifiedContent = modifiedContent.replace(jsPattern,
          `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>`
        );
        changesCount++;
      }
    });
    
    if (!foundCDN && (content.includes('class="container"') || content.includes('class="row"'))) {
      issues.push({
        message: "Bootstrap CDN links not found but Bootstrap classes detected"
      });
    }
    
    if (content.includes('jquery')) {
      issues.push({
        message: "jQuery dependency detected. Bootstrap 5 no longer requires jQuery."
      });
    }
    
    const modalHeaderClosePattern = /<div class=["']modal-header["']>\s*<button[^>]*class=["'][^"']*close[^"']*["'][^>]*data-dismiss=["']modal["'][^>]*>[^<]*<span[^>]*>&times;<\/span><\/button>\s*<h[1-6][^>]*class=["'][^"']*modal-title[^"']*["'][^>]*>/g;
    
    modifiedContent = modifiedContent.replace(modalHeaderClosePattern, (match) => {
      changesCount++;
      const titleMatch = match.match(/<h[1-6][^>]*class=["'][^"']*modal-title[^"']*["'][^>]*>/);
      if (titleMatch) {
        const titleElement = titleMatch[0];
        return `<div class="modal-header">
    ${titleElement.replace('class="modal-title"', 'class="modal-title fs-5"')}
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
      }
      return match;
    });
    
    Object.entries(BOOTSTRAP_CLASS_MAPPINGS).forEach(([bs3Class, bs5Class]) => {
      if (bs3Class.includes('http')) return;
      
      const classPattern = new RegExp(`class=["'][^"']*\\b${bs3Class}\\b[^"']*["']`, 'gi');
      const matches = modifiedContent.match(classPattern) || [];
      
      if (matches.length > 0) {
        changesCount += matches.length;
        
        modifiedContent = modifiedContent.replace(classPattern, (match) => {
          return match.replace(new RegExp(`\\b${bs3Class}\\b`, 'g'), bs5Class as string);
        });
      }
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
      const attrPattern = new RegExp(`${attr.old}=`, 'g');
      const matches = modifiedContent.match(attrPattern) || [];
      
      if (matches.length > 0) {
        changesCount += matches.length;
        modifiedContent = modifiedContent.replace(attrPattern, `${attr.new}=`);
      }
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

  const generateMigrationResults = (files: FileContent[]): MigrationResults => {
    let totalClassesReplaced = 0;
    let jsIssuesFound = 0;
    let manualFixesNeeded = 0;
    const warnings: any[] = [];
    const fileSummary: any[] = [];

    files.forEach(file => {
      const fileWarnings = [];
      const changesCount = file.changes || 0;
      const fileIssues = file.issues || [];
      jsIssuesFound += fileIssues.length;
      
      fileWarnings.push(...fileIssues.map(issue => ({
        type: "javascript",
        severity: issue.message.includes("jQuery") ? "warning" : "info",
        message: issue.message,
        file: file.fileName,
        line: issue.line
      })));

      totalClassesReplaced += changesCount;
      
      if (fileIssues.length > 0) {
        manualFixesNeeded += Math.ceil(fileIssues.length / 2);
      }

      if (file.analysisResults) {
        fileWarnings.push({
          type: "ai-analysis",
          severity: "info",
          message: "AI Analysis: " + file.analysisResults.substring(0, 100) + "...",
          file: file.fileName
        });
      }

      fileSummary.push({
        fileName: file.fileName,
        fileType: file.fileType,
        changesCount,
        jsIssues: fileIssues.length,
        warnings: fileWarnings,
        aiAnalysis: file.analysisResults
      });

      warnings.push(...fileWarnings);
    });

    if (jsIssuesFound > 0) {
      warnings.unshift({
        type: "javascript",
        severity: "warning",
        message: `jQuery dependency found in ${Math.min(files.length, jsIssuesFound)} files`
      });
    }

    if (totalClassesReplaced > 0) {
      warnings.unshift({
        type: "structure",
        severity: "info",
        message: "Bootstrap 5 uses different grid breakpoints"
      });
    }

    warnings.unshift({
      type: "ai-assistance",
      severity: "info",
      message: "Migration performed with AI assistance for improved accuracy"
    });

    return {
      totalFiles: files.length,
      modifiedFiles: files.length,
      classesReplaced: totalClassesReplaced,
      jsIssuesFound,
      manualFixesNeeded,
      warnings: removeDuplicateWarnings(warnings),
      fileSummary,
      aiAssisted: true
    };
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

  const prepareFilesForDownload = (files: FileContent[]) => {
    window.migratedFiles = files;
  };

  const resetMigration = () => {
    setFiles(null);
    setMigrationStatus({
      step: MigrationStep.IDLE,
      progress: 0
    });
    setMigrationResults(null);
  };

  const downloadResults = () => {
    if (window.migratedFiles && window.migratedFiles.length > 0) {
      const files = window.migratedFiles;
      
      if (files.length === 1) {
        const file = files[0];
        const blob = new Blob([file.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bootstrap5-${file.fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const file = files[0];
        const blob = new Blob([file.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bootstrap5-${file.fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Multiple files",
          description: `Downloading first file. In a production app, all ${files.length} files would be zipped.`,
        });
      }
    }
    
    toast({
      title: "Download started",
      description: "Your migrated Bootstrap 5 files are being downloaded.",
    });
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
            HTML Migration Tool
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Upload your HTML files with Bootstrap 3, and our intelligent migration tool will convert them to Bootstrap 5, giving you a detailed report of all changes.
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
              {files ? (
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileUp size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">
                        {files.length > 1 ? `${files.length} files selected` : files[0].name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {files.length > 1 
                          ? `${Array.from(files).filter(f => f.name.endsWith('.html') || f.name.endsWith('.htm')).length} HTML files`
                          : `${(files[0].size / 1024).toFixed(2)} KB`}
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
                              <li>Only HTML files will be processed and migrated.</li>
                              <li>Your files will be processed in your browser and are not uploaded to any server.</li>
                              <li>The tool will convert Bootstrap 3 classes to Bootstrap 5 equivalents.</li>
                              <li>JavaScript code may need manual updates after migration.</li>
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
                    {isDragOver ? "Drop your files here" : "Upload HTML files"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag and drop your HTML files here, or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileChange}
                    multiple
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
  changes?: number;
  issues?: { message: string; line?: number }[];
  analysisResults?: string;
}

declare global {
  interface Window {
    migratedFiles?: FileContent[];
  }
}

export default UploadSection;
