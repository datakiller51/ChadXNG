import React from 'react';
import { UserPlus, HelpCircle, Send, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled = false }) => {
  const actions = [
    {
      id: 'account_opening',
      label: 'Ouverture de compte',
      description: 'Commencer le processus d\'ouverture de compte',
      icon: UserPlus,
      message: 'Je souhaite ouvrir un compte bancaire'
    },
    {
      id: 'faq',
      label: 'FAQ',
      description: 'Questions fréquemment posées',
      icon: HelpCircle,
      message: 'J\'ai des questions sur les services bancaires'
    },
    {
      id: 'transfer_simulation',
      label: 'Simulation de virement',
      description: 'Simuler un virement bancaire',
      icon: Send,
      message: 'Je veux simuler un virement'
    },
    {
      id: 'balance_check',
      label: 'Consulter le solde',
      description: 'Vérifier le solde du compte',
      icon: CreditCard,
      message: 'Je veux consulter mon solde'
    }
  ];

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Actions rapides</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.message)}
              disabled={disabled}
              className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-bank-sky hover:bg-bank-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              title={action.description}
            >
              <Icon className="w-6 h-6 text-bank-blue group-hover:text-bank-dark mb-2" />
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};