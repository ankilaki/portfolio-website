import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/ankilaki", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ankith-lakshman/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ankilaki1020@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-lg font-semibold text-text">
              Ankith Lakshman<span className="text-accent">.</span>
            </p>
            <p className="text-sm text-text-muted mt-1.5">
              Crafting the future through code & robotics
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-border hover:border-accent/30 hover:bg-accent-muted transition-all duration-200 text-text-muted hover:text-accent"
                aria-label={link.label}
              >
                <link.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Ankith Lakshman. All rights reserved. Built with
            React & Firebase.
          </p>
        </div>
      </div>
    </footer>
  );
}
