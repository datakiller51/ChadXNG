import React from 'react';
import { Building2, Trash2, Shield } from 'lucide-react';

interface ChatHeaderProps {
  onClearSession: () => void;
  onShowGdprModal: () => void;
  gdprConsent: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClearSession, 
  onShowGdprModal, 
  gdprConsent 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-bank-blue" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-bank-sky to-bank-dark bg-clip-text text-transparent">
            GPT BANK
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-subtle"></div>
          <span className="text-sm text-gray-600 font-medium">En ligne</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200">
          Beta — Les opérations affichées sont des simulations
        </span>
        
        <button
          onClick={onShowGdprModal}
          className={`p-2 rounded-lg transition-colors ${
            gdprConsent 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
          title={gdprConsent ? 'Consentement RGPD accordé' : 'Consentement RGPD requis'}
          aria-label="État du consentement RGPD"
        >
          <Shield className="w-5 h-5" />
        </button>

        <button
          onClick={onClearSession}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Effacer la session"
          aria-label="Effacer la session de chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};