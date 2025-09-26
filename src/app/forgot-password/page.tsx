'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Swal: any;
  }
}

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const lengthValid = formData.newPassword.length >= 8 && formData.newPassword.length <= 16;
  const caseValid = /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword);
  const numberValid = /\d/.test(formData.newPassword);
  const matchValid = formData.newPassword && formData.newPassword === formData.confirmPassword;
  const isPasswordValid = lengthValid && caseValid && numberValid && matchValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = '';
      let payload: any = {};

      switch (step) {
        case 1:
          endpoint = '/api/forgot-password-send.php';
          payload = { email: formData.email };
          break;
        case 2:
          endpoint = '/api/forgot-password-verify.php';
          payload = { otp: formData.otp };
          break;
        case 3:
          if (!isPasswordValid) {
            if (window.Swal) {
              window.Swal.fire({
                title: "Error",
                text: "Password tidak valid atau konfirmasi tidak cocok!",
                icon: "error",
                confirmButtonText: "Ok"
              });
            }
            setIsLoading(false);
            return;
          }
          endpoint = '/api/forgot-password-reset.php';
          payload = { newPassword: formData.newPassword };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        if (step < 3) {
          setStep(step + 1);
          if (window.Swal) {
            window.Swal.fire({
              title: "Berhasil",
              text: result.message,
              icon: "success",
              confirmButtonText: "Ok"
            });
          }
        } else {
          if (window.Swal) {
            window.Swal.fire({
              title: "Berhasil",
              text: "Password berhasil direset, silakan login.",
              icon: "success",
              confirmButtonText: "Ok"
            }).then(() => router.push('/signin'));
          } else {
            router.push('/signin');
          }
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
      console.error(error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem!",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Lupa Password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Ikuti langkah berikut untuk reset password akun kamu.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
              >
                {isLoading ? 'Mengirim...' : 'Kirim OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Masukkan OTP"
                value={formData.otp}
                onChange={handleInputChange}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              {/* Password Baru */}
              <div className="flex items-center border rounded-lg p-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Password Baru"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-500 hover:text-gray-700"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {formData.newPassword.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                  <li>
                    <i className={`fa-solid ${lengthValid ? 'fa-check text-neutral-600' : 'fa-times text-red-500'} mr-2`}></i>
                    8-16 karakter
                  </li>
                  <li>
                    <i className={`fa-solid ${caseValid ? 'fa-check text-neutral-600' : 'fa-times text-red-500'} mr-2`}></i>
                    Huruf besar & kecil
                  </li>
                  <li>
                    <i className={`fa-solid ${numberValid ? 'fa-check text-neutral-600' : 'fa-times text-red-500'} mr-2`}></i>
                    Minimal 1 angka
                  </li>
                </ul>
              )}

              {/* Konfirmasi Password */}
              <div className="flex items-center border rounded-lg p-1 mt-2">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Konfirmasi Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="px-3 text-gray-500 hover:text-gray-700"
                >
                  <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {!matchValid && formData.confirmPassword && (
                <p className="text-red-500 text-sm">Password tidak cocok!</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Mereset...' : 'Reset Password'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
