
import React from 'react';
import { Button } from "@/components/ui/button";

interface ToastApiKeyActionProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ToastApiKeyAction: React.FC<ToastApiKeyActionProps> = ({ onApiKeySubmit }) => {
  const handleClick = () => {
    const apiKey = prompt("Enter your OpenAI API key:");
    if (apiKey) {
      onApiKeySubmit(apiKey);
    }
  };

  return (
    <div className="flex items-center">
      <Button 
        onClick={handleClick}
        className="bg-primary text-white px-3 py-1 rounded text-xs"
        size="sm"
      >
        Enter API Key
      </Button>
    </div>
  );
};

// For use in non-React contexts (optional helper function)
export function renderToastApiKeyAction(onSubmit: (apiKey: string) => void): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'flex items-center';
  
  const button = document.createElement('button');
  button.textContent = 'Enter API Key';
  button.className = 'bg-primary text-white px-3 py-1 rounded text-xs';
  button.onclick = () => {
    const apiKey = prompt("Enter your OpenAI API key:");
    if (apiKey) {
      onSubmit(apiKey);
    }
  };
  
  container.appendChild(button);
  return container;
}
