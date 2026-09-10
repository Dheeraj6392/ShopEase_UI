import { Link } from 'react-router-dom';

const primaryLinks = ['Delivery Areas', 'Careers', 'Customer Support', 'Press', 'ShopEase Blog', 'Recipes', 'Bestsellers'];
const secondaryLinks = ['Privacy Policy', 'Terms of Use', 'Responsible Disclosure Policy', 'Sell on ShopEase', 'Deliver with ShopEase', 'Franchise with ShopEase', 'Investor Relations'];

function Footer() {
  return (
    <footer className="mt-16 border-t border-[#e8e8e8] bg-white text-gray-500">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="text-4xl font-black tracking-tight text-[#f84040]">
            ShopEase<span className="text-[#17202a]">.</span>
          </Link>
          <div className="mt-7 flex items-center gap-5 text-gray-400" aria-label="Social links">
            <a href="#instagram" aria-label="Instagram" className="text-xl transition-colors hover:text-[#f84040]">◎</a>
            <a href="#x" aria-label="X" className="text-xl font-semibold transition-colors hover:text-[#f84040]">X</a>
            <a href="#facebook" aria-label="Facebook" className="text-xl font-bold transition-colors hover:text-[#f84040]">f</a>
            <a href="#linkedin" aria-label="LinkedIn" className="text-xl font-bold transition-colors hover:text-[#f84040]">in</a>
          </div>
          <p className="mt-5 text-sm leading-7 text-gray-500">
            © {new Date().getFullYear()} ShopEase Marketplace
            <br />
            Your everyday shopping companion
          </p>
        </div>

        <nav aria-label="ShopEase links" className="space-y-5">
          <Link to="/" className="block text-sm font-medium text-gray-600 transition-colors hover:text-[#f84040]">Home</Link>
          {primaryLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="block text-sm font-medium text-gray-600 transition-colors hover:text-[#f84040]">
              {link}
            </a>
          ))}
        </nav>

        <nav aria-label="Company links" className="space-y-5">
          {secondaryLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="block max-w-[190px] text-sm font-medium leading-5 text-gray-600 transition-colors hover:text-[#f84040]">
              {link}
            </a>
          ))}
        </nav>

        <div>
          <p className="text-sm font-semibold text-[#17202a]">Download the app</p>
          <div className="mt-4 space-y-3">
            <a href="#play-store" className="flex items-center gap-3 rounded-lg border border-[#e8e8e8] px-5 py-4 text-sm font-semibold text-gray-600 transition-colors hover:border-[#f84040] hover:bg-[#fff1f1]">
              <span className="text-lg text-[#f84040]" aria-hidden="true">▶</span>
              Get it on Play Store
            </a>
            <a href="#app-store" className="flex items-center gap-3 rounded-lg border border-[#e8e8e8] px-5 py-4 text-sm font-semibold text-gray-600 transition-colors hover:border-[#f84040] hover:bg-[#fff1f1]">
              <span className="text-lg text-[#f84040]" aria-hidden="true">●</span>
              Get it on App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;