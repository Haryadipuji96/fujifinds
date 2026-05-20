'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Trash2, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const router = useRouter()

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
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Kebijakan Privasi
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Kami melindungi data pribadi Anda. Baca kebijakan privasi kami untuk informasi lebih lanjut.
            </p>
            <p className="text-white/60 text-xs mt-2">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full">
            <path fill="currentColor" fillOpacity="0.1" d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" className="text-white dark:text-slate-950" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            
            {/* Pendahuluan */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-500" />
                Pendahuluan
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Affiliate Store berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan 
                bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan 
                layanan kami.
              </p>
            </div>

            {/* Informasi yang Dikumpulkan */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Informasi yang Kami Kumpulkan
              </h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Informasi yang Anda berikan saat mendaftar (nama, email)</li>
                <li>Data penggunaan dan preferensi produk</li>
                <li>Informasi perangkat dan browser</li>
                <li>Cookie untuk meningkatkan pengalaman berbelanja</li>
                <li>Data klik affiliate untuk komisi dan analitik</li>
              </ul>
            </div>

            {/* Penggunaan Informasi */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                Penggunaan Informasi
              </h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Menyediakan dan meningkatkan layanan affiliate shopping</li>
                <li>Mengirimkan rekomendasi produk yang relevan</li>
                <li>Menganalisis tren dan preferensi pengguna</li>
                <li>Memproses komisi affiliate</li>
                <li>Mengirim notifikasi dan update penting</li>
              </ul>
            </div>

            {/* Perlindungan Data */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                Perlindungan Data
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami menggunakan teknologi enkripsi SSL untuk melindungi data Anda. Informasi pribadi tidak akan 
                dijual atau disewakan kepada pihak ketiga. Kami hanya berbagi data dengan mitra tepercaya 
                (Shopee, TikTok Shop) yang mendukung layanan affiliate kami.
              </p>
            </div>

            {/* Hak Anda */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-500" />
                Hak Anda
              </h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Mengakses data pribadi yang kami simpan</li>
                <li>Memperbaiki data yang tidak akurat</li>
                <li>Menghapus akun dan data Anda</li>
                <li>Menarik persetujuan penggunaan data</li>
                <li>Menerima salinan data Anda (portabilitas)</li>
              </ul>
            </div>

            {/* Cookie */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-purple-500" />
                Cookie
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami menggunakan cookie untuk meningkatkan pengalaman berbelanja, mengingat preferensi Anda, 
                dan melacak klik affiliate. Anda dapat mengatur browser untuk menolak cookie, namun 
                beberapa fitur mungkin tidak berfungsi optimal.
              </p>
            </div>

            {/* Kontak */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3">📞 Kontak</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Jika ada pertanyaan tentang kebijakan privasi, hubungi kami di:
              </p>
              <p className="text-purple-600 dark:text-purple-400 mt-2">
                Email: fujiharyadi0@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}