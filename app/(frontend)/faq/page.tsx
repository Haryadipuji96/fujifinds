'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingBag, CreditCard, Truck, Shield, HelpCircle, MessageCircle, Package, RefreshCw } from 'lucide-react'
import Link from 'next/link'

type FAQItem = {
  question: string
  answer: string
  icon: React.ReactNode
}

export default function FAQPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'Apa itu Affiliate Store?',
      answer: 'Affiliate Store adalah platform affiliate shopping yang merekomendasikan produk terbaik dari Shopee dan TikTok Shop. Kami membantu Anda menemukan produk berkualitas dengan harga terbaik.',
      icon: <ShoppingBag className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Apakah aman berbelanja melalui link di sini?',
      answer: 'Ya, sangat aman! Semua link affiliate kami adalah link resmi dari Shopee dan TikTok Shop. Anda akan diarahkan langsung ke website resmi mereka untuk bertransaksi, bukan ke situs lain.',
      icon: <Shield className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Apakah harga produk lebih mahal jika beli dari sini?',
      answer: 'Tidak! Harga yang Anda bayarkan SAMA PERSIS seperti jika Anda membuka Shopee/TikTok Shop langsung. Kami hanya mendapat komisi dari merchant, tanpa membebani Anda biaya tambahan.',
      icon: <CreditCard className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Berapa lama pengiriman produk?',
      answer: 'Lama pengiriman tergantung toko dan kurir yang dipilih di Shopee/TikTok Shop. Biasanya 1-7 hari untuk dalam kota, 3-14 hari untuk luar kota. Informasi lengkap bisa dilihat di halaman checkout masing-masing platform.',
      icon: <Truck className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Bagaimana cara mengembalikan produk?',
      answer: 'Kebijakan pengembalian produk mengikuti ketentuan masing-masing platform (Shopee/TikTok Shop). Umumnya ada garansi dan pengembalian dana jika produk cacat atau tidak sesuai deskripsi.',
      icon: <RefreshCw className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Apakah produk yang direkomendasikan original/authentic?',
      answer: 'Kami hanya merekomendasikan produk dari toko terpercaya dengan rating tinggi. Namun, keaslian produk tetap bergantung pada toko penjual di platform. Kami sarankan cek rating dan review toko sebelum membeli.',
      icon: <Package className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Bagaimana cara menghubungi customer support?',
      answer: 'Anda bisa menghubungi kami melalui email support@affiliatestore.com atau melalui formulir kontak di halaman About. Kami akan merespon dalam 1x24 jam.',
      icon: <MessageCircle className="h-5 w-5 text-purple-500" />
    },
    {
      question: 'Apakah ada biaya untuk menggunakan Affiliate Store?',
      answer: 'Tidak ada biaya sama sekali! Affiliate Store gratis untuk digunakan. Anda hanya membayar produk yang Anda beli di Shopee/TikTok Shop seperti biasa.',
      icon: <CreditCard className="h-5 w-5 text-purple-500" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-4 md:mb-6 gap-2 -ml-2 text-sm rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                FAQ
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Pertanyaan yang sering diajukan tentang Affiliate Store
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full">
            <path fill="currentColor" fillOpacity="0.1" d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" className="text-white dark:text-slate-950" />
          </svg>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">
              Pertanyaan Umum
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-5 md:px-6 py-4 flex items-center justify-between text-left hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/50">
                      {faq.icon}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-white text-sm md:text-base">
                      {faq.question}
                    </span>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-5 md:px-6 pb-4 pt-0 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hubungi Kami */}
          <div className="mt-10 text-center p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              Masih punya pertanyaan?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Hubungi tim support kami, siap membantu Anda
            </p>
            <Link href="/about">
              <Button variant="outline" className="gap-2 rounded-xl border-purple-500 text-purple-600 dark:text-purple-400">
                <MessageCircle className="h-4 w-4" />
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}