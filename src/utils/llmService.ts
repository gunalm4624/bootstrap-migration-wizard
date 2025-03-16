
import { toast } from "@/hooks/use-toast";

// Using Hugging Face Inference API (free tier)
const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

interface LLMResponse {
  success: boolean;
  content: string;
  error?: string;
}

export async function analyzeBootstrapCode(
  htmlContent: string, 
  promptType: "analyze" | "convert" | "suggest"
): Promise<LLMResponse> {
  try {
    // Create a prompt based on the requested analysis type
    let prompt = "";
    
    if (promptType === "analyze") {
      prompt = `Analyze this Bootstrap 3 HTML and identify all Bootstrap 3 specific elements, classes, and attributes:
      ${htmlContent.substring(0, 1500)}`;
    } else if (promptType === "convert") {
      prompt = `Convert this Bootstrap 3 HTML to Bootstrap 5. Focus on:
      1. Replacing data-toggle with data-bs-toggle
      2. Replacing data-target with data-bs-target
      3. Replacing data-dismiss with data-bs-dismiss
      4. Fixing modal headers (title before close button)
      5. Replacing .btn-default with .btn-secondary
      6. Updating all deprecated classes
      
      Here's the HTML:
      ${htmlContent.substring(0, 1500)}`;
    } else if (promptType === "suggest") {
      prompt = `Suggest improvements for migrating this Bootstrap 3 code to Bootstrap 5:
      ${htmlContent.substring(0, 1500)}`;
    }

    // Since we're not connecting to a paid API service, we'll simulate the LLM response
    // In a real application, you would connect to an actual LLM API
    const response = await simulateLLMResponse(prompt, promptType, htmlContent);
    return response;
  } catch (error) {
    console.error("LLM service error:", error);
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error in LLM service"
    };
  }
}

// This function simulates an LLM response based on pattern matching
// In a real application, this would be replaced with an actual API call
async function simulateLLMResponse(
  prompt: string, 
  promptType: "analyze" | "convert" | "suggest",
  htmlContent: string
): Promise<LLMResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (promptType === "convert") {
    // Modal conversion logic (special focus on Bootstrap 3 to 5 modal differences)
    const convertedHTML = convertBootstrapModal(htmlContent);
    return {
      success: true,
      content: convertedHTML
    };
  } else if (promptType === "analyze") {
    // Analysis logic
    const issues = analyzeBootstrapIssues(htmlContent);
    return {
      success: true,
      content: issues.join("\n")
    };
  } else {
    // Suggestion logic
    return {
      success: true,
      content: "Consider using native Bootstrap 5 components for modals, dropdowns, and tooltips instead of jQuery plugins. Bootstrap 5 uses vanilla JavaScript and data-bs-* attributes."
    };
  }
}

function convertBootstrapModal(html: string): string {
  let convertedHTML = html;
  
  // Fix modal headers (one of the key differences between Bootstrap 3 and 5)
  const modalHeaderRegex = /<div class=["']modal-header["']>([\s\S]*?)<button[\s\S]*?class=["'](?:.*?)close(?:.*?)["'][\s\S]*?data-dismiss=["']modal["'][\s\S]*?>[\s\S]*?<\/button>([\s\S]*?)<h\d[\s\S]*?class=["'](?:.*?)modal-title(?:.*?)["'][\s\S]*?>([\s\S]*?)<\/h\d>([\s\S]*?)<\/div>/g;
  
  convertedHTML = convertedHTML.replace(modalHeaderRegex, (match, beforeBtn, betweenBtnAndTitle, titleContent, afterTitle) => {
    return `<div class="modal-header">
      <h5 class="modal-title fs-5">${titleContent.trim()}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>`;
  });
  
  // Fix button trigger
  convertedHTML = convertedHTML.replace(/data-toggle=["']modal["']/g, 'data-bs-toggle="modal"');
  convertedHTML = convertedHTML.replace(/data-target=/g, 'data-bs-target=');
  
  // Fix dismiss buttons
  convertedHTML = convertedHTML.replace(/data-dismiss=["']modal["']/g, 'data-bs-dismiss="modal"');
  
  // Change button styles
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)btn-default([^"']*)["']/g, 'class="$1btn-secondary$2"');
  
  return convertedHTML;
}

function analyzeBootstrapIssues(html: string): string[] {
  const issues: string[] = [];
  
  // Check for common Bootstrap 3 patterns
  if (html.includes('data-toggle="modal"')) {
    issues.push("Modal triggers use data-toggle instead of data-bs-toggle");
  }
  
  if (html.includes('class="close"') && html.includes('data-dismiss="modal"')) {
    issues.push("Modal close buttons should use btn-close class instead of close class");
  }
  
  if (html.includes('btn-default')) {
    issues.push("btn-default class should be replaced with btn-secondary");
  }
  
  // Check for jQuery dependencies
  if (html.includes('jquery') || html.includes('jQuery')) {
    issues.push("jQuery dependency detected - Bootstrap 5 doesn't require jQuery");
  }
  
  // Check modal structure
  const modalHeaderClosePattern = /<div class=["']modal-header["']>[\s\S]*?<button[\s\S]*?class=["'][^"']*close[^"']*["'][\s\S]*?data-dismiss=["']modal["'][\s\S]*?>[\s\S]*?<\/button>[\s\S]*?<h\d/;
  if (modalHeaderClosePattern.test(html)) {
    issues.push("Modal header has close button before title - Bootstrap 5 places title first, then close button");
  }
  
  return issues;
}
