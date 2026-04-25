import {
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Star,
  Hammer,
  ClipboardList,
  Container,
  Waves,
  Wrench,
  Layers,
  Home,
  ArrowRight,
  MessageSquare,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Lock,
  ChevronDown,
  PhoneCall,
  Mail,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, Variants, useInView, useMotionValue, useSpring } from 'motion/react';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: custom * 0.1
    }
  })
};

function FadeUp({ children, className, custom = 0 }: { children: React.ReactNode, className?: string, custom?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUpVariants}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ from = 0, to, duration = 2, delay = 0, prefix = "", suffix = "" }: { from?: number, to: number, duration?: number, delay?: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => {
        motionValue.set(to);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [inView, to, delay, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.round(latest).toString() + suffix;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref}>{prefix}{from}{suffix}</span>;
}

function ServiceCard({ icon: Icon, title, description, shortDescription, features, custom, className = "" }: { icon: any, title: string, description: string, shortDescription: string, features: string[], custom: number, className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <FadeUp custom={custom} className={`bg-white rounded-xl shadow-sm border border-verde/5 border-t-[3px] border-t-transparent flex flex-col transform transition-all duration-300 ease-out hover:-translate-y-[6px] active:-translate-y-[6px] hover:shadow-xl active:shadow-xl hover:border-t-arcilla active:border-t-arcilla hover:border-x-arcilla/20 hover:border-b-arcilla/20 active:border-x-arcilla/20 active:border-b-arcilla/20 group cursor-pointer overflow-hidden ${className}`}>
      <div 
        className="p-5 md:p-8 md:p-10 flex flex-col h-full"
        onClick={handleClick}
      >
        {/* Mobile Header */}
        <div className={`flex md:hidden items-center gap-4 ${isExpanded ? 'mb-6' : ''}`}>
           <div className={`w-12 h-12 shrink-0 rounded-xl bg-crema text-arcilla flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-arcilla text-white' : 'group-hover:bg-arcilla group-hover:text-white'}`}>
              <Icon className="w-6 h-6" strokeWidth={1.5} />
           </div>
           <div className="flex flex-col flex-grow overflow-hidden">
             <h3 className="text-base font-serif font-bold text-verde truncate">{title}</h3>
             {!isExpanded && (
               <p className="text-[13px] text-antracita/60 truncate font-medium">
                 {shortDescription}
               </p>
             )}
           </div>
           <div className={`shrink-0 ml-1 transition-transform duration-300 text-arcilla ${isExpanded ? 'rotate-90' : ''}`}>
             <ChevronRight className="w-5 h-5" />
           </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-crema text-arcilla flex items-center justify-center mb-6 group-hover:bg-arcilla group-hover:text-white transition-all duration-300 group-hover:rotate-[5deg] group-active:rotate-[5deg]">
            <Icon className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-verde mb-4">{title}</h3>
        </div>

        {/* Content (always visible on desktop, conditionally animated on mobile) */}
        <div className={`flex-col flex-grow transition-all duration-500 ease-in-out md:opacity-100 md:max-h-none md:flex ${!isMobile || isExpanded ? 'opacity-100 max-h-[1000px] flex' : 'opacity-0 max-h-0 hidden'}`}>
           <div className="mb-4 bg-crema/50 border-l-4 border-arcilla p-4 rounded-r-lg">
              <p className="text-antracita/80 leading-relaxed font-medium text-sm md:text-base">
                {description}
              </p>
            </div>
            <div className="mb-6 md:mb-8">
              <p className="font-bold text-xs uppercase tracking-widest text-arcilla mb-3">Incluye:</p>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-antracita/70 items-start">
                    <span className="text-arcilla font-bold">✓</span> <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-arcilla font-bold uppercase text-xs tracking-widest hover:opacity-70 transition-opacity mt-auto">
              Saber más <ArrowRight className="w-4 h-4" />
            </a>
        </div>
      </div>
    </FadeUp>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-verde/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
      >
        <h3 className="font-serif font-bold text-lg md:text-xl text-verde pr-8">{question}</h3>
        <ChevronDown 
          className={`w-6 h-6 text-arcilla transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-antracita/80 leading-relaxed font-medium text-[15px]">{answer}</p>
      </div>
    </div>
  );
}

const testimonialsData = [
  {
    quote: "Contraté el revestimiento de mi piscina y quedó perfecta. Cumplieron el plazo que prometieron y el precio fue exactamente lo presupuestado.",
    author: "María J.",
    location: "Región Metropolitana"
  },
  {
    quote: "Necesitaba una tinaja específica para mi jardín y la hicieron exactamente como la pedí. El resultado superó mis expectativas.",
    author: "Carlos R.",
    location: "[Ciudad]"
  },
  {
    quote: "Muy buena comunicación durante todo el proceso. Repararon mi quincho en tiempo récord.",
    author: "Ana M.",
    location: "[Ciudad]"
  }
];

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);

  const getCardStyle = (index: number) => {
    const isCurrent = index === currentIndex;
    const isPrev = index === (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    const isNext = index === (currentIndex + 1) % testimonialsData.length;

    if (isMobile) {
      if (isCurrent) return "translate-x-0 opacity-100 z-20 scale-100";
      if (isPrev) return "-translate-x-[100%] opacity-0 z-10 scale-95 pointer-events-none";
      return "translate-x-[100%] opacity-0 z-10 scale-95 pointer-events-none"; 
    }

    // Desktop
    if (isCurrent) return "translate-x-0 opacity-100 z-20 scale-100";
    if (isPrev) return "-translate-x-[60%] opacity-50 z-10 scale-[0.85] cursor-pointer hover:opacity-80";
    if (isNext) return "translate-x-[60%] opacity-50 z-10 scale-[0.85] cursor-pointer hover:opacity-80";
    
    return "translate-x-0 opacity-0 z-0 scale-75 pointer-events-none";
  };

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      <div className="relative h-[380px] md:h-[320px] flex items-center justify-center">
        {testimonialsData.map((testimonial, index) => (
          <div 
            key={index}
            onClick={() => {
              if (!isMobile && index !== currentIndex) {
                setCurrentIndex(index);
              }
            }}
            className={`absolute top-0 md:top-1/2 md:-translate-y-1/2 w-full max-w-md md:max-w-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${getCardStyle(index)}`}
          >
             <div className="bg-white p-8 md:p-10 shadow-lg border border-arcilla/20 rounded-sm h-full flex flex-col mx-4 md:mx-0">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-arcilla text-arcilla" />
                ))}
              </div>
              <p className="font-serif italic text-antracita/80 leading-relaxed mb-8 text-lg flex-grow">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider text-verde">
                  — {testimonial.author}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-arcilla mt-1 font-semibold">
                  {testimonial.location}
                </p>
              </div>
             </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-12 relative z-30">
        <button 
          onClick={prev}
          aria-label="Anterior"
          className="w-10 h-10 rounded-full bg-crema border border-arcilla/30 flex items-center justify-center text-arcilla hover:bg-arcilla hover:border-arcilla hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-3">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir al testimonio ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-arcilla w-8' : 'bg-arcilla/30 hover:bg-arcilla/60 w-2'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={next}
          aria-label="Siguiente"
          className="w-10 h-10 rounded-full bg-crema border border-arcilla/30 flex items-center justify-center text-arcilla hover:bg-arcilla hover:border-arcilla hover:text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function DiferenciadoresGrid() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const reasons = [
    {
      icon: MessageSquare,
      title: "Trato directo y honesto",
      text: "Hablas con quien ejecuta el trabajo. Sin intermediarios, sin promesas vacías. Lo que te decimos, lo cumplimos."
    },
    {
      icon: FileText,
      title: "Presupuesto real, sin letra chica",
      text: "Nada de cobros sorpresa. El presupuesto que firmamos es el que pagas."
    },
    {
      icon: Layers,
      title: "Conocemos los materiales",
      text: "Llevamos años trabajando con fibra de vidrio, cemento y revestimientos. Sabemos qué funciona y qué no."
    },
    {
      icon: Home,
      title: "Respetamos tu hogar",
      text: "Trabajamos ordenado, cuidando tu espacio como si fuera el nuestro."
    },
    {
      icon: Clock,
      title: "Plazos reales",
      text: "No prometemos lo que no podemos cumplir. Te decimos cuánto tarda y lo respetamos."
    },
    {
      icon: HeartHandshake,
      title: "Postventa real",
      text: "Una vez terminado el trabajo, seguimos disponibles si tienes alguna duda o problema."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
        {reasons.map((reason, index) => {
          const isHiddenMobile = isMobile && index >= 3 && !showAll;
          const Icon = reason.icon;
          
          if (isHiddenMobile) return null;
          
          return (
            <FadeUp 
              key={index} 
              custom={index} 
              className={`bg-crema/5 border border-crema/10 rounded-xl p-8 hover:bg-crema/10 transition-colors flex flex-col ${isMobile && index >= 3 ? 'animate-[slideDown_0.5s_ease-out_forwards]' : ''}`}
            >
              <div className="w-12 h-12 rounded-lg bg-arcilla/20 text-arcilla flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">{reason.title}</h3>
              <p className="text-crema/80 leading-relaxed font-medium text-[15px]">
                {reason.text}
              </p>
            </FadeUp>
          );
        })}
      </div>
      
      <button 
        onClick={() => setShowAll(!showAll)}
        className="md:hidden mt-10 px-6 py-3 rounded-full border border-arcilla text-arcilla font-bold text-sm tracking-wide uppercase flex items-center gap-2 transition-all hover:bg-arcilla hover:text-white"
      >
        {showAll ? 'Ver menos ↑' : 'Ver las 6 razones ↓'}
      </button>
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowFloatingButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-crema text-antracita font-sans flex flex-col items-center w-full relative">
      {/* Barra superior completa */}
      <div className="w-full bg-[#2D4A3E] text-crema relative z-50">
        
        {/* Version Desktop */}
        <div className="hidden md:flex h-9 w-full items-center justify-center gap-8 text-[11px] font-medium tracking-wide border-b border-verde/10">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-1.5 transition-opacity hover:opacity-80 cursor-default">
              <MapPin className="w-3.5 h-3.5 text-arcilla" />
              <span>[Ciudad, Región]</span>
            </div>
            
            <div className="h-3.5 w-px bg-crema/30"></div>
            
            <a href="tel:+56900000000" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
              <Phone className="w-3.5 h-3.5 text-arcilla" />
              <span>+56 9 XXXX XXXX</span>
            </a>
            
            <div className="h-3.5 w-px bg-crema/30"></div>
            
            <div className="flex items-center gap-1.5 transition-opacity hover:opacity-80 cursor-default">
              <CheckCircle2 className="w-3.5 h-3.5 text-arcilla" />
              <span>Presupuesto 100% gratis</span>
            </div>
            
            <div className="h-3.5 w-px bg-crema/30"></div>
            
            <div className="flex items-center gap-1.5 transition-opacity hover:opacity-80 cursor-default">
              <Clock className="w-3.5 h-3.5 text-arcilla" />
              <span>Respuesta en menos de 24 hrs</span>
            </div>
          </div>
        </div>

        {/* Version Mobile Ticker */}
        <div className="md:hidden h-[36px] w-full flex items-center overflow-hidden ticker-mask border-b border-verde/10 bg-[#2D4A3E]">
          <div className="animate-ticker flex whitespace-nowrap text-[12px] font-medium tracking-wide items-center w-max">
            {/* Duplicamos el contenido para el loop continuo suave */}
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 px-2 w-max shrink-0">
                <span>📍 [Ciudad]</span>
                <span className="text-arcilla px-1">·</span>
                <span>📞 +56 9 XXXX XXXX</span>
                <span className="text-arcilla px-1">·</span>
                <span>✅ Presupuesto gratis</span>
                <span className="text-arcilla px-1">·</span>
                <span>⏱ Respuesta en 24 hrs</span>
                <span className="text-arcilla px-1">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar Múltiple */}
      <nav 
        className={`w-full sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-2xl tracking-tighter text-verde">
              [NOMBRE EMPRESA]
            </span>
          </div>

           {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-8 text-[12px] font-semibold uppercase tracking-wider text-verde/80">
            <a href="#" className="hover:text-arcilla transition-colors">Servicios</a>
            <a href="#" className="hover:text-arcilla transition-colors">Cómo trabajamos</a>
            <a href="#" className="hover:text-arcilla transition-colors">Preguntas frecuentes</a>
            <a href="#" className="hover:text-arcilla transition-colors">Contacto</a>
          </div>

          {/* Botón Desktop */}
          <div className="hidden lg:block">
            <button className="bg-arcilla hover:bg-arcilla/90 text-white px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-95">
              Cotizar ahora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-verde p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-verde/10 py-6 px-6 flex flex-col gap-6 lg:hidden">
            <a href="#" className="text-sm font-semibold uppercase tracking-widest text-verde/80 hover:text-arcilla">Servicios</a>
            <a href="#" className="text-sm font-semibold uppercase tracking-widest text-verde/80 hover:text-arcilla">Cómo trabajamos</a>
            <a href="#" className="text-sm font-semibold uppercase tracking-widest text-verde/80 hover:text-arcilla">Preguntas frecuentes</a>
            <a href="#" className="text-sm font-semibold uppercase tracking-widest text-verde/80 hover:text-arcilla">Contacto</a>
            <button className="bg-arcilla text-white px-6 py-3 rounded-md font-bold text-xs uppercase tracking-widest w-full mt-2">
              Cotizar ahora
            </button>
          </div>
        )}
      </nav>

      {/* Hero Completo */}
      <main className="relative flex-grow flex flex-col items-center justify-center px-6 md:px-12 py-20 text-center w-full min-h-[calc(100vh-100px)] overflow-hidden">
        
        {/* Floating Abstract Geometric Shapes (Background) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] md:left-[15%] w-64 h-64 md:w-96 md:h-96 bg-arcilla/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-[20%] right-[5%] md:right-[15%] w-72 h-72 md:w-[28rem] md:h-[28rem] bg-verde/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-[40%] left-[40%] w-48 h-48 bg-arcilla/5 rounded-full blur-2xl animate-float-slow"></div>
        </div>

        {/* Concrete Texture Background Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
        
        {/* Crema Overlay al 90% implies the base was something else, but we use crema as the base. We just add it for safety layer. */}
        <div className="absolute inset-0 z-0 bg-crema/90 pointer-events-none"></div>

        <FadeUp className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 font-bold text-antracita font-serif -tracking-[0.02em]">
            Hacemos realidad el espacio que imaginaste
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-3xl mb-12 font-medium text-antracita mx-auto">
            Tinajas a medida, piscinas revestidas, quinchos terminados y reparaciones que duran — trabajo artesanal con garantía real para tu hogar en [región].
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
            <button className="bg-arcilla hover:bg-arcilla/90 text-white px-10 py-5 rounded-md font-bold text-sm uppercase tracking-widest shadow-xl transform hover:translate-y-[-2px] transition-all w-full sm:w-auto">
              Pide tu cotización gratis
            </button>
            <button className="border-2 border-verde hover:bg-verde/5 text-verde px-10 py-5 rounded-md font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto">
              Ver nuestros servicios
            </button>
          </div>
          
          {/* Microconfianzas */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-[13px] font-semibold text-antracita uppercase tracking-wider">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 border border-verde/10 rounded-full">
              <span>⭐</span>
              <span>Sin costo de visita</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 border border-verde/10 rounded-full">
              <span>🔨</span>
              <span>Más de 500 proyectos realizados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 border border-verde/10 rounded-full">
              <span>📋</span>
              <span>Presupuesto detallado por escrito</span>
            </div>
          </div>
        </FadeUp>
      </main>

      {/* Stats Section */}
      <section className="bg-verde py-6 md:py-16 px-6 w-full relative z-10 border-t-4 border-arcilla">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 sm:gap-8 text-center sm:divide-x divide-crema/10">
          <FadeUp custom={0} className="flex flex-col items-center justify-center pt-0">
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-arcilla mb-1 md:mb-3 tracking-tighter">
              <AnimatedCounter to={50} prefix="+" duration={2} delay={0.2} />
            </span>
            <span className="text-crema text-[10px] sm:text-xs uppercase tracking-widest font-semibold opacity-90 max-w-[120px] md:max-w-[150px] leading-tight">
              Proyectos terminados
            </span>
          </FadeUp>
          <FadeUp custom={1} className="flex flex-col items-center justify-center pt-0">
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-arcilla mb-1 md:mb-3 tracking-tighter">
              <AnimatedCounter to={8} prefix="+" duration={2} delay={0.3} />
            </span>
            <span className="text-crema text-[10px] sm:text-xs uppercase tracking-widest font-semibold opacity-90 max-w-[120px] md:max-w-[150px] leading-tight">
              Años de experiencia
            </span>
          </FadeUp>
          <FadeUp custom={2} className="flex flex-col items-center justify-center pt-0">
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-arcilla mb-1 md:mb-3 tracking-tighter">
              <AnimatedCounter to={5} duration={2} delay={0.4} />
            </span>
            <span className="text-crema text-[10px] sm:text-xs uppercase tracking-widest font-semibold opacity-90 max-w-[120px] md:max-w-[150px] leading-tight">
              Tipos de servicio
            </span>
          </FadeUp>
          <FadeUp custom={3} className="flex flex-col items-center justify-center pt-0">
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-arcilla mb-1 md:mb-3 tracking-tighter">
              <AnimatedCounter to={100} suffix="%" duration={2} delay={0.5} />
            </span>
            <span className="text-crema text-[10px] sm:text-xs uppercase tracking-widest font-semibold opacity-90 max-w-[120px] md:max-w-[150px] leading-tight">
              Satisfacción garantizada
            </span>
          </FadeUp>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-crema py-24 px-6 md:px-12 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-verde mb-6 max-w-3xl mx-auto leading-tight">
              Todo lo que necesitas para tu hogar, en un solo lugar
            </h2>
            <div className="w-24 h-1 bg-arcilla mx-auto rounded-full"></div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <ServiceCard 
              custom={0}
              icon={Container}
              title="Fabricación de Tinajas"
              shortDescription="Diseño a medida y madera premium"
              description="Fabricamos tinajas completamente a medida según el tamaño, forma y uso que necesitas — para jardín, decoración o almacenamiento."
              features={[
                "Diseño personalizado",
                "Materiales de primera",
                "Entrega e instalación"
              ]}
            />
            
            <ServiceCard 
              custom={1}
              icon={Waves}
              title="Revestimiento de Piscinas"
              shortDescription="Fibra de vidrio resistente y duradera"
              description="Aplicamos fibra de vidrio de alta resistencia que sella, protege y renueva tu piscina completamente — sin demolición."
              features={[
                "Diagnóstico previo",
                "Aplicación profesional",
                "Garantía de sellado"
              ]}
            />
            
            <ServiceCard 
              custom={2}
              icon={Wrench}
              title="Reparaciones"
              shortDescription="Soluciones rápidas y definitivas"
              description="Reparamos estructuras, revestimientos y terminaciones de todo tipo. Si está roto, lo arreglamos."
              features={[
                "Visita de diagnóstico sin costo",
                "Presupuesto por escrito",
                "Solución garantizada"
              ]}
            />
            
            <ServiceCard 
              custom={3}
              icon={Layers}
              title="Radier"
              shortDescription="Bases niveladas y firmes"
              description="Ejecutamos radier nivelado y resistente para cualquier proyecto de construcción o remodelación."
              features={[
                "Nivelación técnica",
                "Mezcla de calidad",
                "Acabado prolijo"
              ]}
            />

            <ServiceCard 
              custom={4}
              icon={Home}
              title="Revestimientos de Quinchos"
              shortDescription="Diseño y resistencia al calor"
              description="Renovamos quinchos con revestimientos que resisten la lluvia, el humo y el paso del tiempo — para que disfrutes sin preocuparte."
              features={[
                "Asesoría de materiales",
                "Aplicación uniforme",
                "Resistencia garantizada"
              ]}
              className="md:col-span-2 lg:col-span-2 md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Proceso Section */}
      <section className="bg-white py-24 px-6 md:px-12 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-verde mb-6 max-w-3xl mx-auto leading-tight">
              Así trabajamos: simple, claro y sin sorpresas
            </h2>
            <div className="w-24 h-1 bg-arcilla mx-auto rounded-full"></div>
          </FadeUp>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[31px] left-[12.5%] right-[12.5%] h-[2px] bg-arcilla/20 z-0"></div>
            {/* Connecting Line (Mobile) - using 2.5rem safe distance so it doesn't overlap circle borders */}
            <div className="md:hidden absolute top-[4rem] bottom-[15%] left-[31px] w-[2px] bg-arcilla/20 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {/* Paso 1 */}
              <FadeUp custom={0} className="flex flex-col items-start md:items-center text-left md:text-center group">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-0 w-full mb-0 md:mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-arcilla text-crema text-2xl font-bold font-serif flex items-center justify-center z-10 relative shadow-md ring-8 ring-white">
                    1
                  </div>
                  <h3 className="text-xl font-serif font-bold text-verde md:mt-6 block md:hidden">Nos contactas</h3>
                </div>
                <div className="pl-[88px] md:pl-0 w-full">
                  <h3 className="text-xl font-serif font-bold text-verde mb-3 hidden md:block">Nos contactas</h3>
                  <p className="text-antracita/80 leading-relaxed font-medium text-[15px]">
                    Escríbenos por WhatsApp o llámanos. Nos cuentas qué necesitas y acordamos una visita.
                  </p>
                </div>
              </FadeUp>

              {/* Paso 2 */}
              <FadeUp custom={1} className="flex flex-col items-start md:items-center text-left md:text-center group">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-0 w-full mb-0 md:mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-arcilla text-crema text-2xl font-bold font-serif flex items-center justify-center z-10 relative shadow-md ring-8 ring-white">
                    2
                  </div>
                  <h3 className="text-xl font-serif font-bold text-verde md:mt-6 block md:hidden">Visita y diagnóstico gratis</h3>
                </div>
                <div className="pl-[88px] md:pl-0 w-full">
                  <h3 className="text-xl font-serif font-bold text-verde mb-3 hidden md:block">Visita y diagnóstico gratis</h3>
                  <p className="text-antracita/80 leading-relaxed font-medium text-[15px]">
                    Vamos donde estás, revisamos el trabajo y te entregamos un presupuesto detallado por escrito. Sin costo, sin compromiso.
                  </p>
                </div>
              </FadeUp>

              {/* Paso 3 */}
              <FadeUp custom={2} className="flex flex-col items-start md:items-center text-left md:text-center group">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-0 w-full mb-0 md:mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-arcilla text-crema text-2xl font-bold font-serif flex items-center justify-center z-10 relative shadow-md ring-8 ring-white">
                    3
                  </div>
                  <h3 className="text-xl font-serif font-bold text-verde md:mt-6 block md:hidden">Ejecutamos el trabajo</h3>
                </div>
                <div className="pl-[88px] md:pl-0 w-full">
                  <h3 className="text-xl font-serif font-bold text-verde mb-3 hidden md:block">Ejecutamos el trabajo</h3>
                  <p className="text-antracita/80 leading-relaxed font-medium text-[15px]">
                    Trabajamos en los plazos acordados, con materiales de calidad y comunicación constante contigo.
                  </p>
                </div>
              </FadeUp>

              {/* Paso 4 */}
              <FadeUp custom={3} className="flex flex-col items-start md:items-center text-left md:text-center group">
                <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-0 w-full mb-0 md:mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-arcilla text-crema text-2xl font-bold font-serif flex items-center justify-center z-10 relative shadow-md ring-8 ring-white">
                    4
                  </div>
                  <h3 className="text-xl font-serif font-bold text-verde md:mt-6 block md:hidden">Entrega con garantía</h3>
                </div>
                <div className="pl-[88px] md:pl-0 w-full flex flex-col md:items-center">
                  <h3 className="text-xl font-serif font-bold text-verde mb-3 hidden md:block">Entrega con garantía</h3>
                  <p className="text-antracita/80 leading-relaxed font-medium text-[15px] mb-8 md:mb-8">
                    Te entregamos el trabajo terminado y te explicamos todo. Si algo no está bien, lo resolvemos.
                  </p>
                  <button className="bg-arcilla hover:bg-arcilla/90 text-white px-6 py-4 rounded-md font-bold text-[11px] lg:text-xs uppercase tracking-widest shadow-xl transform hover:-translate-y-1 transition-all w-full leading-snug">
                    Empieza ahora — es gratis cotizar
                  </button>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciadores Section */}
      <section className="bg-verde py-24 px-6 md:px-12 w-full relative z-10 border-t-4 border-arcilla">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-16 text-center max-w-4xl mx-auto leading-tight">
              Lo que nos diferencia de una empresa grande... <br className="hidden md:block" />y de un inexperto
            </h2>
          </FadeUp>

          <DiferenciadoresGrid />
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="bg-crema py-24 px-6 md:px-12 w-full relative z-10 overflow-hidden">
        <FadeUp className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-verde mb-16 text-center max-w-4xl mx-auto leading-tight">
            Lo que dicen quienes ya confiaron en nosotros
          </h2>

          <TestimonialCarousel />

          <p className="text-center text-xs uppercase tracking-widest font-semibold text-antracita/40 mt-16 relative z-30">
            Testimonios de clientes reales. Próximamente con fotos verificadas.
          </p>
        </FadeUp>
      </section>

      {/* Garantía Section */}
      <section className="bg-white py-24 px-6 md:px-12 w-full relative z-10 border-t border-verde/5">
        <FadeUp className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-arcilla/10 rounded-full flex items-center justify-center mb-8">
            <ShieldCheck className="w-12 h-12 text-arcilla" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-verde mb-8 leading-tight tracking-tight">
            Nuestra garantía simple
          </h2>
          
          <p className="text-xl md:text-2xl font-medium text-antracita/90 mb-16 max-w-2xl leading-relaxed">
            "Si el trabajo no queda como lo acordamos, volvemos a hacerlo. Sin discusión."
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-16 w-full">
            <div className="flex items-center gap-3 bg-crema/40 px-6 py-4 rounded-full border border-arcilla/10">
              <Lock className="w-5 h-5 text-arcilla shrink-0" />
              <span className="font-bold text-xs uppercase tracking-widest text-verde">Presupuesto fijo por escrito</span>
            </div>
            <div className="flex items-center gap-3 bg-crema/40 px-6 py-4 rounded-full border border-arcilla/10">
              <Lock className="w-5 h-5 text-arcilla shrink-0" />
              <span className="font-bold text-xs uppercase tracking-widest text-verde">Plazo comprometido</span>
            </div>
            <div className="flex items-center gap-3 bg-crema/40 px-6 py-4 rounded-full border border-arcilla/10">
              <Lock className="w-5 h-5 text-arcilla shrink-0" />
              <span className="font-bold text-xs uppercase tracking-widest text-verde">Satisfacción o lo resolvemos</span>
            </div>
          </div>

          <p className="font-serif italic text-xl md:text-2xl text-arcilla">
            "Porque construimos con nuestro nombre en cada trabajo."
          </p>
        </FadeUp>
      </section>

      {/* FAQ Section */}
      <section className="bg-crema py-24 px-6 md:px-12 w-full relative z-10 border-t border-arcilla/10">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-verde mb-6">
              Preguntas frecuentes
            </h2>
            <div className="w-24 h-1 bg-arcilla mx-auto rounded-full"></div>
          </FadeUp>

          <FadeUp className="bg-white rounded-xl shadow-sm border border-verde/5 p-6 md:p-10">
            <FAQItem 
              question="¿Tienen costo la visita y el presupuesto?" 
              answer="No. La visita de diagnóstico y el presupuesto son completamente gratuitos y sin compromiso." 
            />
            <FAQItem 
              question="¿En qué zonas trabajan?" 
              answer="Trabajamos en [región/ciudad]. Consulta si llegamos a tu ubicación." 
            />
            <FAQItem 
              question="¿Cuánto demora revestir una piscina?" 
              answer="Depende del tamaño y estado, pero típicamente entre 3 y 7 días hábiles. Te lo confirmamos al presupuestar." 
            />
            <FAQItem 
              question="¿Puedo ver trabajos anteriores?" 
              answer="Estamos recopilando nuestro portafolio fotográfico. Mientras tanto, podemos entregarte referencias directas de clientes anteriores." 
            />
            <FAQItem 
              question="¿Cómo pago?" 
              answer="Trabajamos con un anticipo al iniciar y el saldo contra entrega. Todo queda estipulado por escrito." 
            />
            <FAQItem 
              question="¿Las tinajas son completamente a medida?" 
              answer="Sí. Nos indicas las dimensiones, el uso y el estilo, y las fabricamos según tus requerimientos." 
            />
          </FadeUp>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="bg-gradient-to-br from-arcilla to-verde py-24 px-6 md:px-12 w-full relative z-10 overflow-hidden">
        {/* Subtle patterned overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
        
        <FadeUp className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight max-w-3xl">
            Tu proyecto empieza con una conversación
          </h2>
          
          <p className="text-lg md:text-xl text-crema/90 mb-12 max-w-2xl font-medium leading-relaxed">
            Cuéntanos qué necesitas. La visita es gratis, el presupuesto es por escrito y no tienes ningún compromiso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 w-full">
            <a 
              href="https://wa.me/56900000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-5 rounded-md font-bold text-sm uppercase tracking-widest shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto min-w-[280px]"
            >
              <MessageSquare className="w-5 h-5" /> Escribir por WhatsApp
            </a>
            
            <a 
              href="tel:+56900000000" 
              className="bg-transparent border-2 border-white/80 hover:bg-white/10 text-white px-8 py-5 rounded-md font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 w-full sm:w-auto min-w-[280px]"
            >
              <PhoneCall className="w-5 h-5" /> Llamar ahora
            </a>
          </div>

          <p className="text-sm md:text-[15px] font-medium text-crema/70 flex items-center justify-center gap-2 flex-wrap text-center">
            <Mail className="w-4 h-4 opacity-70" /> 
            <span>También puedes escribirnos a <a href="mailto:contacto@empresa.cl" className="underline hover:text-white transition-colors">contacto@empresa.cl</a> — respondemos en menos de 24 horas</span>
          </p>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="bg-antracita text-crema py-16 px-6 md:px-12 w-full relative z-10">
        <FadeUp className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Columna 1 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-serif font-bold text-2xl tracking-tighter text-white">
                  [NOMBRE EMPRESA]
                </span>
              </div>
              <p className="text-crema/70 font-medium text-sm leading-relaxed max-w-xs">
                Trabajo artesanal con garantía real.
              </p>
            </div>

            {/* Columna 2 */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">Enlaces rápidos</h4>
              <ul className="space-y-3 text-sm font-medium text-crema/80">
                <li><a href="#" className="hover:text-arcilla transition-colors">Servicios</a></li>
                <li><a href="#" className="hover:text-arcilla transition-colors">Cómo trabajamos</a></li>
                <li><a href="#" className="hover:text-arcilla transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-arcilla transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* Columna 3 */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">Contacto</h4>
              <ul className="space-y-4 text-sm font-medium text-crema/80 mb-6">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-arcilla shrink-0" />
                  <a href="tel:+56900000000" className="hover:text-white transition-colors">+56 9 XXXX XXXX</a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-arcilla shrink-0" />
                  <a href="mailto:contacto@empresa.cl" className="hover:text-white transition-colors">contacto@empresa.cl</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-arcilla shrink-0" />
                  <span>[Ciudad], [Región]</span>
                </li>
              </ul>
              
              {/* Redes Sociales */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-arcilla flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-crema/40 font-semibold">
              © 2025 [Nombre empresa] · Todos los derechos reservados
            </p>
          </div>
        </FadeUp>
      </footer>

      {/* Floating WhatsApp Button (Mobile only) */}
      <a 
        href="https://wa.me/56900000000?text=Hola%2C%20me%20interesa%20cotizar%20un%20trabajo" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`md:hidden fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showFloatingButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="font-bold text-[13px] tracking-wide">Cotizar gratis</span>
      </a>

    </div>
  );
}
