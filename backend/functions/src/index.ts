import './config/firebase'; // Inicializa os subsistemas padrão.

// 1. Auth Triggers
export * as auth from './auth/onUserCreated';

// 2. Orders Core
export * as orders from './orders/onOrderCreate';
export * as orderStatus from './orders/onOrderStatusChange';

// 3. Pagamentos
export * as payments from './payments/createPayment';
export * as webhook from './payments/paymentWebhook';

// 4. Relatórios / Admin
export * as reports from './reports/generateReports';
