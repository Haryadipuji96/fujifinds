'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Scale, CreditCard, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'

export default function TermsPage() {
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
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Syarat & Ketentuan
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Baca dan pahami syarat dan ketentuan penggunaan layanan Affiliate Store.
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
            
            {/* Penerimaan Syarat */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Penerimaan Syarat
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Dengan mengakses dan menggunakan website Affiliate Store, Anda menyetujui untuk terikat dengan 
                syarat dan ketentuan ini. Jika tidak setuju, harap tidak menggunakan layanan kami.
              </p>
            </div>

            {/* Penggunaan Layanan */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Penggunaan Layanan
              </h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Anda harus berusia minimal 18 tahun atau memiliki izin orang tua</li>
                <li>Anda bertanggung jawab atas aktivitas akun Anda</li>
                <li>Dilarang menggunakan layanan untuk tujuan ilegal</li>
                <li>Kami berhak menghentikan akses jika melanggar ketentuan</li>
              </ul>
            </div>

            {/* Link Affiliate */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                Link Affiliate
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Website ini menggunakan link affiliate. Saat Anda membeli produk melalui link kami, 
                kami mungkin menerima komisi. Ini tidak mempengaruhi harga yang Anda bayarkan. 
                Kami hanya merekomendasikan produk yang kami yakini berkualitas.
              </p>
            </div>

            {/* Akurasi Informasi */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-500" />
                Akurasi Informasi
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami berusaha memberikan informasi produk yang akurat, namun tidak menjamin bahwa deskripsi, 
                harga, atau ketersediaan produk selalu tepat. Harga dan ketersediaan dapat berubah tanpa pemberitahuan.
              </p>
            </div>

            {/* Batasan Tanggung Jawab */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-purple-500" />
                Batasan Tanggung Jawab
              </h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Kami tidak bertanggung jawab atas kerugian langsung atau tidak langsung</li>
                <li>Transaksi pembelian sepenuhnya antara Anda dan merchant (Shopee/TikTok Shop)</li>
                <li>Kami tidak menjamin hasil atau keuntungan dari penggunaan produk</li>
                <li>Layanan disediakan "sebagai adanya" tanpa jaminan tersurat</li>
              </ul>
            </div>

            {/* Perubahan Ketentuan */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Perubahan Ketentuan
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan di website 
                dan berlaku efektif setelah dipublikasikan. Penggunaan berkelanjutan berarti penerimaan perubahan.
              </p>
            </div>

            {/* Hukum yang Berlaku */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3">⚖️ Hukum yang Berlaku</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan 
                di pengadilan yang berwenang di Jakarta, Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}