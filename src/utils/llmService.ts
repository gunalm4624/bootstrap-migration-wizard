import { toast } from "@/hooks/use-toast";
import { ToastActionElement } from "@/components/ui/toast";
import { renderToastApiKeyAction } from "@/utils/ToastApiKeyAction";

// Using OpenAI API for improved migration quality
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini"; // Using GPT-4o Mini for good balance of speed and quality

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
      ${htmlContent.substring(0, 2000)}`;
    } else if (promptType === "convert") {
      prompt = `Convert this Bootstrap 3 HTML to Bootstrap 5. Be comprehensive and precise, focusing on:
      1. Replacing data-toggle with data-bs-toggle
      2. Replacing data-target with data-bs-target
      3. Replacing data-dismiss with data-bs-dismiss
      4. Fixing modal headers (title before close button)
      5. Replacing .btn-default with .btn-secondary
      6. Updating all link elements and their attributes
      7. Updating all deprecated classes
      8. Ensuring proper attribute order for accessibility
      
      Here's the HTML:
      ${htmlContent.substring(0, 2000)}`;
    } else if (promptType === "suggest") {
      prompt = `Suggest improvements for migrating this Bootstrap 3 code to Bootstrap 5, especially focusing on:
      1. Modal structure changes
      2. Link and navigation component changes
      3. Form controls updates
      4. JavaScript component initialization differences
      5. Removing jQuery dependencies
      
      Here's the HTML:
      ${htmlContent.substring(0, 2000)}`;
    }

    // First try to use OpenAI API
    try {
      const openAiResponse = await callOpenAIAPI(prompt, promptType);
      return openAiResponse;
    } catch (error) {
      console.warn("OpenAI API error, falling back to simulation:", error);
      // Fallback to simulated response
      const simulatedResponse = await simulateLLMResponse(prompt, promptType, htmlContent);
      return simulatedResponse;
    }
  } catch (error) {
    console.error("LLM service error:", error);
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error in LLM service"
    };
  }
}

async function callOpenAIAPI(prompt: string, promptType: "analyze" | "convert" | "suggest"): Promise<LLMResponse> {
  try {
    // In a production app, this should be handled by a server-side API to protect API keys
    // For demo purposes, we're using a frontend approach
    const apiKey = localStorage.getItem('openai_api_key') || "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";
    
    if (!apiKey) {
      // If no API key, show an input to collect it
      promptForAPIKey();
      throw new Error("OpenAI API key not found");
    }
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: promptType === "convert" 
              ? "You are an expert in Bootstrap migration who converts Bootstrap 3 code to Bootstrap 5. Respond only with the converted HTML, nothing else."
              : "You are an expert in Bootstrap frameworks who provides detailed technical analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

function promptForAPIKey() {
  // This will be shown only if API key is missing
  setTimeout(() => {
    toast({
      title: "OpenAI API Key Required",
      description: "Please enter your OpenAI API key in the settings to enable AI-powered migration.",
      variant: "default",
      action: renderToastApiKeyAction((apiKey) => {
        localStorage.setItem('openai_api_key', apiKey);
        window.location.reload();
      }) as unknown as ToastActionElement,
      duration: 10000,
    });
  }, 1000);
}

// This function simulates an LLM response based on pattern matching
// Used as a fallback when OpenAI API is not available
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
      content: "Consider updating link elements to use the new Bootstrap 5 syntax. For navigation components, update navbar classes to the new structure. Bootstrap 5 uses vanilla JavaScript and data-bs-* attributes instead of jQuery."
    };
  }
}

function convertBootstrapModal(html: string): string {
  let convertedHTML = html;
  
  // Comprehensive CDN replacement (improved)
  const cdnPatterns = [
    // CSS CDN patterns
    {
      pattern: /<link[^>]*href=["'](https?:\/\/(?:maxcdn|stackpath|netdna|cdn)\.bootstrapcdn\.com\/bootstrap\/3[^"']*|https?:\/\/cdn\.jsdelivr\.net\/(?:npm|bootstrap)\/bootstrap@3[^"']*)["'][^>]*>/gi,
      replacement: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">'
    },
    // JavaScript CDN patterns
    {
      pattern: /<script[^>]*src=["'](https?:\/\/(?:maxcdn|stackpath|netdna|cdn)\.bootstrapcdn\.com\/bootstrap\/3[^"']*|https?:\/\/cdn\.jsdelivr\.net\/(?:npm|bootstrap)\/bootstrap@3[^"']*)["'][^>]*>/gi,
      replacement: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>'
    },
    // jQuery removal suggestion with Bootstrap 5 (No direct replacement as BS5 doesn't need jQuery)
    {
      pattern: /<script[^>]*src=["']https?:\/\/(?:code\.jquery\.com\/jquery|cdnjs\.cloudflare\.com\/ajax\/libs\/jquery)[^"']*["'][^>]*>/gi,
      replacement: '<!-- Bootstrap 5 does not require jQuery - Removed jQuery dependency -->'
    }
  ];
  
  // Apply all CDN replacements
  cdnPatterns.forEach(({ pattern, replacement }) => {
    convertedHTML = convertedHTML.replace(pattern, replacement);
  });
  
  // Fix modal headers (one of the key differences between Bootstrap 3 and 5)
  const modalHeaderRegex = /<div class=["']modal-header["']>[\s\S]*?<button[\s\S]*?class=["'][^"']*close[^"']*["'][\s\S]*?data-dismiss=["']modal["'][\s\S]*?>[\s\S]*?<\/button>[\s\S]*?<h\d[\s\S]*?class=["'](?:.*?)modal-title(?:.*?)["'][\s\S]*?>([\s\S]*?)<\/h\d>([\s\S]*?)<\/div>/g;
  
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
  
  // Fix links - Enhanced navbar and navigation components handling
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)navbar-toggle([^"']*)["']/g, 'class="$1navbar-toggler$2"');
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)nav-stacked([^"']*)["']/g, 'class="$1flex-column$2"');
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)navbar-inverse([^"']*)["']/g, 'class="$1navbar-dark bg-dark$2"');
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)navbar-default([^"']*)["']/g, 'class="$1navbar-light bg-light$2"');
  
  // Fix link elements (a tags with Bootstrap classes)
  convertedHTML = convertedHTML.replace(/<a([^>]*)class=["']([^"']*)(btn-default)([^"']*)["']([^>]*)>/g, '<a$1class="$2btn-secondary$4"$5>');
  convertedHTML = convertedHTML.replace(/<a([^>]*)class=["']([^"']*)(navbar-brand)([^"']*)["']([^>]*)>/g, '<a$1class="$2navbar-brand$4"$5>');
  
  // Fix dropdown components
  convertedHTML = convertedHTML.replace(/data-toggle=["']dropdown["']/g, 'data-bs-toggle="dropdown"');
  convertedHTML = convertedHTML.replace(/class=["']([^"']*)dropdown-menu-right([^"']*)["']/g, 'class="$1dropdown-menu-end$2"');
  
  // Fix special cases for links in navbars
  convertedHTML = convertedHTML.replace(/<ul class=["']nav navbar-nav["']/g, '<ul class="navbar-nav">');
  convertedHTML = convertedHTML.replace(/<li([^>]*)class=["']([^"']*)active([^"']*)["']([^>]*)>/g, '<li$1class="$2active nav-item$3"$4>');
  convertedHTML = convertedHTML.replace(/<li([^>]*)>/g, '<li$1 class="nav-item">');
  
  // Add nav-link to navbar links that don't have it
  const navbarLinkRegex = /<ul class=["']navbar-nav["'][^>]*>[\s\S]*?<li[^>]*class=["'][^"']*nav-item[^"']*["'][^>]*>[\s\S]*?<a([^>]*)class=["']([^"']*?)["']([^>]*)>/g;
  convertedHTML = convertedHTML.replace(navbarLinkRegex, (match, before, classes, after) => {
    if (!classes.includes('nav-link')) {
      return match.replace(
        `class="${classes}"`, 
        `class="${classes} nav-link"`
      );
    }
    return match;
  });
  
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
  
  // Check for link-related issues
  if (html.includes('navbar-toggle')) {
    issues.push("navbar-toggle class should be replaced with navbar-toggler");
  }
  
  if (html.includes('nav-stacked')) {
    issues.push("nav-stacked class should be replaced with flex-column");
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
  
  // Check for link-specific issues
  if (html.includes('<ul class="nav navbar-nav"')) {
    issues.push("'nav navbar-nav' should be replaced with 'navbar-nav'");
  }
  
  if (html.includes('<li class="active"')) {
    issues.push("List items in navbars should have 'nav-item' class alongside 'active'");
  }
  
  if (html.includes('<a') && !html.includes('nav-link') && html.includes('navbar-nav')) {
    issues.push("Links in navbar need 'nav-link' class in Bootstrap 5");
  }
  
  return issues;
}
