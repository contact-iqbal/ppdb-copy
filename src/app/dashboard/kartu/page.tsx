'use client';

import { useState, useEffect } from 'react';

interface Kartu {
  id: number;
  nomor_peserta: string;
  status: string;
  generated_at: string;
  nama: string;
  email: string;
  wa: string;
  sekolah_nama: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function KartuPage() {
  const [kartu, setKartu] = useState<Kartu | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchKartu();
  }, []);

  const fetchKartu = async () => {
    try {
      const response = await fetch('/api/kartu.php');
      const result = await response.json();
      
      if (result.success && result.data) {
        setKartu(result.data);
      }
    } catch (error) {
      console.error('Error fetching kartu:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateKartu = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/kartu.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });

      const result = await response.json();

      if (result.success) {
        if (window.Swal) {
          window.Swal.fire({
            title: "Berhasil",
            text: "Kartu peserta berhasil dibuat!",
            icon: "success",
            confirmButtonText: "Ok"
          });
        }
        fetchKartu();
      } else {
        if (window.Swal) {
          window.Swal.fire({
            title: "Error",
            text: result.message,
            icon: "error",
            confirmButtonText: "Ok"
          });
        }
      }
    } catch (error) {
      console.error('Error generating kartu:', error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement download functionality
    if (window.Swal) {
      window.Swal.fire({
        title: "Info",
        text: "Fitur download akan segera tersedia",
        icon: "info",
        confirmButtonText: "Ok"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h1 className="text-lg font-bold text-white">Kartu Peserta</h1>
        </div>
        
        <div className="p-6">
          {!kartu ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-id-card text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 mb-4">Kartu peserta belum tersedia</p>
              <p className="text-sm text-gray-400 mb-6">
                Selesaikan pembayaran terlebih dahulu untuk dapat membuat kartu peserta
              </p>
              <button
                onClick={generateKartu}
                disabled={generating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Membuat Kartu...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus mr-2"></i>
                    Buat Kartu Peserta
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {/* Kartu Peserta */}
              <div className="w-full max-w-md bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-white text-blue-900 text-center font-bold py-3">
                  KARTU PESERTA PPDB 2025
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Foto */}
                    <div className="w-20 h-24 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                      <i className="fa-solid fa-user text-gray-400 text-2xl"></i>
                    </div>
                    
                    {/* Data */}
                    <div className="flex-1 text-sm space-y-1">
                      <p><span className="font-semibold">No. Peserta:</span> {kartu.nomor_peserta}</p>
                      <p><span className="font-semibold">Nama:</span> {kartu.nama}</p>
                      <p><span className="font-semibold">Email:</span> {kartu.email}</p>
                      <p><span className="font-semibold">No. WA:</span> {kartu.wa}</p>
                      <p><span className="font-semibold">Sekolah:</span> {kartu.sekolah_nama}</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="bg-white text-blue-900 text-center text-xs py-2">
                  Harap membawa kartu ini saat verifikasi & ujian seleksi
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-print"></i>
                  Cetak
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-download"></i>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}