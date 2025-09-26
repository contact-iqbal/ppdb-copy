'use client';

import { useState, useEffect } from 'react';

interface Jalur {
  id: number;
  nama: string;
  deskripsi: string;
  periode_mulai: string;
  periode_selesai: string;
  biaya: number;
  status: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function JalurPage() {
  const [jalurList, setJalurList] = useState<Jalur[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJalur, setSelectedJalur] = useState<number | null>(null);

  useEffect(() => {
    fetchJalur();
  }, []);

  const fetchJalur = async () => {
    try {
      const response = await fetch('/api/jalur.php');
      const result = await response.json();
      
      if (result.success) {
        setJalurList(result.data);
      }
    } catch (error) {
      console.error('Error fetching jalur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJalur = async (jalur: Jalur) => {
    if (jalur.status !== 'aktif') {
      if (window.Swal) {
        window.Swal.fire({
          title: "Tidak Tersedia",
          text: "Jalur ini sedang tidak aktif",
          icon: "warning",
          confirmButtonText: "Ok"
        });
      }
      return;
    }

    if (window.Swal) {
      const result = await window.Swal.fire({
        title: "Konfirmasi Pilihan",
        text: `Apakah Anda yakin memilih jalur ${jalur.nama}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Pilih",
        cancelButtonText: "Batal"
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch('/api/jalur.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jalur_id: jalur.id })
          });

          const result = await response.json();

          if (result.success) {
            window.Swal.fire({
              title: "Berhasil",
              text: "Jalur berhasil dipilih!",
              icon: "success",
              confirmButtonText: "Ok"
            }).then(() => {
              window.location.reload();
            });
          } else {
            window.Swal.fire({
              title: "Error",
              text: result.message,
              icon: "error",
              confirmButtonText: "Ok"
            });
          }
        } catch (error) {
          console.error('Error selecting jalur:', error);
          window.Swal.fire({
            title: "Error",
            text: "Terjadi kesalahan sistem",
            icon: "error",
            confirmButtonText: "Ok"
          });
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <i className="fa-solid fa-triangle-exclamation text-yellow-600 mt-0.5 mr-3"></i>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Perhatian:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Jadwal dapat berubah sewaktu-waktu</li>
              <li>Semua biaya yang sudah dibayarkan tidak dapat dikembalikan</li>
              <li>Pastikan memilih jalur dengan teliti</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Jalur List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h1 className="text-lg font-bold text-white">Daftar Jalur Pendaftaran</h1>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jalur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jalurList.map((jalur) => (
                <tr key={jalur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-blue-700">{jalur.nama}</div>
                      <div className="text-sm text-gray-500">{jalur.deskripsi}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(jalur.periode_mulai)} - {formatDate(jalur.periode_selesai)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(jalur.biaya)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      jalur.status === 'aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {jalur.status === 'aktif' ? 'Dibuka' : 'Ditutup'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSelectJalur(jalur)}
                      disabled={jalur.status !== 'aktif'}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        jalur.status === 'aktif'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}