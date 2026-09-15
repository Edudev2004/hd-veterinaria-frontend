import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Royal Canin', type: 'Nutrición' },
  { name: "Hill's", type: 'Nutrición' },
  { name: 'Zoetis', type: 'Laboratorio' },
  { name: 'Bayer', type: 'Farma' },
  { name: 'Purina Pro Plan', type: 'Nutrición' },
  { name: 'Idexx', type: 'Diagnóstico' },
  { name: 'MSD Animal Health', type: 'Farma' },
  { name: 'Virbac', type: 'Farma' },
];

export const BrandsCarousel: React.FC = () => {
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <div className="w-full bg-slate-50 py-10 border-y border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-5 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Trabajamos con los mejores laboratorios y marcas del mundo
        </p>
      </div>

      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <div className="flex w-fit">
        <motion.div
          className="flex gap-12 sm:gap-20 items-center pr-12 sm:pr-20"
          animate={{ x: ['0%', '-33.333333%'] }}
          transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
        >
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300 min-w-max cursor-default"
            >
              <span className="text-xl sm:text-2xl font-bold text-slate-600 tracking-tight whitespace-nowrap">
                {brand.name}
              </span>
              <span className="text-[10px] sm:text-xs text-[#0D7C84] font-medium tracking-widest uppercase mt-1">
                {brand.type}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
