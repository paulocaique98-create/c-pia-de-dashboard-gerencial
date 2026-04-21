import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Testar conexão fazendo uma query simples
    const { data, error } = await supabase.from("users").select("count");

    if (error) {
      console.error("Supabase Error:", error);
    }

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should have correct Supabase URL format", () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    expect(supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });

  it("should have valid JWT token format", () => {
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    expect(supabaseKey).toMatch(/^eyJ/); // JWT tokens start with "eyJ"
  });
});
