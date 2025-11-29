
import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

function btoa_utf8(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
}

const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

export const generateAffiliatePost = async (
  apiKey: string,
  productName: string,
  productDescription: string,
  affiliateHoplink: string,
  templateName: string,
  onProgress: (step: number, message: string) => void
): Promise<GenerationResult> => {
    if (!apiKey) {
        throw new Error("Gemini API Key is not set. Please set it in Settings.");
    }
    const ai = new GoogleGenAI({ apiKey });

  try {
    onProgress(1, 'Generating high-converting copy...');
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const fullHoplink = new URL(affiliateHoplink);
    fullHoplink.searchParams.append('utm_source', 'affiliateflow');
    fullHoplink.searchParams.append('utm_medium', 'blog_post');
    fullHoplink.searchParams.append('utm_campaign', templateName.toLowerCase().replace(/ /g, '_'));
    const hoplinkWithUtm = fullHoplink.toString();
    
    const ctaButtonHtml = `<a href="${hoplinkWithUtm}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: rgba(255, 128, 0, 0.8); color: white; padding: 15px 30px; font-size: 20px; font-weight: bold; text-decoration: none; border-radius: 8px; text-align: center; transition: background-color 0.3s ease;">GET STARTED NOW – ONLY $47 (One-Time Payment)</a>`;

    const contentPrompt = `
      You are an expert direct response copywriter and SEO specialist with an American marketing tone.
      Generate a complete, high-converting affiliate marketing landing page HTML content for the following product.
      Product Name: "${productName}"
      Product Description: "${productDescription}"
      Template Style: "${templateName}"
      Your response MUST be a JSON object with two keys: "htmlBodyContent" and "imagePrompts".
      "htmlBodyContent" requirements:
      - It must be a single string of HTML content for the <body>. Do NOT include <html>, <head>, or <body> tags.
      - Include SEO-ready elements: a compelling H1 tag.
      - Insert these exact placeholders for images: "[HERO_IMAGE]", "[FEATURES_IMAGE]", "[CTA_BANNER_IMAGE]".
      - Insert this exact placeholder for the button: "[CTA_BUTTON]".
      "imagePrompts" requirements:
      - It must be a JSON object with three keys: "hero", "features", and "ctaBanner".
      - The value for each key must be a descriptive prompt for generating a visually stunning and relevant image (1024x576).
    `;

    const contentGenerationResponse = await ai.models.generateContent({
      model: textModel,
      contents: contentPrompt,
      config: { responseMimeType: "application/json" }
    });
    const generatedContent = JSON.parse(contentGenerationResponse.text);
    const { htmlBodyContent, imagePrompts } = generatedContent;

    onProgress(2, 'Creating 3 professional images...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    const imagePromises = [
      ai.models.generateContent({model: imageModel, contents: imagePrompts.hero, config: { imageConfig: { aspectRatio: "16:9" } }}),
      ai.models.generateContent({model: imageModel, contents: imagePrompts.features, config: { imageConfig: { aspectRatio: "16:9" } }}),
      ai.models.generateContent({model: imageModel, contents: imagePrompts.ctaBanner, config: { imageConfig: { aspectRatio: "16:9" } }})
    ];

    const imageResponses = await Promise.all(imagePromises);
    const base64Images = imageResponses.map(res => {
        const imagePart = res.candidates[0].content.parts.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) throw new Error("Image data not found in response part");
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    });

    onProgress(3, 'Building HTML & CSS...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const seoPrompt = `
      Based on the product "${productName}", create SEO metadata.
      Your response MUST be a valid JSON object with three keys: "title", "metaDescription", and "schemaOrg".
      "schemaOrg" should be a stringified JSON-LD object.
    `;
    const seoResponse = await ai.models.generateContent({
        model: textModel,
        contents: seoPrompt,
        config: { responseMimeType: "application/json" }
    });
    const seoData = JSON.parse(seoResponse.text);

    let finalHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${seoData.title}</title><meta name="description" content="${seoData.metaDescription}"><script src="https://cdn.tailwindcss.com"></script><script type="application/ld+json">${seoData.schemaOrg}</script></head><body class="bg-gray-100 text-gray-800 font-sans"><div class="container mx-auto p-4 md:p-8">${htmlBodyContent}</div></body></html>`;
    finalHtml = finalHtml.replace('[HERO_IMAGE]', `<img src="images/hero.png" alt="Hero image for ${productName}" class="w-full h-auto rounded-lg shadow-lg mb-8">`);
    finalHtml = finalHtml.replace('[FEATURES_IMAGE]', `<img src="images/features.png" alt="Features of ${productName}" class="w-full h-auto rounded-lg shadow-md my-8">`);
    finalHtml = finalHtml.replace('[CTA_BANNER_IMAGE]', `<img src="images/cta_banner.png" alt="Call to action banner" class="w-full h-auto rounded-lg shadow-md my-8">`);
    finalHtml = finalHtml.replace(/\[CTA_BUTTON\]/g, `<div class="text-center my-12">${ctaButtonHtml}</div>`);
    
    const previewHtmlBase64 = btoa_utf8(finalHtml);
    onProgress(4, 'Ready! Download below.');
    
    return {
      templateName: templateName,
      previewHtmlBase64: previewHtmlBase64,
      images: base64Images,
      downloadZipUrl: `/api/download/${Date.now()}` // Stub
    };

  } catch (error) {
    console.error("Error generating affiliate post:", error);
    onProgress(0, ''); 
    throw new Error("Failed to generate post. Check API key and try again.");
  }
};
