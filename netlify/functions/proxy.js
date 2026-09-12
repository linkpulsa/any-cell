export default async (req, context) => {
    const TOKEN_API_BUKAOLSHOP = Netlify.env.get("BUKAOLSHOP_TOKEN");

    try {
        const url = new URL(req.url);
        const endpoint = url.searchParams.get("endpoint") || "v1/app/produk";
        
        let targetUrl = `https://openapi.bukaolshop.net/${endpoint}`;
        
        url.searchParams.delete("endpoint");
        const queryString = url.searchParams.toString();
        if (queryString) {
            targetUrl += `?${queryString}`;
        }

        const fetchOptions = {
            method: req.method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (req.method !== "GET" && req.method !== "HEAD") {
            const bodyData = await req.json().catch(() => ({}));
            bodyData.token = TOKEN_API_BUKAOLSHOP;
            fetchOptions.body = JSON.stringify(bodyData);
        } else {
            if (!targetUrl.includes("token=")) {
                targetUrl += (targetUrl.includes("?") ? "&" : "?") + `token=${TOKEN_API_BUKAOLSHOP}`;
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const hasilBukaOlshop = await response.json();

        return new Response(JSON.stringify(hasilBukaOlshop), {
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
