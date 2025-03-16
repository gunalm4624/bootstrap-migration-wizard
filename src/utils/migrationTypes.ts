
/**
 * Migration process steps
 */
export enum MigrationStep {
  IDLE = "idle",
  UPLOADING = "uploading",
  EXTRACTING = "extracting",
  ANALYZING = "analyzing",
  CONVERTING = "converting",
  GENERATING_REPORT = "generating_report",
  COMPLETE = "complete",
  ERROR = "error"
}

/**
 * Migration process status
 */
export interface MigrationStatus {
  step: MigrationStep;
  progress: number; // 0-100
  detail?: string;
  error?: string;
  currentFileName?: string; // Current file being processed
  filesProcessed?: number; // Number of files processed
}

/**
 * Migration results summary
 */
export interface MigrationResults {
  totalFiles: number;
  modifiedFiles: number;
  classesReplaced: number;
  jsIssuesFound: number;
  manualFixesNeeded: number;
  warnings: MigrationWarning[];
  fileSummary: FileSummary[];
}

/**
 * Information about an individual file
 */
export interface FileSummary {
  fileName: string;
  fileType: string;
  changesCount: number;
  jsIssues: number;
  warnings: MigrationWarning[];
}

/**
 * A specific migration warning
 */
export interface MigrationWarning {
  type: "class" | "javascript" | "structure";
  severity: "info" | "warning" | "error";
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

/**
 * Common Bootstrap 3 to 5 class mappings
 */
export const BOOTSTRAP_CLASS_MAPPINGS = {
  // Grid system changes
  "col-xs": "col",
  "col-sm": "col-sm",
  "col-md": "col-md",
  "col-lg": "col-lg",
  "col-xl": "col-xl",
  "offset-xs": "offset",
  "offset-sm": "offset-sm",
  "offset-md": "offset-md",
  "offset-lg": "offset-lg",
  "offset-xl": "offset-xl",
  "container-fluid": "container-fluid",
  
  // Responsive utilities
  "hidden-xs": "d-none d-sm-block",
  "hidden-sm": "d-sm-none d-md-block",
  "hidden-md": "d-md-none d-lg-block",
  "hidden-lg": "d-lg-none d-xl-block",
  "hidden-xl": "d-xl-none",
  "visible-xs": "d-block d-sm-none",
  "visible-sm": "d-none d-sm-block d-md-none",
  "visible-md": "d-none d-md-block d-lg-none",
  "visible-lg": "d-none d-lg-block d-xl-none",
  "visible-xl": "d-none d-xl-block",
  
  // Panels to cards
  "panel": "card",
  "panel-heading": "card-header",
  "panel-title": "card-title",
  "panel-body": "card-body",
  "panel-footer": "card-footer",
  "panel-primary": "card bg-primary text-white",
  "panel-success": "card bg-success text-white",
  "panel-info": "card bg-info text-white",
  "panel-warning": "card bg-warning",
  "panel-danger": "card bg-danger text-white",
  
  // Bootstrap 3 CDN URLs
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.": "https://cdn.jsdelivr.net/npm/bootstrap@5.",
  
  // Wells removed
  "well": "card card-body",
  "well-lg": "card card-body p-5",
  "well-sm": "card card-body p-2",
  
  // Image shapes
  "img-rounded": "rounded",
  "img-circle": "rounded-circle",
  "img-thumbnail": "img-thumbnail",
  
  // Tables
  "table-condensed": "table-sm",
  
  // Forms
  "control-label": "col-form-label",
  "form-group": "mb-3",
  "form-control-static": "form-control-plaintext",
  "help-block": "form-text",
  "input-lg": "form-control-lg",
  "input-sm": "form-control-sm",
  
  // Buttons
  "btn-default": "btn-secondary",
  "btn-xs": "btn-sm",
  "close": "btn-close",
  
  // Utilities
  "pull-left": "float-start",
  "pull-right": "float-end",
  "center-block": "mx-auto d-block",
  "hidden": "d-none",
  "show": "d-block",
  "invisible": "invisible",
  "text-left": "text-start",
  "text-right": "text-end",
  
  // Navs
  "nav-stacked": "flex-column",
  
  // Pagination
  "pagination-lg": "pagination-lg",
  "pagination-sm": "pagination-sm",
  
  // Labels to badges
  "label": "badge",
  "label-default": "bg-secondary text-dark",
  "label-primary": "bg-primary",
  "label-success": "bg-success",
  "label-info": "bg-info",
  "label-warning": "bg-warning text-dark",
  "label-danger": "bg-danger",
  
  // Alerts
  "alert-link": "alert-link",
  
  // List groups
  "list-group-item-heading": "list-group-item-heading",
  "list-group-item-text": "list-group-item-text",
  
  // Modal classes
  "modal-title": "modal-title fs-5",
  
  // Additional mappings
  "navbar-inverse": "navbar-dark bg-dark",
  "navbar-default": "navbar-light bg-light",
  "navbar-toggle": "navbar-toggler",
  "nav-justified": "nav-fill",
  "dropdown-menu-right": "dropdown-menu-end",
  "breadcrumb > li": "breadcrumb-item",
  "carousel-control": "carousel-control-prev carousel-control-next",
  "btn-group-justified": "d-flex w-100",
  "img-responsive": "img-fluid",
  "thumbnail": "img-thumbnail",
  "caret": "dropdown-toggle-icon",
  "dl-horizontal": "row",
  "jumbotron": "p-5 mb-4 bg-light rounded-3"
};

/**
 * Common JavaScript issues when migrating from Bootstrap 3 to 5
 */
export const BOOTSTRAP_JS_ISSUES = [
  {
    pattern: "$.fn.collapse",
    message: "Collapse plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.dropdown",
    message: "Dropdown plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.modal",
    message: "Modal plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.tooltip",
    message: "Tooltip plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.popover",
    message: "Popover plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.tab",
    message: "Tab plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.alert",
    message: "Alert plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.button",
    message: "Button plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.carousel",
    message: "Carousel plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "$.fn.scrollspy",
    message: "Scrollspy plugin usage requires updating to Bootstrap 5 syntax"
  },
  {
    pattern: "data-toggle=",
    message: "data-toggle attribute should be updated to data-bs-toggle"
  },
  {
    pattern: "data-target=",
    message: "data-target attribute should be updated to data-bs-target"
  },
  {
    pattern: "data-dismiss=",
    message: "data-dismiss attribute should be updated to data-bs-dismiss"
  },
  {
    pattern: "data-parent=",
    message: "data-parent attribute should be updated to data-bs-parent"
  },
  {
    pattern: "data-ride=",
    message: "data-ride attribute should be updated to data-bs-ride"
  },
  {
    pattern: "$\\(.*\\)\\.dropdown",
    message: "Replace jQuery dropdown with native JavaScript and data-bs-toggle"
  },
  {
    pattern: "$\\(.*\\)\\.modal",
    message: "Replace with var myModal = new bootstrap.Modal(document.getElementById('myModal'))"
  },
  {
    pattern: "$\\(window\\)\\.on",
    message: "Replace with native window.addEventListener"
  },
  {
    pattern: "affix",
    message: "The Affix plugin has been removed in Bootstrap 5"
  },
  {
    pattern: "data-spy",
    message: "Update scrollspy to use data-bs-spy instead of data-spy"
  }
];

/**
 * Mock migration results for UI development
 */
export const MOCK_MIGRATION_RESULTS: MigrationResults = {
  totalFiles: 42,
  modifiedFiles: 36,
  classesReplaced: 328,
  jsIssuesFound: 12,
  manualFixesNeeded: 5,
  warnings: [
    {
      type: "javascript",
      severity: "warning",
      message: "jQuery dependency found in 8 files",
      suggestion: "Consider replacing jQuery with native JavaScript"
    },
    {
      type: "class",
      severity: "warning",
      message: "Some classes couldn't be automatically migrated",
      suggestion: "Check the file summary for details"
    },
    {
      type: "structure",
      severity: "info",
      message: "Bootstrap 5 uses different grid breakpoints",
      suggestion: "Review your layouts for potential breakpoint issues"
    }
  ],
  fileSummary: [
    {
      fileName: "index.html",
      fileType: "html",
      changesCount: 42,
      jsIssues: 2,
      warnings: [
        {
          type: "javascript",
          severity: "warning",
          message: "jQuery UI datepicker found",
          file: "index.html",
          line: 145,
          suggestion: "Replace with native date picker or Tempus Dominus"
        }
      ]
    },
    {
      fileName: "dashboard.html",
      fileType: "html",
      changesCount: 86,
      jsIssues: 4,
      warnings: [
        {
          type: "class",
          severity: "warning",
          message: "Custom class 'panel-custom' has no direct equivalent",
          file: "dashboard.html",
          line: 78,
          suggestion: "Update to use card component with custom styling"
        }
      ]
    },
    {
      fileName: "styles.css",
      fileType: "css",
      changesCount: 24,
      jsIssues: 0,
      warnings: []
    },
    {
      fileName: "users.jsp",
      fileType: "jsp",
      changesCount: 56,
      jsIssues: 3,
      warnings: [
        {
          type: "structure",
          severity: "error",
          message: "Nested containers detected",
          file: "users.jsp",
          line: 112,
          suggestion: "Remove nested containers as they're not recommended in Bootstrap 5"
        }
      ]
    }
  ]
};
