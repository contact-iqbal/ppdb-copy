'use client';

import { useState, useEffect } from 'react';

interface Berkas {
  id: number;
  jenis_berkas: string;
  nama_file: string;
  status: string;
  uploaded_at: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function BerkasPage() {
  const [berkasList, setBerkasList] = useState<Berkas[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const berkasTypes = [
    { key: 'kk', label: 'Kartu Keluarga', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'akta', label: 'Akta Kelahiran', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'ijazah', label: 'Ijazah/SKL', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'foto', label: 'Pas Foto 3x4', accept: '.jpg,.jpeg,.png' },
    { key: 'rapor', label: 'Rapor Semester Terakhir', accept: '.pdf,.jpg,.jpeg,.png' }
  ];

  useEffect(() => {
    fetchBerkas();
  }, []);

  const fetchBerkas = async () => {
    try {
      const response = await fetch('/api/berkas.php');
      const result = await response.json();
      
      if (result.success) {
        setBerkasList(result.data);
      }
    } catch (error) {
      console.error('Error fetching berkas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (jenisBerkas: string, file: File) => {
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Ukuran file maksimal 2MB",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
      return;
    }

    setUploading(jenisBerkas);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jenis_berkas', jenisBerkas);

    try {
      const response = await fetch('/api/berkas.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        if (window.Swal) {
          window.Swal.fire({
            title: "Berhasil",
            text: "Berkas berhasil diupload!",
            icon: "success",
            confirmButtonText: "Ok"
          });
        }
        fetchBerkas(); // Refresh list
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
      console.error('Error uploading file:', error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan saat upload",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } finally {
      setUploading(null);
    }
  };

  const getBerkasStatus = (jenisBerkas: string) => {
    return berkasList.find(b => b.jenis_berkas === jenisBerkas);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Terverifikasi</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Ditolak</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Belum Upload</span>;
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
          <h1 className="text-lg font-bold text-white">Upload Berkas</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <i className="fa-solid fa-info-circle text-blue-600 mt-0.5 mr-3"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Ketentuan Upload:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Format file: PDF, JPG, JPEG, PNG</li>
                  <li>Ukuran maksimal: 2MB per file</li>
                  <li>Pastikan dokumen jelas dan dapat dibaca</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {berkasTypes.map((type) => {
              const berkas = getBerkasStatus(type.key);
              const isUploading = uploading === type.key;
              
              return (
                <div key={type.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      {berkas && (
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-gray-600">{berkas.nama_file}</p>
                          {getStatusBadge(berkas.status)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id={`file-${type.key}`}
                        accept={type.accept}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(type.key, file);
                          }
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor={`file-${type.key}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                          isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : berkas
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            Uploading...
                          </>
                        ) : berkas ? (
                          <>
                            <i className="fa-solid fa-edit mr-2"></i>
                            Ganti File
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-upload mr-2"></i>
                            Upload
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}