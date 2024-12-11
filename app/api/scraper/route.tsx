import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

interface ScrapeResponse {
  image: string | null;
}

interface Metadata {
    title: string;
    ogTitle: string;
    ogImage: string;
  }

async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const url = searchParams.get('url')

    if(!url){
        return NextResponse.json(
            {error: "Missing url in query"},{status: 400}
        ).headers.set("Access-Control-Allow-Origin", "*")
    }
    try {
        const response = await axios.get(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.amazon.com/",
            },
          })
        const html = await response.data

        const $ = cheerio.load(html);
        
        console.log($('meta').toArray().map(el => $(el).toString())); // Logs all <meta> tags
        const scripts = $('script').toArray(); // Extract all <script> elements
        let imageUrl = "/image_NA.jpg"; // Default placeholder

        for (const script of scripts) {
            const scriptContent = $(script).html(); // Get script content
            if (scriptContent && scriptContent.includes("https://m.media-amazon.com")) {
              const match = scriptContent.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[^\s"']+\.jpg/);
              if (match) {
                imageUrl = match[0]; // Extract the first matching URL
                break; // Exit the loop once a match is found
              }
            }
          }

        console.log(imageUrl)

        const metadata: Metadata = {
            title: $('head > title').text() || "No title found",
            ogTitle: $('meta[name="title"]').attr('content') || 'No OG title found',
            ogImage: imageUrl || "/image_NA.jpg"
        }
        console.log(metadata)

        const resReturn = NextResponse.json(metadata, {status: 200})
        resReturn.headers.set("Access-Control-Allow-Origin", "*")
        resReturn.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        resReturn.headers.set("Access-Control-Allow-Headers", "Content-Type")
        return resReturn
  } catch (error) {
    console.error('Error scraping metadata:', error);
    return NextResponse.json(
        {error: "Failed to scrape metadata"},{status: 500}
    ).headers.set("Access-Control-Allow-Origin", "*")
  }
}

export {GET}