// Documentação do linter: https://docs.expo.dev/guides/using-eslint/
// Requer Linter Configs Func 
const { defineConfig } = require('eslint/config');
// Importa conjunto pré-montado de boas praticas do ESLINT fornecido pelo própio EXPO Framework JS Code Checkers
const expoConfig = require('eslint-config-expo/flat');

// Exporta as Extensões de Regras Configuratorias do Avaliador de Códigos p/ IDE Visual Studio e Terminal Node Checkers Compiler Tools e Linting.
module.exports = defineConfig([
  expoConfig, // Injeta as regras de Ouro Default do SDK .
  {
    // Igore e não processe checagem de regras em arquivos Compilados Output Minifiers (Evita Perda de Tempo no Dev Tooling Check Build Directories Path ignores Patterns)
    ignores: ['dist/*'],
  },
]);
