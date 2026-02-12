import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-credit">
          Made with <Heart size={14} className="footer-heart" /> for{" "}
          <a
            href="https://hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Hack Club
          </a>
        </span>
        <span className="footer-separator">·</span>
        <a
          href="https://github.com/vaibhavcoding69/utility-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Source Code
        </a>
      </div>
    </footer>
  );
}

export default Footer;
