// Arquivo Raiz (Entrypoint) do Servidor Backend Node.js Functions API Endpoints Triggers Entry Mapping Root file index

// Roda Configuração e Instancia Conexões C Google Servidores Base Boot
import './config/firebase'; // Inicializa os subsistemas padrão.

// Area 1. Gerenciadores de Auth e Eventos de Conta Users Mappings Endpoints Groups
// Exporta Todas as Funções Daquele Arquivo sob o "Guarda-Chuva/Namespace" Objeto 'auth.' Ex (auth.onUserCreated)
export * as auth from './auth/onUserCreated';

// Area 2. Lógicas De Negocio Core Pedidos (Ordens Vendas Carts Transactions Modules Orders Endpoints)
// Exporta lógica anti-fraude E Recalculos Seguros Core
export * as orders from './orders/onOrderCreate';
// Exporta Hook Listener Tracker mudanças de Steps Kitchen Display System Webhooks Update Status Logs Events
export * as orderStatus from './orders/onOrderStatusChange';

// Area 3. Gateways e Dinheiros (Transações Pix Cartoes Integrações Webhooks Gateway Financeiro Modules Payment Webhooks Server WebHooks Payloads Triggers CallBacks)
export * as payments from './payments/createPayment'; // Geração Codigos
export * as webhook from './payments/paymentWebhook'; // Escuta Assincrona de Servidores Externos Pós Payment Approved Callbacks Responses Receivers

// Area 4. CronJobs Agendadas Administrativo Exports Analytical Data BI System Endpoints
export * as reports from './reports/generateReports'; // Cron Scheduler Reports Export CSV Excel System Gen API Builder API Builder Function Node
