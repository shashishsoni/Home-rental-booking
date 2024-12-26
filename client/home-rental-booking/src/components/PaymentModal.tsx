import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Check, Smartphone, Globe, ArrowLeft } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  listingTitle: string;
  startDate: Date;
  endDate: Date;
  nights: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icons?: JSX.Element[];  // For UPI payment methods
  icon?: JSX.Element;     // For single icon methods
  description: string;
}

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, listingTitle, startDate, endDate, nights }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [upiId, setUpiId] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icons: [
        <svg key="gpay" className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6Z" fill="#4285F4"/>
          <path d="M12 11.5C12 9.567 10.433 8 8.5 8C6.567 8 5 9.567 5 11.5C5 13.433 6.567 15 8.5 15C10.433 15 12 13.433 12 11.5Z" fill="#34A853"/>
          <path d="M19 11.5C19 9.567 17.433 8 15.5 8C13.567 8 12 9.567 12 11.5C12 13.433 13.567 15 15.5 15C17.433 15 19 13.433 19 11.5Z" fill="#FBBC05"/>
        </svg>,
        <svg key="phonepe" className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill="#5F259F"/>
          <path d="M17.5 8.5L11 15L7.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
        <svg key="paytm" className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill="#00BAF2"/>
          <path d="M7 12.5L10 15.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ],
      description: 'Pay using Google Pay, PhonePe, or Paytm'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M20.1556 7.424C20.1556 9.576 18.6667 11.504 16.5333 11.504H14.2222L13.3333 17.144H9.77778L10.6667 11.504H7.11111L6.22222 17.144H2.66667L4.44444 6.856H12.4444C14.5778 6.856 16.0667 8.784 16.0667 10.936C16.0667 11.504 15.8222 12.072 15.5778 12.64" stroke="#003087" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.11111 11.504H10.6667L11.5556 5.864H15.1111L14.2222 11.504H16.5333C18.6667 11.504 20.1556 9.576 20.1556 7.424C20.1556 5.272 18.6667 3.344 16.5333 3.344H8.44444L6.66667 13.632" stroke="#009CDE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      description: 'International payments accepted'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#4F46E5" strokeWidth="2"/>
        <path d="M2 10H22" stroke="#4F46E5" strokeWidth="2"/>
        <path d="M6 15H12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
      </svg>,
      description: 'All major cards accepted'
    }
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPaymentMethod('');
    setUpiId('');
  };

  const renderHeader = (title: string, showBack: boolean = true) => (
    <div className="flex items-center justify-between mb-6">
      {showBack && step !== 1 ? (
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/5 rounded-full transition-colors duration-300 group"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white" />
        </button>
      ) : (
        <div className="w-10" /> 
      )}
      <h2 className="text-2xl font-bold text-white text-center flex-1">{title}</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/5 rounded-full transition-colors duration-300 group"
      >
        <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-black/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-8">
              {step === 1 && (
                <>
                  {renderHeader('Select Payment Method', false)}
                  
                  {/* Enhanced Booking Summary */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 mb-8 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                    <p className="text-gray-300 text-lg font-medium">{listingTitle}</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-400">
                      <p className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{new Date(startDate).toLocaleDateString()}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date(endDate).toLocaleDateString()}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Duration:</span>
                        <span>{nights} nights</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total Amount</span>
                        <span className="text-xl font-bold text-white">₹{amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Payment Methods */}
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          if (method.id === 'upi') {
                            setStep(3);
                          } else if (method.id === 'paypal') {
                            window.open('https://www.paypal.com', '_blank');
                          } else {
                            setStep(4);
                          }
                        }}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between
                          ${paymentMethod === method.id 
                            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                            : 'border-white/10 hover:border-purple-500/50 bg-white/5'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                            ${method.id === 'upi' ? 'bg-purple-500/20' : 
                              method.id === 'paypal' ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                            {method.id === 'upi' ? (
                              <Smartphone className="w-6 h-6 text-purple-400" />
                            ) : method.id === 'paypal' ? (
                              <Globe className="w-6 h-6 text-blue-400" />
                            ) : (
                              <CreditCard className="w-6 h-6 text-green-400" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-white font-medium">{method.name}</p>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                          </div>
                        </div>
                        {method.icons ? (
                          <div className="flex space-x-2">
                            {method.icons.map((icon, index) => (
                              <div key={index} className="flex items-center justify-center">
                                {icon}
                              </div>
                            ))}
                          </div>
                        ) : method.icon ? (
                          <div className="flex items-center justify-center">
                            {method.icon}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
                  <p className="text-gray-400 mb-8 text-lg">
                    Your booking has been confirmed. Check your email for details.
                  </p>
                  <div className="animate-pulse text-sm text-gray-500">
                    Redirecting to your trips...
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  {renderHeader('UPI Payment')}
                  <div className="space-y-6">
                    <div className="flex justify-center space-x-6 mb-8">
                      {paymentMethods.find(m => m.id === 'upi')?.icons?.map((icon, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                          {icon}
                        </div>
                      )) || []}
                    </div>
                    <input
                      type="text"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handlePayment}
                      disabled={!upiId || loading}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        'Verify and Pay'
                      )}
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  {renderHeader('Card Payment')}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-xl border border-white/10">
                      <img src="/card-icons.png" alt="Accepted Cards" className="h-8 mx-auto" />
                    </div>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <button
                      onClick={handlePayment}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        'Pay Now'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal; 