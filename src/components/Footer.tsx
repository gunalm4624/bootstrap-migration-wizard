
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Bootstrap Migration Wizard</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              The easiest way to upgrade your Bootstrap 3 projects to Bootstrap 5.
              Free, open-source, and built with modern web technologies.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://getbootstrap.com/docs/5.3/migration/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bootstrap Migration Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://getbootstrap.com/docs/5.3/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bootstrap 5 Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://getbootstrap.com/docs/3.4/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bootstrap 3 Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bootstrap Migration Wizard. All rights reserved.</p>
          <p className="mt-2">
            Made with precision and care for the web development community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
