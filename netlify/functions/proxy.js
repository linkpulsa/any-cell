export default async (req, context) => {
    try {
        const url = new URL(req.url);
        const endpoint = url.searchParams.get("endpoint") || "app/produk";
        
        // Hapus parameter 'endpoint' agar tidak ikut terkirim ke target API BukaOlshop
        url.searchParams.delete("endpoint");
        
        // Base URL resmi BukaOlshop Open API
        let targetUrl = `https://openapi.bukaolshop.net/v1/${endpoint}`;

        // Ambil token dari Environment Variable Netlify
        const token = Netlify.env.get("BUKAOLSHOP_TOKEN");

        if (token) {
            // Masukkan token ke parameter query secara aman
            url.searchParams.set("token", token);
        }

        // Gabungkan semua sisa parameter dengan rapi
        const queryString = url.searchParams.toString();
        if (queryString) {
            targetUrl += `?${queryString}`;
        }

        const response = await fetch(targetUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
