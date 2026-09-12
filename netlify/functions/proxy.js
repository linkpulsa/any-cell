export default async (req, context) => {
    try {
        const url = new URL(req.url);
        const endpoint = url.searchParams.get("endpoint") || "app/produk";
        
        url.searchParams.delete("endpoint");
        
        let targetUrl = `https://openapi.bukaolshop.net/v1/${endpoint}`;
        const token = Netlify.env.get("BUKAOLSHOP_TOKEN");

        if (token) {
            url.searchParams.set("token", token);
        }

        const queryString = url.searchParams.toString();
        if (queryString) {
            targetUrl += `?${queryString}`;
        }

        const response = await fetch(targetUrl);
        const textResult = await response.text();

        // Cek apakah balasan dari BukaOlshop berbentuk JSON atau HTML error
        let data;
        try {
            data = JSON.parse(textResult);
        } catch (e) {
            return new Response(JSON.stringify({ 
                error: "BukaOlshop mengembalikan HTML/Bukan JSON", 
                raw_response: textResult,
                target_url: targetUrl 
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

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
