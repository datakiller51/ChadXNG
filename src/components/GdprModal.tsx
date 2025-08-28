import React from 'react';
import { X, Shield, Check } from 'lucide-react';

interface GdprModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  hasConsented: boolean;
}

export const GdprModal: React.FC<GdprModalProps> = ({ 
  isOpen, 
  onClose, 
  onAccept,
  hasConsented 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-bank-blue" />
            <h2 className="text-xl font-bold text-gray-800">Protection des données - RGPD</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer la modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {hasConsented ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Consentement accordé</p>
                <p className="text-sm text-green-700 mt-1">
                  Vous avez accordé votre consentement pour le traitement de vos données. 
                  Vous pouvez révoquer ce consentement à tout moment en effaçant votre session.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-medium text-yellow-800">Consentement requis</p>
              <p className="text-sm text-yellow-700 mt-1">
                Pour utiliser pleinement GPT BANK Assistant, nous avons besoin de votre consentement 
                pour traiter vos données conformément au RGPD.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Quelles données collectons-nous ?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Messages de conversation (stockés localement dans votre navigateur)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Préférences de langue et paramètres de session</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Données d'ouverture de compte (si vous utilisez cette fonction)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Vos droits RGPD</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Droit d'accès à vos données personnelles</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Droit de rectification des données inexactes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Droit d'effacement (bouton "Effacer la session")</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-bank-sky rounded-full mt-2 flex-shrink-0"></span>
                <span>Droit de retrait du consentement à tout moment</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Sécurité et confidentialité</h4>
            <p className="text-sm text-gray-700">
              Nous ne stockons jamais de mots de passe, codes PIN, numéros de carte bancaire ou 
              autres informations sensibles. Toutes les opérations bancaires affichées sont des simulations uniquement.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Fermer
          </button>
          
          {!hasConsented && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-bank-sky to-bank-blue text-white rounded-lg hover:from-bank-blue hover:to-bank-dark transition-all duration-200 font-medium shadow-lg"
            >
              Accepter et continuer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};