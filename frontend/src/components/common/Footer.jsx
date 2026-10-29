import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, RotateCcw } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const policyContent = {
    terms: {
      title: 'Terms & Conditions',
      icon: <FileText size={22} className="text-dark" />,
      content: (
        <>
          <p className="mb-3">
            Welcome to <strong>RETRO MEN'S CLOTHING</strong>. By accessing or using our website, services, and purchasing products from our catalog, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h6 className="fw-bold mt-3 mb-2">1. Garment Specifications & Sizing</h6>
          <p className="text-muted small mb-3">
            All garments are crafted in limited batches using authentic 100% organic cotton and shuttle-loom denim. Minor natural slub variations are inherent characteristics of selvedge weaving and are not defects. Please refer to our interactive Size Guide prior to checkout.
          </p>
          <h6 className="fw-bold mt-3 mb-2">2. Pricing & Orders</h6>
          <p className="text-muted small mb-3">
            Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to cancel or refuse any order in the event of stock discrepancy or payment authorization issues.
          </p>
          <h6 className="fw-bold mt-3 mb-2">3. Shipping & Delivery</h6>
          <p className="text-muted small mb-0">
            Orders are processed and dispatched within 24–48 hours across India via verified express logistics partners. Estimated transit time ranges between 2 to 5 business days.
          </p>
        </>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck size={22} className="text-dark" />,
      content: (
        <>
          <p className="mb-3">
            At <strong>RETRO MEN'S CLOTHING</strong>, we take the confidentiality and privacy of our customers seriously. We never sell, rent, or lease your personal data to third parties.
          </p>
          <h6 className="fw-bold mt-3 mb-2">1. Information We Collect</h6>
          <p className="text-muted small mb-3">
            When you register, place an order, or browse our shop, we collect necessary contact information (name, delivery address, phone number, email) to process fulfillment and communicate order updates.
          </p>
          <h6 className="fw-bold mt-3 mb-2">2. Payment & Data Security</h6>
          <p className="text-muted small mb-3">
            All customer authentication is secured with industry-standard bcrypt hashing and encrypted JSON Web Tokens (JWT). We do not store sensitive payment card details on our local database.
          </p>
          <h6 className="fw-bold mt-3 mb-2">3. Communications</h6>
          <p className="text-muted small mb-0">
            We will only contact you regarding active orders, delivery tracking notifications, or customer service queries requested via our concierge channel.
          </p>
        </>
      )
    },
    refund: {
      title: 'Refund & Return Policy',
      icon: <RotateCcw size={22} className="text-dark" />,
      content: (
        <>
          <p className="mb-3">
            We stand behind the craftsmanship of every garment. If you are not completely satisfied with your purchase, our <strong>15-Day Return & Exchange Guarantee</strong> ensures a seamless resolution.
          </p>
          <h6 className="fw-bold mt-3 mb-2">1. Eligibility Criteria</h6>
          <p className="text-muted small mb-3">
            Items must be unworn, unwashed, with all original tags attached and in their original packaging. Return requests must be initiated within 15 days of parcel delivery.
          </p>
          <h6 className="fw-bold mt-3 mb-2">2. Exchanges & Sizing Swaps</h6>
          <p className="text-muted small mb-3">
            Need a different waist or chest fit? Complimentary doorstep size exchanges are provided for all selvedge denim, shirts, and jackets across India.
          </p>
          <h6 className="fw-bold mt-3 mb-2">3. Refund Processing</h6>
          <p className="text-muted small mb-0">
            Upon quality inspection of the returned garment at our fulfillment warehouse, refunds are disbursed directly to your original payment method or bank account within 3–5 business days.
          </p>
        </>
      )
    }
  };

  return (
    <>
      <footer className="main-footer">
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-4 align-items-start justify-content-between">
            {/* Column 1: Brand Logo, Tagline & Social Icons */}
            <div className="col-lg-5 col-md-6">
              <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#171717',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '15px',
                    letterSpacing: '0.05em'
                  }}
                >
                  R
                </div>
                <div>
                  <span className="brand-logo">RETRO</span>
                  <span className="brand-sublogo">MEN'S CLOTHING</span>
                </div>
              </Link>

              <p className="footer-desc mb-4">
                Empowering modern wardrobes with timeless vintage-inspired tailoring, authentic Japanese selvedge denim, and archival menswear crafted to outlast fast fashion trends.
              </p>

              {/* Social Media Icons (Facebook, YouTube, Instagram, LinkedIn) */}
              <div className="d-flex align-items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Legal */}
            <div className="col-lg-3 col-md-3 col-6">
              <div className="footer-heading">Legal</div>
              <button
                type="button"
                className="footer-link"
                onClick={() => setActiveModal('terms')}
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                className="footer-link"
                onClick={() => setActiveModal('privacy')}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="footer-link"
                onClick={() => setActiveModal('refund')}
              >
                Refund Policy
              </button>
            </div>

            {/* Column 3: Contact Us */}
            <div className="col-lg-4 col-md-3 col-12">
              <div className="footer-heading">Contact Us</div>
              <p className="footer-address mb-2">
                155b, Government Hospital Opposite, Baner Hwy Side Rd, Perundurai, Erode, Tamil Nadu 638052
              </p>
              <div className="small text-muted mb-2">
                <strong>Contact Person:</strong> Sarku
              </div>
              <div>
                <a href="mailto:contact@retromens.com" className="footer-email-link">
                  contact@retromens.com
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-5 pt-3 border-top border-light-subtle d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <div className="small text-muted" style={{ fontSize: '12.5px' }}>
              © {CURRENT_YEAR} RETRO MEN'S CLOTHING. All rights reserved.
            </div>
            <div className="d-flex gap-3 small text-muted" style={{ fontSize: '12.5px' }}>
              <Link to="/about" className="text-muted text-decoration-none">About Us</Link>
              <span>•</span>
              <Link to="/contact" className="text-muted text-decoration-none">Concierge</Link>
              <span>•</span>
              <Link to="/shop" className="text-muted text-decoration-none">Catalog</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {activeModal && policyContent[activeModal] && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1060 }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px' }}
          >
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '8px' }}>
              <div className="modal-header border-bottom px-4 py-3 align-items-center">
                <div className="d-flex align-items-center gap-2">
                  {policyContent[activeModal].icon}
                  <h5 className="modal-title fw-bold mb-0" style={{ fontSize: '18px' }}>
                    {policyContent[activeModal].title}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setActiveModal(null)}
                ></button>
              </div>
              <div className="modal-body px-4 py-3" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                {policyContent[activeModal].content}
              </div>
              <div className="modal-footer border-top px-4 py-2 bg-light">
                <button
                  type="button"
                  className="btn btn-dark btn-sm px-4 py-1"
                  onClick={() => setActiveModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
