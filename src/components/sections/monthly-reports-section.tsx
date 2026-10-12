"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  getLatestMonthlyReports,
  LATEST_REPORT_MONTH,
  LATEST_REPORT_YEAR,
} from "@/data/monthly-reports-data";

export default function MonthlyReportsSection() {
  const reports = useMemo(() => getLatestMonthlyReports(), []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const itemsPerPage = isDesktop ? 3 : 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isDesktop]);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setModalIndex((prev) => (prev > 0 ? prev - 1 : prev));
    },
    []
  );

  const handleModalNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setModalIndex((prev) => (prev < reports.length - 1 ? prev + 1 : prev));
    },
    [reports.length]
  );

  // Manage body scroll & keyboard navigation when modal is open
  useEffect(() => {
    if (!mounted) return;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeModal();
        } else if (e.key === "ArrowLeft") {
          handleModalPrev();
        } else if (e.key === "ArrowRight") {
          handleModalNext();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen, mounted, closeModal, handleModalPrev, handleModalNext]);

  if (reports.length === 0) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
      {/* --- Section Header --- */}
      <div className="flex flex-col items-center text-center max-w-3xl mb-8 md:mb-12">
        <p className="font-formular-bold text-xs md:text-sm uppercase tracking-widest text-gold1 mb-2">
          Transparency &amp; Accountability
        </p>

        <h2 className="font-formular-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-mainmaroon uppercase tracking-wide">
          Monthly Status Reports
        </h2>

        <p className="font-formular mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed max-w-2xl">
          Stay informed on the monthly accomplishments, initiatives, and
          executive updates of the student body. Browse through our latest
          official documentation below.
        </p>

        {/* Latest Month Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mainmaroon/10 border border-mainmaroon/20 text-mainmaroon text-xs sm:text-sm font-formular-bold">
          <span className="w-2 h-2 rounded-full bg-mainmaroon animate-pulse" />
          <span>
            Latest Release: <strong>{LATEST_REPORT_MONTH} {LATEST_REPORT_YEAR}</strong> ({reports.length} Reports)
          </span>
        </div>
      </div>

      {/* --- Mobile View Controls (Arrows & Pagination Info) --- */}
      <div className="lg:hidden flex items-center justify-between w-full max-w-md px-2 mb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-mainmaroon text-white transition-opacity ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gold1 cursor-pointer"
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="font-formular-medium text-xs sm:text-sm text-mainmaroon">
          Slide {currentIndex + 1} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex >= totalPages - 1}
          className={`p-2 rounded-full bg-mainmaroon text-white transition-opacity ${
            currentIndex >= totalPages - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gold1 cursor-pointer"
          }`}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* --- Desktop Carousel --- */}
      <div className="hidden lg:flex items-center justify-center gap-6 w-full max-w-6xl mx-auto">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-shrink-0 p-3 rounded-xl bg-mainmaroon text-white transition-all duration-300 shadow-md ${
            currentIndex === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gold1 hover:scale-105 cursor-pointer"
          }`}
          aria-label="Previous reports"
        >
          <ChevronLeft size={26} />
        </button>

        {/* Slides Track */}
        <div className="flex-1 overflow-hidden py-2">
          <div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% - ${
                currentIndex * 1.5
              }rem))`,
            }}
          >
            {reports.map((item, index) => (
              <div
                key={item.id}
                className="w-[calc(33.333%-1rem)] flex-shrink-0"
              >
                <div
                  onClick={() => openModal(index)}
                  className="group relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200/80"
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.altText}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-white text-xs font-formular-bold">
                      Report #{index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-formular-medium bg-mainmaroon/80 px-2 py-1 rounded-md backdrop-blur-sm">
                      <Maximize2 size={12} />
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= totalPages - 1}
          className={`flex-shrink-0 p-3 rounded-xl bg-mainmaroon text-white transition-all duration-300 shadow-md ${
            currentIndex >= totalPages - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gold1 hover:scale-105 cursor-pointer"
          }`}
          aria-label="Next reports"
        >
          <ChevronRight size={26} />
        </button>
      </div>

      {/* --- Mobile View - 1 Card per Slide --- */}
      <div className="lg:hidden flex flex-col items-center justify-center w-full px-2">
        <div className="w-full max-w-md overflow-hidden py-2">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {reports.map((item, index) => (
              <div key={item.id} className="w-full flex-shrink-0 px-2">
                <div
                  onClick={() => openModal(index)}
                  className="group relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-gray-200"
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.altText}
                    fill
                    sizes="(max-width: 1024px) 90vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-white text-xs font-formular-medium bg-mainmaroon/80 px-2.5 py-1 rounded-lg backdrop-blur-sm shadow">
                    <Maximize2 size={12} />
                    Tap to view
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Desktop Pagination Indicators --- */}
      <div className="hidden lg:flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? "w-8 h-2.5 bg-mainmaroon"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide page ${idx + 1}`}
          />
        ))}
      </div>

      {/* --- Call to Action Link to All Reports --- */}
      <div className="mt-8 md:mt-12 flex justify-center">
        <Link
          href="/information-portal/monthly-reports"
          className="group inline-flex items-center justify-center gap-3 bg-mainmaroon hover:bg-gold1 text-white font-formular-bold text-sm md:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <span>View All Monthly Reports</span>
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* --- EXPANDED MODAL LIGHTBOX VIEW --- */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in duration-300 backdrop-blur-md bg-mainmaroon/80"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-50 cursor-pointer"
              aria-label="Close report viewer"
            >
              <X size={32} />
            </button>

            {/* Modal Content */}
            <div
              className="relative w-full h-full flex items-center justify-center max-w-6xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handleModalPrev}
                disabled={modalIndex === 0}
                className={`absolute left-2 lg:left-4 z-50 p-2 text-mainmaroon bg-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                  modalIndex === 0 ? "hidden" : "block"
                }`}
                aria-label="Previous report"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center select-none">
                <Image
                  src={reports[modalIndex].imageSrc}
                  alt={reports[modalIndex].altText}
                  width={1200}
                  height={1200}
                  className="object-contain max-h-[85vh] max-w-full w-auto h-auto rounded-xl shadow-2xl"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleModalNext}
                disabled={modalIndex === reports.length - 1}
                className={`absolute right-2 lg:right-4 z-50 p-2 text-mainmaroon bg-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                  modalIndex === reports.length - 1 ? "hidden" : "block"
                }`}
                aria-label="Next report"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm font-formular-medium tracking-widest bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              {modalIndex + 1} / {reports.length}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
