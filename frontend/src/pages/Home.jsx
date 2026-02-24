export default function Home() {
  return (
    <main className="max-w-7xl pt-12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="relative overflow-hidden mb-16 min-h-[600px] flex items-center bg-navy text-white">
        <div className="absolute inset-0 z-0">
          <img 
            alt="High Motion Cricketer" 
            className="w-full h-full object-cover opacity-70" 
            src="https://www.4to40.com/wp-content/uploads/2016/03/cricket-facebook-covers.jpg"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-950 opacity-40"></div>
          <div className="absolute inset-0 z-10 mesh-texture opacity-20"></div>
        </div>
        <div className="relative z-15 max-w-4xl px-24 py-24">
          <h2 className="text-4xl md:text-6xl font-black leading-none mb-6 italic">
            WELCOME TO <br/>
            <span className="text-white text-7xl md:text-9xl relative">
              CRICK<span className="text-primary">CART</span>
              <span className="hero-underline"></span>
            </span>
          </h2>
          <div className="mb-10 mt-10 border-l-4 border-primary pl-6 py-2 pt-4">
            <p className="text-xl font-bold italic text-slate-300">DOMINATE THE FIELD WITH PRO-GRADE GEAR.</p>
            <p className="text-slate-400 italic max-w-md mt-2 font-medium">Engineered for performance. Trusted by legends. Elevate your game with our high-octane collection.</p>
          </div>
          
          <button className="px-12 py-5 bg-primary text-navy font-black text-xl italic hover:bg-white transform -skew-x-12 transition-all flex items-center gap-4 group">
            <span className="transform skew-x-12 flex items-center gap-2">
              EXPLORE GEAR <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">bolt</span>
            </span>
          </button>
          
        </div>
      </section>
    </main>
  );
}