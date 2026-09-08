import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const WHATSAPP_NUMBER = '51967307634'
type Product = { id: string; name: string; volume: string; price: number; category: string; image: string; badge?: string }
type CartLine = Product & { quantity: number }

const products: Product[] = [
  { id: 'jw-black-label', name: 'Johnnie Walker Black Label', volume: '750 ml', price: 95, category: 'Whisky', image: '/assets/images/products/jw-black-label-cutout.png', badge: 'Favorito' },
  { id: 'old-parr-12', name: 'Old Parr 12 Años', volume: '750 ml', price: 85, category: 'Whisky', image: '/assets/images/products/old-parr-12-cutout.png' },
  { id: 'riccadonna-asti', name: 'Riccadonna Asti', volume: '750 ml', price: 50, category: 'Espumante', image: '/assets/images/products/riccadonna-asti.png', badge: 'Celebración' },
  { id: 'baileys-750', name: 'Baileys Original', volume: '750 ml', price: 64.5, category: 'Licor', image: '/assets/images/products/baileys-cutout.png' },
  { id: 'jagermeister-700', name: 'Jägermeister', volume: '700 ml', price: 68, category: 'Licor', image: '/assets/images/products/jagermeister-cutout.png' },
  { id: 'casillero-del-diablo', name: 'Casillero del Diablo Merlot', volume: '750 ml', price: 30, category: 'Vino', image: '/assets/images/products/casillero-del-diablo-cutout.png' },
]

const formatPrice = (price: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)
const rise = { initial: { opacity: 0, y: 20, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: .8, ease: 'easeOut' } } as const

function ArrowUpRight() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg> }
function BagIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 7h14l-1 13H6L5 7Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg> }
function Plus() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> }

function BottleAtmosphere({ collection = false }: { collection?: boolean }) {
  const floatingBottles = collection
    ? [['/assets/images/products/riccadonna-asti.png', 'float-bottle--left'], ['/assets/images/products/jagermeister-cutout.png', 'float-bottle--right'], ['/assets/images/products/casillero-del-diablo-cutout.png', 'float-bottle--center']]
    : [['/assets/images/products/jw-black-label-cutout.png', 'float-bottle--left'], ['/assets/images/products/old-parr-12-cutout.png', 'float-bottle--right'], ['/assets/images/products/baileys-cutout.png', 'float-bottle--center']]
  return <div className={`bottle-atmosphere ${collection ? 'bottle-atmosphere--collection' : ''}`} aria-hidden="true">
    <img src="/assets/images/hero/hero-bottle.jpg" className="bottle-atmosphere__photo" alt="" />
    <div className="bottle-atmosphere__glow" />
    <div className="bottle-atmosphere__grain" />
    <div className="bottle-atmosphere__rings" />
    <div className="bottle-atmosphere__bubbles" />
    {floatingBottles.map(([src, position]) => <img key={src} src={src} className={`float-bottle ${position}`} alt="" />)}
  </div>
}

function BlurText({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, amount: .1 })
  return <h1 ref={ref} className={className}>{text.split(' ').map((word, index) => <motion.span key={`${word}-${index}`} className="inline-block mr-[.28em]" initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined} transition={{ duration: .7, delay: index * .1, ease: 'easeOut' }}>{word}</motion.span>)}</h1>
}

function App() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeCart = () => { setCartOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const add = (product: Product) => setCart(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
  const quantity = (id: string, adjustment: number) => setCart(current => current.flatMap(item => item.id !== id ? [item] : item.quantity + adjustment > 0 ? [{ ...item, quantity: item.quantity + adjustment }] : []))
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const checkout = () => {
    if (!cart.length) return
    const items = cart.map(item => `• ${item.name} ${item.volume} ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`).join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, quiero pedir:\n\n${items}\n\nTotal: ${formatPrice(total)}\n\n¿Me confirman cobertura y tiempo de entrega?`)}`, '_blank', 'noopener,noreferrer')
  }
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return <main className="bg-black text-white selection:bg-[#c99d58] selection:text-black">
    <header className="fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-10 lg:px-16">
      <button onClick={() => scrollTo('inicio')} className="liquid-glass grid h-12 w-12 place-items-center rounded-full p-1.5" aria-label="Ir al inicio"><img src="/assets/images/logo-arikatay.jpeg" alt="Ari Katay" className="h-full w-full rounded-full object-cover" /></button>
      <nav className="liquid-glass hidden items-center rounded-full p-1.5 md:flex" aria-label="Navegación principal">
        <button onClick={() => scrollTo('inicio')} className="rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white">Inicio</button>
        <button onClick={() => scrollTo('seleccion')} className="rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white">Selección</button>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="ml-1 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Pedir ahora <ArrowUpRight /></a>
      </nav>
      <button ref={triggerRef} onClick={() => setCartOpen(true)} className="liquid-glass relative grid h-12 w-12 place-items-center rounded-full !overflow-visible" aria-label={`Abrir carrito, ${count} productos`}><BagIcon />{count > 0 && <span className="absolute -right-3 -top-3 z-10 grid h-7 min-w-7 place-items-center rounded-full bg-[#d8ae68] px-1.5 text-sm font-bold text-black ring-2 ring-white/80 shadow-[0_0_10px_rgba(216,174,104,.5)] animate-badge-pop">{count}</span>}</button>
    </header>

    <section id="inicio" className="relative flex min-h-screen overflow-hidden">
      <BottleAtmosphere />
      <div className="ambient absolute inset-0 z-[1]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center">
        <motion.div {...rise} transition={{ ...rise.transition, delay: .25 }} className="liquid-glass rounded-full px-3 py-2 text-xs font-medium text-white/90"><span className="mr-2 rounded-full bg-white px-2 py-1 text-[10px] text-black">Trujillo</span></motion.div>
        <BlurText text="Exclusividad embotellada para momentos que permanecen." className="mt-7 max-w-4xl font-heading text-6xl italic leading-[.82] tracking-[-.055em] sm:text-7xl md:text-8xl lg:text-[6.5rem]" />
        <motion.p {...rise} transition={{ ...rise.transition, delay: .8 }} className="mt-6 max-w-xl text-sm font-light leading-snug text-white/85 md:text-base">Una cava de etiquetas originales, seleccionadas para regalar, celebrar y compartir. La experiencia empieza con una elección impecable.</motion.p>
        <motion.div {...rise} transition={{ ...rise.transition, delay: 1 }} className="mt-7 flex items-center gap-5"><button onClick={() => scrollTo('seleccion')} className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium">Explorar la cava <ArrowUpRight /></button><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-sm text-white/90 transition hover:text-white">Hablar con un asesor</a></motion.div>
        <motion.div {...rise} transition={{ ...rise.transition, delay: 1.2 }} className="mt-12 grid w-full max-w-md grid-cols-2 gap-3 text-left">
          <div className="liquid-glass rounded-2xl p-4"><p className="font-heading text-4xl italic leading-none">100%</p><p className="mt-3 text-xs font-light text-white/75">Etiquetas originales verificadas</p></div>
          <div className="liquid-glass rounded-2xl p-4"><p className="font-heading text-4xl italic leading-none">Hoy</p><p className="mt-3 text-xs font-light text-white/75">Coordinamos tu entrega en Trujillo</p></div>
        </motion.div>
        <motion.p {...rise} transition={{ ...rise.transition, delay: 1.35 }} className="mt-9 rounded-full px-4 py-2 text-[11px] text-white/70">Para quienes reconocen una buena botella antes de abrirla.</motion.p>
      </div>
    </section>

    <section id="seleccion" className="relative min-h-screen overflow-hidden px-5 py-28 md:px-10 lg:px-16">
      <BottleAtmosphere collection />
      <div className="absolute inset-0 z-[1] bg-black/70" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col">
        <motion.div {...rise} className="mb-10"><p className="text-sm text-white/70">Selección Ari Katay</p><h2 className="mt-5 max-w-2xl whitespace-pre-line font-heading text-6xl italic leading-[.85] tracking-[-.045em] md:text-7xl lg:text-8xl">Una cava,{`\n`}sin ruido.</h2><p className="mt-5 max-w-md text-sm font-light leading-snug text-white/80">Elige una botella y arma tu pedido. Te lo confirmamos por WhatsApp antes de enviarlo.</p></motion.div>
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => <motion.article key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55, delay: index * .06 }} className="liquid-glass flex min-h-[300px] flex-col rounded-[1.25rem] p-5">
            <div className="flex items-start justify-between"><span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[.12em] text-white/75">{product.category}</span>{product.badge && <span className="text-[11px] text-[#e8c987]">{product.badge}</span>}</div>
            <img src={product.image} alt="" className="mx-auto h-36 w-32 object-contain py-3 drop-shadow-[0_20px_25px_rgba(0,0,0,.45)]" />
            <div className="mt-auto"><p className="font-heading text-3xl italic leading-none">{product.name}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-white/65">{product.volume} · {formatPrice(product.price)}</span><button onClick={() => add(product)} className="liquid-glass-strong grid h-10 w-10 place-items-center rounded-full" aria-label={`Añadir ${product.name}`}><Plus /></button></div></div>
          </motion.article>)}
        </div>
        <p className="mt-8 text-center text-[11px] text-white/60">Tomar bebidas alcohólicas en exceso es dañino. Prohibida la venta a menores de 18 años. <br />
          Preguntar por el catálogo para más información.</p>
      </div>
    </section>

    {cartOpen && <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm" onMouseDown={closeCart}><aside role="dialog" aria-modal="true" aria-label="Tu selección" className="liquid-glass-strong ml-auto flex h-full w-full max-w-md flex-col rounded-3xl p-6" onMouseDown={event => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-heading text-4xl italic">Tu selección</h2><button onClick={closeCart} className="rounded-full p-2 text-white/70 hover:text-white" aria-label="Cerrar carrito">×</button></div><div className="mt-6 flex-1 overflow-y-auto">{cart.length === 0 ? <p className="pt-16 text-center text-sm text-white/60">Tu cava está esperando una primera botella.</p> : cart.map(item => <div key={item.id} className="flex items-center gap-3 border-b border-white/10 py-4"><img src={item.image} alt="" className="h-14 w-11 object-contain" /><div className="min-w-0 flex-1"><p className="text-sm">{item.name}</p><p className="mt-1 text-xs text-white/60">{formatPrice(item.price * item.quantity)}</p></div><div className="flex items-center gap-2"><button onClick={() => quantity(item.id, -1)} aria-label={`Quitar una unidad de ${item.name}`} className="p-1 text-white/70">−</button><span className="w-4 text-center text-xs">{item.quantity}</span><button onClick={() => quantity(item.id, 1)} aria-label={`Añadir una unidad de ${item.name}`} className="p-1 text-white/70">+</button></div></div>)}</div><div className="border-t border-white/10 pt-5"><div className="mb-4 flex justify-between text-sm"><span className="text-white/65">Total</span><strong>{formatPrice(total)}</strong></div><button onClick={checkout} disabled={!cart.length} className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-[#e9c987] disabled:cursor-not-allowed disabled:opacity-40">Pedir por WhatsApp</button></div></aside></div>}
  </main>
}

export default App
