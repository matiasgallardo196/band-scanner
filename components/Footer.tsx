import Link from "next/link";
import { Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black/80 backdrop-blur-md border-t border-white/10 py-4 px-6 md:px-12 text-white/70 text-xs md:text-sm fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-medium tracking-wide">
          DEVELOPED BY <span className="text-white font-bold">Matias Gallardo</span> - Full-stack development & design
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="https://www.linkedin.com/in/matiasgallardo-dev" 
            target="_blank" 
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Linkedin size={16} />
            <span className="hidden sm:inline">matiasgallardo-dev</span>
          </Link>
          
          <Link 
            href="mailto:matiasgallardo196@gmail.com" 
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">matiasgallardo196@gmail.com</span>
          </Link>
          
          <Link 
            href="tel:+61431269954" 
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">+61 431 269 954</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
