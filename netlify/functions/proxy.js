export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const dataPelanggan = await req.json();
        const TOKEN_API_BUKAOLSHOP = Netlify.env.get("BUKAOLSHOP_TOKEN");

        const response = await fetch("https://openapi.bukaolshop.net/v1/app/transaksi/buat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: TOKEN_API_BUKAOLSHOP,
                barang_id: dataPelanggan.barangId,
                tujuan: dataPelanggan.nomorTujuan
            })
        });

        const hasilDariBukaOlshop = await response.json();

        return new Response(JSON.stringify(hasilDariBukaOlshop), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
