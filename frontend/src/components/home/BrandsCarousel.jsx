import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import brandService from '../../services/brandService'; 

const BrandTile = ({ brand }) => (
  <Link
    to={`/products?brand=${brand._id}`}
    className="group flex-shrink-0 flex flex-col items-center justify-center gap-3
               w-40 h-28 mx-4 rounded-xl border-2 border-transparent
               bg-white dark:bg-slate-900
               hover:border-[#00a8e8] hover:shadow-[0_0_24px_rgba(0,168,232,0.18)]
               transition-all duration-300 cursor-pointer px-4"
  >
    <div className="w-14 h-14 flex items-center justify-center">
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-full h-full object-contain transition-all duration-300"          draggable={false}
        />
      ) : (
        <span className="text-3xl font-black italic text-slate-300 group-hover:text-[#00a8e8] transition-colors duration-300">
          {brand.name?.[0]}
        </span>
      )}
    </div>

    <p className="text-xs font-black italic tracking-widest uppercase text-slate-400 group-hover:text-[#00a8e8] transition-colors duration-300 text-center leading-tight">
      {brand.name}
    </p>
  </Link>
);

const SkeletonRow = () => (
  <div className="flex gap-8 px-4">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="flex-shrink-0 w-40 h-28 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"
      />
    ))}
  </div>
);

const MarqueeTrack = ({ brands, speed = 40, reverse = false }) => {
  const trackRef  = useRef(null);
  const rafRef    = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  const items = [...brands, ...brands, ...brands];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += reverse ? -(speed / 60) : speed / 60;

        const singleW = track.scrollWidth / 3;
        if (!reverse && posRef.current >= singleW) posRef.current = 0;
        if (reverse  && posRef.current <= 0)       posRef.current = singleW;

        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, reverse]);

  return (
    <div
      className="overflow-hidden w-full relative"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                      bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                      bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent" />

      <div ref={trackRef} className="flex will-change-transform py-2">
        {items.map((brand, i) => (
          <BrandTile key={`${brand.id}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  );
};

const BrandsCarousel = () => {
  const [brands,  setBrands]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await brandService.getBrands();
        setBrands(data.data || []);
      } catch {
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <section className="mb-20 relative">
      <div className="mb-10 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-4xl md:text-5xl font-black italic text-[#00171f] dark:text-white leading-none">
          TOP BRANDS
        </h2>
        <p className="text-[#00a8e8] font-bold italic tracking-widest mt-1">
          GEAR FROM THE BEST
        </p>
      </div>

      {loading && (
        <div className="flex flex-col gap-6">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {!loading && brands.length > 0 && (
        <div className="flex flex-col gap-5">
          <MarqueeTrack brands={brands} speed={35} reverse={true} />
        </div>
      )}
      {!loading && brands.length === 0 && (
        <div className="text-center py-20 text-slate-400 italic">
          No brands found.
        </div>
      )}
    </section>
  );
};

export default BrandsCarousel;