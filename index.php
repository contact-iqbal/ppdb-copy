<?php include './layout.php'; ?>

<body class="m-0 h-screen flex flex-col">
    <nav class="w-full p-4 bg-white border-b border-neutral-200">
        <a href="#" class="flex justify-center items-center">
            <img src="./public/images/favicon (1).png" class="w-9 md:w-12" alt="">
            <p class="w-22 font-extrabold text-neutral-900 text-md md:text-lg leading-none font-[arial]">SMK ANTARTIKA 2</p>
        </a>
    </nav>

    <div class="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:80px_80px] -z-10">
    </div>

    <section class="flex-1 flex-inline lg:flex font-[poppins]">

        <div class="flex-1 flex justify-center items-center pl-3 lg:pl-20 pt-10">

            <div class="flex flex-col md:items-start items-center justify-center gap-3 bg-white h-fit  p-5">
                <p class=" text-sm"><i class="fa-solid fa-graduation-cap"></i> Selamat datang di</p>
                <h1 class="text-2xl md:text-4xl font-bold max-w-80 md:max-w-120 text-center md:text-start">Portal Penerimaan Peserta Didik Baru (PPDB)</h1>
                <p class="text-md md:text-lg font-bold">SMK Antartika 2 Sidoarjo</p>
                <br>
                <p class="text-sm text-neutral-600 text-center md:text-start">Bergabunglah dengan kami dalam mengadopsi teknologi dan membuka peluang pendidikan tanpa batas 🚀</p>
                <a href="./src/page/welcome.php" class="w-fit p-4 m-0 md:m-2 bg-neutral-500 text-white rounded-2xl text-sm font-medium hover:bg-neutral-600"><i class="fa-solid fa-bolt-lightning"></i> Mulai Perjalananmu!</a>
            </div>
        </div>
        <div class="flex-1 p-3 flex flex-col items-center justify-center">
            <img src="https://i.imgur.com/hM6wOj5.png" alt="">
        </div>

    </section>
</body>