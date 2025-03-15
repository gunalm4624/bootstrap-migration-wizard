
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileDown, RefreshCw, AlertTriangle, Check, AlertCircle, FileCode, ArrowUpRight } from "lucide-react";
import { MigrationResults, FileSummary, MigrationWarning } from "@/utils/migrationTypes";

interface ResultsDashboardProps {
  results: MigrationResults;
  onReset: () => void;
  onDownload: () => void;
}

const ResultsDashboard = ({ results, onReset, onDownload }: ResultsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-destructive/15 text-destructive border-destructive/20";
      case "warning":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "info":
      default:
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20";
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case "html":
        return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "css":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "js":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "jsp":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="glass-card rounded-xl shadow-sm overflow-hidden animate-scale-in">
      <div className="p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-primary">
            <Check size={30} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Migration Complete
          </h2>
          <p className="mt-2 text-muted-foreground">
            Your Bootstrap 3 project has been successfully migrated to Bootstrap 5.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="warnings">
              Warnings 
              {results.warnings.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                  {results.warnings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="m-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Files Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{results.totalFiles}</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">{results.modifiedFiles}</span> files modified
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classes Replaced</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{results.classesReplaced}</div>
                    <div className="text-sm text-muted-foreground">
                      Bootstrap 3 to 5 conversions
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">JavaScript Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{results.jsIssuesFound}</div>
                    <div className="text-sm text-muted-foreground">
                      Potential jQuery dependencies
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Manual Fixes Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{results.manualFixesNeeded}</div>
                    <div className="text-sm text-muted-foreground">
                      Require attention
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Important Notes</h3>
              
              <div className="space-y-3">
                {results.warnings.length > 0 ? (
                  results.warnings.slice(0, 3).map((warning, index) => (
                    <div 
                      key={index}
                      className={`rounded-lg p-3 border ${getSeverityColor(warning.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {warning.severity === "error" ? (
                            <AlertCircle size={16} className="text-destructive" />
                          ) : warning.severity === "warning" ? (
                            <AlertTriangle size={16} className="text-amber-500" />
                          ) : (
                            <AlertCircle size={16} className="text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{warning.message}</div>
                          {warning.suggestion && (
                            <div className="text-xs mt-1 text-muted-foreground">{warning.suggestion}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg p-3 border bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20">
                    <div className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 text-green-500" />
                      <div className="text-sm">
                        No critical issues found. Your migration was successful!
                      </div>
                    </div>
                  </div>
                )}

                {results.warnings.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs mt-1"
                    onClick={() => setActiveTab("warnings")}
                  >
                    View all {results.warnings.length} warnings
                    <ArrowUpRight size={12} className="ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="m-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/40 py-3 px-4 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-5">File Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Changes</div>
                  <div className="col-span-3">Issues</div>
                </div>
              </div>
              
              <ScrollArea className="h-[300px]">
                {results.fileSummary.map((file, index) => (
                  <div 
                    key={index}
                    className="py-3 px-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-5 flex items-center">
                        <FileCode size={14} className="mr-2 text-muted-foreground" />
                        <span className="truncate">{file.fileName}</span>
                      </div>
                      <div className="col-span-2">
                        <Badge 
                          variant="outline" 
                          className={`${getFileTypeColor(file.fileType)}`}
                        >
                          {file.fileType}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {file.changesCount} changes
                      </div>
                      <div className="col-span-3">
                        {file.jsIssues > 0 ? (
                          <div className="flex items-center">
                            <AlertTriangle size={14} className="mr-1 text-amber-500" />
                            <span className="text-amber-600 dark:text-amber-400">
                              {file.jsIssues} issues
                            </span>
                          </div>
                        ) : file.warnings.length > 0 ? (
                          <div className="flex items-center">
                            <AlertCircle size={14} className="mr-1 text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400">
                              {file.warnings.length} warnings
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Check size={14} className="mr-1 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">No issues</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="warnings" className="m-0">
            {results.warnings.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <ScrollArea className="h-[400px]">
                  {results.warnings.map((warning, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-b last:border-b-0 ${
                        index % 2 === 0 ? "bg-muted/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {warning.severity === "error" ? (
                          <AlertCircle size={16} className="mt-0.5 text-destructive" />
                        ) : warning.severity === "warning" ? (
                          <AlertTriangle size={16} className="mt-0.5 text-amber-500" />
                        ) : (
                          <AlertCircle size={16} className="mt-0.5 text-blue-500" />
                        )}
                        <div>
                          <div className="font-medium">{warning.message}</div>
                          {warning.file && (
                            <div className="text-sm text-muted-foreground mt-1">
                              File: <span className="font-mono text-xs bg-muted py-0.5 px-1 rounded">{warning.file}</span>
                              {warning.line && ` (Line: ${warning.line})`}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {warning.suggestion && (
                        <div className="mt-2 text-sm ml-8">
                          <div className="font-medium text-xs uppercase text-muted-foreground mb-1">
                            Suggestion
                          </div>
                          <div className="p-2 rounded bg-muted/30 border text-muted-foreground">
                            {warning.suggestion}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 mx-auto h-12 w-12 rounded-full bg-green-500/15 flex items-center justify-center text-green-500">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-medium mb-1">No warnings detected</h3>
                <p className="text-muted-foreground">
                  Your Bootstrap 3 project was successfully migrated without any warnings.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button 
            variant="outline" 
            className="order-2 sm:order-1"
            onClick={onReset}
          >
            <RefreshCw size={16} className="mr-2" /> 
            Start New Migration
          </Button>
          
          <Button 
            className="order-1 sm:order-2"
            onClick={onDownload}
          >
            <Download size={16} className="mr-2" />
            Download Migrated Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
