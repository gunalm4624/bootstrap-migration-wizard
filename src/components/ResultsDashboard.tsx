
import { Button } from "@/components/ui/button";
import { MigrationResults } from "@/utils/migrationTypes";
import { FileDown, RefreshCcw, AlertTriangle, Check, BarChart3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResultsDashboardProps {
  results: MigrationResults;
  onReset: () => void;
  onDownload: () => void;
}

const ResultsDashboard = ({ results, onReset, onDownload }: ResultsDashboardProps) => {
  return (
    <div className="glass-card rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold mb-1">Migration Complete</h2>
            <p className="text-muted-foreground">
              {results.aiAssisted 
                ? "Your project has been migrated to Bootstrap 5 with AI assistance" 
                : "Your project has been migrated to Bootstrap 5"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onReset}>
              <RefreshCcw size={16} className="mr-2" />
              Start New
            </Button>
            <Button onClick={onDownload}>
              <FileDown size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Migration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Files Migrated</span>
            <span className="text-2xl font-bold">{results.modifiedFiles}</span>
            <span className="text-xs text-muted-foreground mt-1">out of {results.totalFiles} total</span>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Classes Updated</span>
            <span className="text-2xl font-bold">{results.classesReplaced}</span>
            <span className="text-xs text-muted-foreground mt-1">bootstrap classes replaced</span>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">JS Issues</span>
            <span className="text-2xl font-bold">{results.jsIssuesFound}</span>
            <span className="text-xs text-muted-foreground mt-1">potential javascript issues</span>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Manual Fixes</span>
            <span className="text-2xl font-bold">{results.manualFixesNeeded}</span>
            <span className="text-xs text-muted-foreground mt-1">recommended manual checks</span>
          </div>
        </div>

        {/* AI Assistance Badge */}
        {results.aiAssisted && (
          <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={18} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Enhanced Migration</h3>
                <p className="text-sm text-muted-foreground">
                  This migration was enhanced with AI assistance to improve accuracy, 
                  especially for complex Bootstrap components like modals, carousels, and dropdowns.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warnings List */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Migration Notes</h3>
          <div className="space-y-3">
            {results.warnings.map((warning, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-4 flex items-start space-x-3 ${
                  warning.severity === 'warning' 
                    ? 'bg-amber-500/10 border border-amber-500/20' 
                    : warning.severity === 'error'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : warning.type === 'ai-assistance' || warning.type === 'ai-analysis'
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'bg-muted/40 border border-border'
                }`}
              >
                <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  warning.severity === 'warning' 
                    ? 'bg-amber-500/20' 
                    : warning.severity === 'error'
                      ? 'bg-red-500/20'
                      : warning.type === 'ai-assistance' || warning.type === 'ai-analysis'
                        ? 'bg-blue-500/20'
                        : 'bg-muted'
                }`}>
                  {warning.severity === 'warning' || warning.severity === 'error' ? (
                    <AlertTriangle size={12} className={warning.severity === 'warning' ? 'text-amber-500' : 'text-red-500'} />
                  ) : warning.type === 'ai-assistance' || warning.type === 'ai-analysis' ? (
                    <BarChart3 size={12} className="text-blue-500" />
                  ) : (
                    <Check size={12} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-0.5">{warning.message}</div>
                  {warning.file && (
                    <div className="text-xs text-muted-foreground">
                      File: {warning.file}{warning.line ? `, Line: ${warning.line}` : ''}
                    </div>
                  )}
                  {warning.suggestion && (
                    <div className="text-xs mt-1">{warning.suggestion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Summary Table */}
        <div>
          <h3 className="text-lg font-medium mb-4">File Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-3 text-sm font-medium">Filename</th>
                  <th className="text-left p-3 text-sm font-medium">Type</th>
                  <th className="text-left p-3 text-sm font-medium">Changes</th>
                  <th className="text-left p-3 text-sm font-medium">Issues</th>
                  <th className="text-left p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.fileSummary.map((file, index) => (
                  <tr key={index} className="hover:bg-muted/20">
                    <td className="p-3 text-sm">{file.fileName}</td>
                    <td className="p-3 text-sm">{file.fileType.toUpperCase()}</td>
                    <td className="p-3 text-sm">{file.changesCount}</td>
                    <td className="p-3 text-sm">
                      {file.jsIssues > 0 ? (
                        <span className="inline-flex items-center bg-amber-500/10 text-amber-700 text-xs px-2 py-1 rounded-full">
                          <AlertTriangle size={10} className="mr-1" /> {file.jsIssues}
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-green-500/10 text-green-700 text-xs px-2 py-1 rounded-full">
                          <Check size={10} className="mr-1" /> None
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{file.fileName}</DialogTitle>
                            <DialogDescription>
                              Migration details for {file.fileName}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Migration Summary</h4>
                              <div className="text-sm space-y-1">
                                <p>File type: {file.fileType.toUpperCase()}</p>
                                <p>Changes made: {file.changesCount}</p>
                                <p>Issues found: {file.jsIssues}</p>
                              </div>
                            </div>
                            
                            {file.aiAnalysis && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-sm">
                                  {file.aiAnalysis}
                                </div>
                              </div>
                            )}
                            
                            {file.warnings && file.warnings.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Issues & Warnings</h4>
                                <div className="space-y-2">
                                  {file.warnings.map((warning, wIndex) => (
                                    <div key={wIndex} className="text-sm border-l-2 border-amber-500 pl-3 py-1">
                                      {warning.message}
                                      {warning.line && (
                                        <span className="text-muted-foreground text-xs"> (Line: {warning.line})</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
