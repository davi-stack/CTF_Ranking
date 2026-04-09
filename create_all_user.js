import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

// 🔑 CONFIG
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const users = [];

fs.createReadStream("users.csv")
  .pipe(csv())
  .on("data", (row) => {
    users.push(row);
  })
  .on("end", async () => {
    console.log(`📄 ${users.length} usuários encontrados`);

    for (const user of users) {
      const { login, password } = user;

      try {
        // 🔐 hash da senha
        const hash = await bcrypt.hash(password, 10);

        // 🗄️ inserir no banco
        const { error } = await supabase
          .from("user")
          .insert([{ login, hash }]);

        if (error) {
          console.error(`❌ Erro ao inserir ${login}:`, error.message);
        } else {
          console.log(`✅ Usuário criado: ${login}`);
        }

      } catch (err) {
        console.error(`💥 Falha em ${login}:`, err);
      }
    }

    console.log("🚀 Seed finalizado!");
  });