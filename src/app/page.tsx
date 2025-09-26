
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="m-0 h-screen flex flex-col">
      <nav className="w-full p-4 bg-white border-b border-neutral-200">
        <Link href="#" className="flex justify-center items-center">
          <Image
            src="/images/favicon.png"
            alt="SMK Antartika 2 Logo"
            width={48}
            height={48}
            className="w-9 md:w-12"
          />
          <p className="w-22 font-extrabold text-neutral-900 text-md md:text-lg leading-none font-arial ml-2">
            SMK ANTARTIKA 2
          </p>
        </Link>
      </nav>

      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:80px_80px] -z-10"></div>

      <section className="flex-1 flex-inline lg:flex font-poppins">
        <div className="flex-1 flex justify-center items-center pl-3 lg:pl-20 pt-10">
          <div className="flex flex-col md:items-start items-center justify-center gap-3 bg-white h-fit p-5 rounded-lg">
            <p className="text-sm flex gap-2">
              <FontAwesomeIcon icon={faGraduationCap} className='w-4' /> Selamat datang di
            </p>
            <h1 className="text-2xl md:text-4xl font-bold leading-none max-w-80 md:max-w-120 text-center md:text-start font-[poppins]">
              Portal Penerimaan Peserta Didik Baru (PPDB)
            </h1>
            <p className="text-md md:text-lg font-bold">SMK Antartika 2 Sidoarjo</p>
            <br />
            <p className="text-sm text-neutral-600 text-center md:text-start">
              Bergabunglah dengan kami dalam mengadopsi teknologi dan membuka peluang pendidikan tanpa batas 🚀
            </p>
            <Link
              href="/welcome"
              className="w-fit p-4 m-0 md:m-2 bg-neutral-500 text-white rounded-2xl text-sm font-medium hover:bg-neutral-600 transition-colors"
            >
              <i className="fa-solid fa-bolt-lightning"></i> Mulai Perjalananmu!
            </Link>
          </div>
        </div>
        <div className="flex-1 p-3 flex flex-col items-center justify-center">
          <Image
            src="https://i.imgur.com/hM6wOj5.png"
            alt="PPDB Illustration"
            width={800}
            height={700}
            className="max-w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
}