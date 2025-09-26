'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import { useState } from 'react';

declare global {
  interface Window {
    Swal: any;
  }
}

export default function Jenjang() {
  const [selectedJenjang, setSelectedJenjang] = useState<string>('');

  const handleJenjangSelection = (jenjang: string) => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: "Konfirmasi",
        text: `Anda memilih jenjang ${jenjang}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Lanjut",
        cancelButtonText: "Batal"
      }).then((result: any) => {
        if (result.isConfirmed) {
          window.location.href = `/sekolah?jenjang=${jenjang}`;
        }
      });
    } else {
      // Fallback jika SweetAlert belum loaded
      if (confirm(`Anda memilih jenjang ${jenjang}. Lanjutkan?`)) {
        window.location.href = `/sekolah?jenjang=${jenjang}`;
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full flex-1 rounded-lg relative bg-white flex flex-col font-poppins p-6 md:p-12 lg:p-16">
        {/* Header */}
        <div className="h-fit w-full mb-6 flex flex-wrap items-center">
          <div className="flex justify-center items-center">
            <Link href="/welcome" className="p-2 rounded-lg bg-neutral-100 transition-all hover:bg-neutral-200">
              <FontAwesomeIcon icon={faCaretLeft} />
            </Link>
          </div>
          <div className="flex-1 text-start md:text-center ml-2 md:ml-0 mt-2 md:mt-0">
            <h1 className="font-bold text-xl md:text-2xl font-arial leading-none">
              Silahkan pilih jenjang yang ingin kamu masuki
            </h1>
            <p className="text-xs mt-2 text-neutral-800 md:text-sm">
              Sebelum kamu memilih sekolah, pilih jenjangmu dulu, yuk!
            </p>
          </div>
        </div>

        {/* Container Card */}
        <div className="w-full flex flex-wrap gap-4 justify-center mt-10">
          {/* Card SMP */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="https://ppdb.telkomschools.sch.id/image/SMP.png"
                alt="SMP"
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">SMP</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Nikmati pengalaman belajar yang berkualitas di SMP Antartika dengan komunitas yang dinamis 🏃
              </p>
              <button
                onClick={() => handleJenjangSelection('SMP')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>

          {/* Card SMA */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="https://ppdb.telkomschools.sch.id/image/sma-new.png"
                alt="SMA"
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">SMA</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Dapatkan kesempatan untuk mengembangkan potensi akademik dan non-akademik di SMA Antartika 📖
              </p>
              <button
                onClick={() => handleJenjangSelection('SMA')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>

          {/* Card SMK */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="https://ppdb.telkomschools.sch.id/image/smk-img.png"
                alt="SMK"
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">SMK</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Dapatkan pendidikan kejuruan di SMK Antartika yang berfokus pada persiapan karir yang kokoh 💼
              </p>
              <button
                onClick={() => handleJenjangSelection('SMK')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}