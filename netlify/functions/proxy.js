// URL Proxy Netlify Anda
const URL_PROXY = "https://anycell.netlify.app/.netlify/functions/proxy";

let databaseProduk = [];
const ID_KATEGORI_PRODUK = "747379"; // Sesuaikan kategori jika ada

// 1. Fungsi untuk Mengambil Data Produk (Metode GET)
async function ambilDataBukaOlshop() {
    const container = document.getElementById('daftarProduk');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#6b7280; padding:15px; font-size:12px;">Memuat produk...</div>';
    }

    try {
        databaseProduk = [];
        for (let i = 1; i <= 4; i++) {
            // Menggunakan parameter endpoint=v1/app/produk
            let urlApi = `${URL_PROXY}?endpoint=v1/app/produk&page=${i}`;
            
            if (ID_KATEGORI_PRODUK) {
                urlApi += `&id_kategori=${ID_KATEGORI_PRODUK}`;
            }

            const response = await fetch(urlApi);
            const rawJson = await response.json();
            
            let produkData = rawJson;
            if (rawJson && rawJson.body) {
                try {
                    produkData = JSON.parse(rawJson.body);
                } catch (e) {
                    produkData = rawJson.body;
                }
            }

            let listItems = [];
            if (produkData) {
                if (Array.isArray(produkData.data)) {
                    listItems = produkData.data;
                } else if (produkData.data && Array.isArray(produkData.data.data)) {
                    listItems = produkData.data.data;
                } else if (Array.isArray(produkData)) {
                    listItems = produkData;
                }
            }

            if (listItems.length > 0) {
                const mapped = listItems.map(item => {
                    let namaProduk = item.nama_produk || item.nama || "";
                    let descProduk = item.deskripsi_panjang || item.deskripsi || item.deskripsi_singkat || "Tidak ada deskripsi produk.";
                    let statusProdukAPI = (item.status_produk || item.status || "").toString().trim().toLowerCase();
                    
                    let isGangguan = (
                        statusProdukAPI === "gangguan" || 
                        statusProdukAPI === "closed" || 
                        statusProdukAPI === "0" || 
                        statusProdukAPI === "false" ||
                        item.status_produk === 0 ||
                        item.status === 0 ||
                        item.aktif === 0 ||
                        item.aktif === "0"
                    );

                    return {
                        nama: namaProduk,
                        kategori: item.nama_kategori || "Kategori Produk",
                        desc: descProduk,
                        harga: parseInt(item.harga_produk || item.harga || 0),
                        url_produk: item.url_produk || item.link || "",
                        statusProduk: statusProdukAPI || "live",
                        gangguan: isGangguan,
                        barang_id: item.id || item.barang_id || ""
                    };
                });
                databaseProduk = databaseProduk.concat(mapped);
            } else {
                break;
            }
        }
    } catch (error) {
        console.error("Gagal terhubung ke proxy API:", error);
        databaseProduk = [];
    }

    if (typeof filterProduk === 'function') {
        filterProduk();
    }
}

// 2. Fungsi untuk Membuat Transaksi / Penjualan Kasir (Metode POST)
async function buatTransaksiKasir(barangId, nomorTujuan) {
    try {
        const response = await fetch(URL_PROXY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                endpoint: "v1/app/transaksi/buat",
                barangId: barangId,
                nomorTujuan: nomorTujuan
            })
        });

        const hasil = await response.json();
        return hasil;
    } catch (error) {
        console.error("Gagal melakukan transaksi:", error);
        return { status: false, message: error.message };
    }
}

// Jalankan pengambilan produk saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    ambilDataBukaOlshop();
});
