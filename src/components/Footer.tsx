import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/ankilaki", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ankith-lakshman/",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:ankilaki1020@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[980px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-[13px] text-text-muted">
              Copyright © {new Date().getFullYear()} Ankith Lakshman. All rights
              reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text transition-colors duration-200"
                aria-label={link.label}
              >
                <link.icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
