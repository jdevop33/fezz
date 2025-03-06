import React, { useState } from 'react';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

// In a real application, these would be fetched from Firestore
const defaultSettings = {
  siteSettings: {
    siteName: 'Pouches Distribution Platform',
    enableSignups: true,
    requireApproval: true,
    defaultCommissionRate: 5,
  },
  emailSettings: {
    enableNotifications: true,
    adminNotificationEmail: 'admin@example.com',
    salesNotificationEmail: 'sales@example.com',
  },
  paymentSettings: {
    enableCryptoPayments: true,
    enableBankTransfers: true,
    enableHighRiskProcessor: false,
    cryptoProcessor: 'BitPay',
    highRiskProcessor: 'NMI',
  }
};

function SystemSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (category: string, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };

  const handleInputChange = (category: string, setting: string, value: string | number) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // This would save to Firestore in a real implementation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg dark:bg-surface-800">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Settings</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-surface-400">
              Configure global system settings and defaults.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
        <div className="border-t border-gray-200 dark:border-surface-700">
          <dl>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-surface-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-surface-400">
                Site Settings
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={settings.siteSettings.siteName}
                      onChange={(e) => handleInputChange('siteSettings', 'siteName', e.target.value)}
                      className="input w-full max-w-lg"
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.siteSettings.enableSignups ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('siteSettings', 'enableSignups')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.siteSettings.enableSignups ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.siteSettings.enableSignups ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Enable New Signups</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.siteSettings.requireApproval ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('siteSettings', 'requireApproval')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.siteSettings.requireApproval ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.siteSettings.requireApproval ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Require Account Approval</span>
                  </div>
                  <div>
                    <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Default Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      id="commissionRate"
                      value={settings.siteSettings.defaultCommissionRate}
                      onChange={(e) => handleInputChange('siteSettings', 'defaultCommissionRate', Number(e.target.value))}
                      className="input w-20"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>
              </dd>
            </div>
            
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-surface-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-surface-400">
                Email Notifications
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.emailSettings.enableNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('emailSettings', 'enableNotifications')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.emailSettings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.emailSettings.enableNotifications ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Enable Email Notifications</span>
                  </div>
                  <div>
                    <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Admin Notification Email
                    </label>
                    <input
                      type="email"
                      id="adminEmail"
                      value={settings.emailSettings.adminNotificationEmail}
                      onChange={(e) => handleInputChange('emailSettings', 'adminNotificationEmail', e.target.value)}
                      className="input w-full max-w-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="salesEmail" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Sales Notification Email
                    </label>
                    <input
                      type="email"
                      id="salesEmail"
                      value={settings.emailSettings.salesNotificationEmail}
                      onChange={(e) => handleInputChange('emailSettings', 'salesNotificationEmail', e.target.value)}
                      className="input w-full max-w-lg"
                    />
                  </div>
                </div>
              </dd>
            </div>
            
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-surface-400">
                Payment Settings
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.paymentSettings.enableCryptoPayments ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('paymentSettings', 'enableCryptoPayments')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.paymentSettings.enableCryptoPayments ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.paymentSettings.enableCryptoPayments ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Enable Crypto Payments</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.paymentSettings.enableBankTransfers ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('paymentSettings', 'enableBankTransfers')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.paymentSettings.enableBankTransfers ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.paymentSettings.enableBankTransfers ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Enable Bank Transfers</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        settings.paymentSettings.enableHighRiskProcessor ? 'bg-primary-600' : 'bg-gray-200 dark:bg-surface-700'
                      }`}
                      onClick={() => handleToggle('paymentSettings', 'enableHighRiskProcessor')}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          settings.paymentSettings.enableHighRiskProcessor ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {settings.paymentSettings.enableHighRiskProcessor ? (
                          <Check className="h-3 w-3 text-primary-600 m-1" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 m-1" />
                        )}
                      </span>
                    </button>
                    <span className="ml-3 text-sm">Enable High Risk Payment Processor</span>
                  </div>
                  <div>
                    <label htmlFor="cryptoProcessor" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Crypto Processor
                    </label>
                    <select
                      id="cryptoProcessor"
                      value={settings.paymentSettings.cryptoProcessor}
                      onChange={(e) => handleInputChange('paymentSettings', 'cryptoProcessor', e.target.value)}
                      className="input w-full max-w-lg"
                    >
                      <option value="BitPay">BitPay</option>
                      <option value="CoinPayments">CoinPayments</option>
                      <option value="CoinGate">CoinGate</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="highRiskProcessor" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      High Risk Processor
                    </label>
                    <select
                      id="highRiskProcessor"
                      value={settings.paymentSettings.highRiskProcessor}
                      onChange={(e) => handleInputChange('paymentSettings', 'highRiskProcessor', e.target.value)}
                      className="input w-full max-w-lg"
                      disabled={!settings.paymentSettings.enableHighRiskProcessor}
                    >
                      <option value="NMI">NMI</option>
                      <option value="Authorize.net">Authorize.net</option>
                      <option value="CCBill">CCBill</option>
                    </select>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;