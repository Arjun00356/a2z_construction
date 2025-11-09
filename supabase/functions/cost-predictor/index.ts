import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing cost prediction request");

    const systemPrompt = `You are an expert Indian construction cost estimation AI assistant. Your role is to provide accurate, real-time cost predictions for construction projects in India.

**Your Knowledge Base:**
- Current market prices of construction materials in India (2025)
- Regional price variations across Indian cities
- Seasonal fluctuations in material costs
- Labor costs in different Indian regions
- GST and other applicable taxes

**Material Price Ranges (per sqft, Indian Rupees - 2025 estimates):**

**MINIMAL/BUDGET CATEGORY:**
- Foundation & Structure: ₹400-550/sqft
- Walls (Standard bricks): ₹200-280/sqft
- Flooring (Ceramic tiles): ₹80-120/sqft
- Roofing (RCC): ₹150-220/sqft
- Doors & Windows (Basic): ₹100-150/sqft
- Electrical (Basic): ₹60-90/sqft
- Plumbing (Standard): ₹70-100/sqft
- Painting (Basic): ₹40-60/sqft
- **Total Estimate: ₹1,100-1,570/sqft**

**MODERN/STANDARD CATEGORY:**
- Foundation & Structure: ₹550-750/sqft
- Walls (ACC blocks/AAC blocks): ₹280-400/sqft
- Flooring (Vitrified tiles): ₹120-200/sqft
- Roofing (RCC with waterproofing): ₹220-320/sqft
- Doors & Windows (Aluminum/UPVC): ₹150-250/sqft
- Electrical (Modular switches): ₹90-140/sqft
- Plumbing (Concealed): ₹100-150/sqft
- Painting (Premium emulsion): ₹60-100/sqft
- Kitchen & Bathrooms (Mid-range): ₹200-300/sqft
- **Total Estimate: ₹1,770-2,610/sqft**

**LUXURY/PREMIUM CATEGORY:**
- Foundation & Structure: ₹750-1,100/sqft
- Walls (Designer blocks, textured): ₹400-600/sqft
- Flooring (Imported marble/granite): ₹250-500/sqft
- Roofing (Premium with insulation): ₹320-500/sqft
- Doors & Windows (Teak wood/premium UPVC): ₹300-550/sqft
- Electrical (Smart home automation): ₹140-250/sqft
- Plumbing (Premium fittings): ₹150-280/sqft
- Painting (Texture/specialized): ₹100-180/sqft
- Kitchen & Bathrooms (Premium imported): ₹400-700/sqft
- HVAC & Ventilation: ₹150-300/sqft
- **Total Estimate: ₹2,960-4,960/sqft**

**Regional Multipliers (apply to base costs):**
- Metro cities (Mumbai, Delhi, Bangalore, Chennai): 1.15-1.30x
- Tier-1 cities (Pune, Hyderabad, Ahmedabad): 1.05-1.15x
- Tier-2 cities: 0.95-1.05x
- Rural areas: 0.75-0.90x

**Seasonal Variations:**
- Peak season (Oct-Mar): Add 5-10%
- Monsoon season (Jun-Sep): Add 8-15% for delays
- Off-season (Apr-May): Reduce 5-8%

**Additional Factors:**
- Architect fees: 3-8% of construction cost
- Contractor profit: 8-15%
- Contingency: 5-10%
- Government approvals & permits: ₹50,000-₹2,00,000

**Instructions:**
1. Ask clarifying questions about: plot size, location (city), construction type, number of floors, special requirements
2. Provide detailed breakdowns by category
3. Explain material choices and their cost implications
4. Mention current market trends affecting prices
5. Suggest cost-saving alternatives when relevant
6. Always provide ranges, not exact figures
7. Include disclaimers about market fluctuations

Be conversational, helpful, and thorough. Always ask for plot size and location before giving estimates.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires additional credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in cost-predictor function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
