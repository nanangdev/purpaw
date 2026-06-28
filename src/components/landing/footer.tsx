import { Paw } from "../glymph/paw";
import { Link005 } from "../glymph/link-hover-bg";

export default function LandingFooter() {
    return (
        <footer className="relative w-full overflow-x-clip bg-black text-white flex flex-col items-center pt-16 lg:pt-24">
            <div className="relative z-20 mx-auto flex flex-col gap-8 md:gap-12 p-6 lg:p-8 xl:p-12 rounded-2xl xl:rounded-4xl bg-black border border-border/20 max-w-7xl w-[calc(100%-32px)] md:w-[calc(100%-64px)] xl:w-[calc(100%-120px)] mb-6 shadow-2xl">
                <div className="lg:col-span-3 space-y-6">
                    <a href="/" className="block w-fit">
                        <Paw variant="filled" className="text-white size-8" />
                        <span className="sr-only">Purpaw</span>
                    </a>
                    <p className="text-base text-white md:text-lg max-w-xl">Purpaw membatu Anda dalam memberi layanan terbaik pada kucing peliharaan Anda, membantu komunitas, serta dibantu AI dalam menangani kasus kasus tertentu yang tidak Anda temukan di aplikasi lain.</p>
                    <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                        {/* X (Twitter) */}
                        <a href="#" className="text-white/60 hover:text-white" aria-label="X (Twitter)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </a>
                        {/* Github */}
                        <a href="#" className="text-white/60 hover:text-white" aria-label="Github">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </a>
                        {/* Linkedin */}
                        <a href="#" className="text-white/60 hover:text-white" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="#" className="text-white/60 hover:text-white" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-28 items-start">
                    {/* Products */}
                    <div>
                        <h3 className="font-medium text-sm mb-4">Products</h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li><Link005 href="#" className="hover:text-white">Todo</Link005></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-medium text-sm mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li><Link005 href="#" className="hover:text-white">Todo</Link005></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="font-medium text-sm mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li><Link005 href="#" className="hover:text-white">Todo</Link005></li>
                            <li className="flex items-center gap-2">
                                <Link005 href="#" className="hover:text-white">Todo</Link005>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary border border-primary text-white">LABEL</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="w-full mx-auto mt-12 pt-6 lg:pt-8 xl:pt-12 border-t border-border/20 flex justify-between items-center">
                    <p className="text-white text-sm">&copy; {new Date().getFullYear()} Purpaw</p>
                    <p className='text-sm text-white'>All right reserved.</p>
                </div>
            </div>
            <div className="sticky bottom-0 z-10 w-full flex flex-col items-center">
                <span className="mx-auto text-[16vw] xl:text-[18vw] bg-linear-to-b from-black to-white bg-clip-text text-transparent font-black leading-tight text-center uppercase cursor-none pointer-events-none select-none">Purpaw</span>
            </div>
        </footer>
    )
}
