export default async (req, context) => {
    try {
        const url = new URL(req.url);
        const endpoint = url.searchParams.get("endpoint") || "v1/app/produk";
        
        url.searchParams.delete("endpoint");
        const queryString = url.searchParams.toString();

        // Menggunakan domain resmi yang benar: bukaolshop.net
        let targetUrl = `https://openapi.bukaolshop.net/${endpoint}`;
        
        const token = Netlify.env.get("BUKAOLSHOP_TOKEN");
        
        // Gabungkan parameter dan token dengan benar
        let separator = targetUrl.includes("?") ? "&" : "?";
        if (queryString) {
            targetUrl += `${separator}${queryString}&token=${token}`;
        } else {
            targetUrl += `${separator}token=${token}`;
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
