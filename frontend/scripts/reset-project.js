#!/usr/bin/env node

/**
 * ATENÇÃO: ESTE ARQUIVO É UM SCRIPT UTILITÁRIO DE CLI DA PLATAFORMA EXPO 
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

// Importa os modulos Core nativos do Motor NodeJS System File (File System JS) Manipulador do SO e Arquivos pasttas
const fs = require("fs");
// Importa Path Resolve (Constroi URLS Camminho de Arquivos CrossPlatform PC MAC WINDOWS LINUX Paths Resolve Dir Names
const path = require("path");
// Leitor Nativo de Entradas do Terminal CMD Keyboard Inputs Reading Prompts
const readline = require("readline");

// Identifica Diretório atual onde o usuário rodou script
const root = process.cwd();
// Pastas que Serão Apagadas/Movidas no reseto
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example"; // Pasta BKP
const newAppDir = "app"; // Pasta Clean
const exampleDirPath = path.join(root, exampleDir);

// Constante String Contendo as Linhas de Codigo React que serão geradas no Arquivo Final "Index.TSX" File Content Strin Builder Template Generator
const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

// Mesma coisa Constante String Template Boilerplate Vazio pro Layout Base App View Text Blocks Content Variables
const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

// Ativa a interface de Ouvidoria Leitor Keyboard Terminal 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Arrow Func Assincrona Lógica que Executará Modificações Hardisk Files
const moveDirectories = async (userInput) => {
  try {
    // Aprovcao Yes Cria pastas 
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    // Laço Para varrer Lixo Pastas e Deletar 
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          // Destroi a pasta Raiz rm -rf Directory Remove Command Action Call System Node
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        // Log Error Check 
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Recria a /app virgem pro Programador Files Tree Directory Generator Create CLI
    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    // Notifica Command Terminal Visual
    console.log("\n📁 New /app directory created.");

    // Gerador de Arquivo Crie/Escreva O "index.tsx" preenchido File Create Writer Async Text Builder Files System Generators NodeJS FS Core
    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Idem para o App Layout Core Navigation Wrapper 
    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    // Informa Fim Da Rotinas Sucesso User Interface Messages
    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    // Intercepta e Mostra Exceção FS Erros Permissions etc
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

// Starta Prompt Interativo Perguntando o que Usuario Quer Fazer E lendo Keyboard Answer (Y/N)
rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    // Limpa espacos em Branco Trim lower case Format Text Normalizer
    const userInput = answer.trim().toLowerCase() || "y";
    // Valida Inputs Rules
    if (userInput === "y" || userInput === "n") {
      // Repassa pra Func Executar Acoes  E fechar Interface Termial Finally
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      // Se Errar Avise e Desliga App Fechando App Node Prompt 
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
