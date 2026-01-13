// assets/js/sanity.js
import {createClient} from "https://cdn.skypack.dev/@sanity/client";

export const client = createClient({
  projectId: "fwafbt19", // find this in sanity.io manage
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-09-30"
});

// assets/js/sanity-client.js

async function loadProductsAndInit() {
    console.log('[Checkpoint 1] Sanity client is starting...');

    const sanityClient = SanityClient({
        projectId: 'YOUR_PROJECT_ID', // Make sure this is still correct
        dataset: 'production',
        useCdn: true,
        apiVersion: '2024-09-28',
    });

    const query = `*[_type == "product"]{
        "id": slug.current, title, description, link, category, "image": image.asset->url
    }`;

    try {
        console.log('[Checkpoint 2] Attempting to fetch from Sanity...');
        const products = await sanityClient.fetch(query);
        
        console.log('[Checkpoint 3] Data received from Sanity:', products); 
        
        window.PRODUCTS = products;
        
        console.log('[Checkpoint 4] Firing "productsLoaded" event...');
        document.dispatchEvent(new Event('productsLoaded'));
        
    } catch (error) {
        console.error('🚨🚨🚨 SANITY FETCH FAILED:', error);
    }
}

loadProductsAndInit();