import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-lg-5 px-3 py-4">
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-retro-light btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
          title="Back to previous page"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Hero section */}
      <div className="text-center mb-5" style={{ maxWidth: '780px', margin: '0 auto' }}>
        <span className="font-editorial text-muted-retro small d-block mb-1">
          THE RETRO MANIFESTO
        </span>
        <h1 className="display-5 fw-bold mb-3">MENSWEAR CRAFTED TO OUTLAST SEASONS</h1>
        <p className="lead text-muted-retro" style={{ fontSize: '17px' }}>
          Born from a passion for 1960s–1990s tailoring, rugged Japanese selvedge denim, and authentic workwear silhouettes that develop rich character the longer you wear them.
        </p>
      </div>

      <div className="row g-4 align-items-center mb-5">
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
            alt="Atelier and tailoring"
            className="w-100 object-fit-cover border"
            style={{ height: '480px' }}
          />
        </div>
        <div className="col-lg-6 ps-lg-5">
          <span className="font-editorial text-muted-retro small">OUR PHILOSOPHY</span>
          <h2 className="fw-bold mb-3">REJECTING DISPOSABLE FAST FASHION</h2>
          <p className="text-muted small mb-3">
            In an era of disposable garments that disintegrate after five washes, RETRO MEN'S CLOTHING was established with a singular standard: build clothing with the substance, weight, and integrity of 20th-century garments.
          </p>
          <p className="text-muted small mb-4">
            We partner with boutique heritage mills in Okayama, Japan and Coimbatore, India that utilize vintage shuttle looms and sustainable plant-based indigo baths. Every jacket, trouser, and shirt is constructed using reinforced felled seams and solid brass hardware.
          </p>

          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-white border">
                <div className="fw-bold fs-5">280–450 GSM</div>
                <div className="text-muted small">Heavyweight Organic Textiles</div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-white border">
                <div className="fw-bold fs-5">Zero</div>
                <div className="text-muted small">Synthetic Fillers & Microplastics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="py-5 border-top">
        <div className="text-center mb-5">
          <span className="font-editorial text-muted-retro small">OUR PRINCIPLES</span>
          <h2 className="fw-bold">THE THREE ARCHIVAL PILLARS</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 bg-white border rounded-1 h-100">
              <ShieldCheck size={32} className="text-dark mb-3" />
              <h3 className="h5 fw-bold font-editorial mb-2">1. HISTORIC FIDELITY</h3>
              <p className="text-muted small mb-0">
                We study genuine vintage military, workwear, and Ivy League artifacts to reproduce correct collar rolls, box pleats, pocket placements, and authentic proportions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white border rounded-1 h-100">
              <Sparkles size={32} className="text-dark mb-3" />
              <h3 className="h5 fw-bold font-editorial mb-2">2. NATURAL TEXTURE</h3>
              <p className="text-muted small mb-0">
                Slubby yarns, ring-spun twills, and raw selvedge denim that gracefully fade with time and wear, creating a patina that is uniquely personal to you.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white border rounded-1 h-100">
              <Heart size={32} className="text-dark mb-3" />
              <h3 className="h5 fw-bold font-editorial mb-2">3. RESPONSIBLE PRODUCTION</h3>
              <p className="text-muted small mb-0">
                Small-batch runs ensure zero deadstock waste. Our artisans earn dignified living wages and take personal pride in every stitch.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-5">
        <Link to="/shop" className="btn btn-retro-dark py-3 px-5">
          EXPLORE THE ARCHIVE CATALOG <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
