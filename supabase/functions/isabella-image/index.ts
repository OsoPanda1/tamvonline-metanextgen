import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { prompt, userId, editImage } = body as {
      prompt: string;
      userId?: string;
      editImage?: string; // base64 or URL of image to edit
    };

    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return new Response(JSON.stringify({ error: "Prompt inválido (máx 1000 caracteres)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.info(`Isabella image request from user: ${userId}, prompt: "${prompt.slice(0, 80)}..."`);

    // Build messages for image generation
    const messages: any[] = [];

    if (editImage) {
      // Edit existing image
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: editImage } },
        ],
      });
    } else {
      // Generate new image
      messages.push({
        role: "user",
        content: `Generate this image with high quality, cinematic lighting, and rich detail: ${prompt}`,
      });
    }

    const aiResponse = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const errorText = await aiResponse.text();
      console.error(`AI gateway error: ${status} ${errorText}`);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta en un momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Error generando imagen" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const choice = data.choices?.[0]?.message;
    const imageData = choice?.images?.[0]?.image_url?.url;
    const textResponse = choice?.content || "";

    if (!imageData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No se pudo generar la imagen. Intenta con otra descripción.",
          textResponse,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Optionally upload to storage
    let publicUrl: string | null = null;
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Extract base64 data
      const base64Match = imageData.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (base64Match) {
        const ext = base64Match[1];
        const raw = base64Match[2];
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const fileName = `isabella/${userId || "anon"}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("isabella-images")
          .upload(fileName, bytes, {
            contentType: `image/${ext}`,
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("isabella-images")
            .getPublicUrl(fileName);
          publicUrl = urlData?.publicUrl || null;
        } else {
          console.error("Storage upload error:", uploadError.message);
        }
      }
    } catch (storageErr) {
      console.error("Storage error (non-fatal):", storageErr);
      // Non-fatal: still return the base64 image
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageData, // base64 data URL
        publicUrl, // persistent URL if storage worked
        textResponse,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("isabella-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
