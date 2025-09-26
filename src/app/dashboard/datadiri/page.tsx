'use client';

import { useState, useEffect } from 'react';

interface DataDiri {
  nisn: string;
  tempat_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  no_hp: string;
  asal_sekolah: string;
  nama_ayah: string;
  nama_ibu: string;
  pekerjaan_ayah: string;
  pekerjaan_ibu: string;
  penghasilan_ortu: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function DataDiriPage() {
  const [formData, setFormData] = useState<DataDiri>({
    nisn: '',
    tempat_lahir: '',
    jenis_kelamin: '',
    agama: '',
    alamat: '',
    no_hp: '',
    asal_sekolah: '',
    nama_ayah: '',
    nama_ibu: '',
    pekerjaan_ayah: '',
    pekerjaan_ibu: '',
    penghasilan_ortu: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDataDiri();
  }, []);

  const fetchDataDiri = async () => {
    try {
      const response = await fetch('/api/data-diri.php');
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data diri:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/data-diri.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        if (window.Swal) {
          window.Swal.fire({
            title: "Berhasil",
            text: "Data diri berhasil disimpan!",
            icon: "success",
            confirmButtonText: "Ok"
          });
        }
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
      console.error('Error saving data:', error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } finally {
      setSaving(false);
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
          <h1 className="text-lg font-bold text-white">Formulir Data Diri</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <i className="fa-solid fa-info-circle text-blue-600 mt-0.5 mr-3"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Petunjuk Pengisian:</p>
                <p className="mt-1">Isilah semua data dengan lengkap dan benar sesuai dengan dokumen resmi yang Anda miliki.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Peserta */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Peserta</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NISN</label>
              <input
                type="text"
                name="nisn"
                value={formData.nisn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
              <input
                type="text"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">-- Pilih --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
              <select
                name="agama"
                value={formData.agama}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">-- Pilih --</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP/WhatsApp</label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asal Sekolah</label>
              <input
                type="text"
                name="asal_sekolah"
                value={formData.asal_sekolah}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            {/* Data Orang Tua */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Orang Tua</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ayah</label>
              <input
                type="text"
                name="nama_ayah"
                value={formData.nama_ayah}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ibu</label>
              <input
                type="text"
                name="nama_ibu"
                value={formData.nama_ibu}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan Ayah</label>
              <input
                type="text"
                name="pekerjaan_ayah"
                value={formData.pekerjaan_ayah}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan Ibu</label>
              <input
                type="text"
                name="pekerjaan_ibu"
                value={formData.pekerjaan_ibu}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penghasilan Orang Tua</label>
              <select
                name="penghasilan_ortu"
                value={formData.penghasilan_ortu}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">-- Pilih --</option>
                <option value="< 1 juta">Kurang dari Rp 1.000.000</option>
                <option value="1-3 juta">Rp 1.000.000 - Rp 3.000.000</option>
                <option value="3-5 juta">Rp 3.000.000 - Rp 5.000.000</option>
                <option value="> 5 juta">Lebih dari Rp 5.000.000</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i className="fa-solid fa-save"></i>
                {saving ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}