'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';
import { loadStripe } from '@stripe/stripe-js';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  hostingPlan?: 'basic' | 'premium' | null;
  hostingExpiresAt?: string | null;
  domain?: string | null;
  ssl?: boolean;
  nazwaFirmy?: string;
  branża?: string;
  orderItems: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export default function HostingOrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>('basic');
  const [domain, setDomain] = useState('');
  const [ssl, setSsl] = useState(true);
  const [period, setPeriod] = useState(12);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (id) {
      fetchOrder();
    }
  }, [status, id]);

  useEffect(() => {
    // Sprawdź tryb (extend/change) po załadowaniu zamówienia
    const mode = router.query.mode as string;
    if (mode === 'extend' || mode === 'change') {
      // Jeśli ma już hosting, ustaw dane
      if (order?.hostingPlan) {
        setSelectedPlan(order.hostingPlan);
        setDomain(order.domain || '');
        setSsl(order.ssl || false);
      }
    } else {
      // Sprawdź czy ma już aktywny hosting - jeśli tak, przekieruj do przedłużania
      if (order?.hostingPlan) {
        router.replace(`/panel/hosting/${id}?mode=extend`);
        return;
      }
      // Resetuj period do 12 dla nowego hostingu
      setPeriod(12);
    }
  }, [router.query.mode, order]);

  useEffect(() => {
    // Sprawdź czy wrócił z płatności Stripe
    const { session_id } = router.query;
    if (session_id && typeof session_id === 'string' && order) {
      verifyHostingPayment(session_id);
    }
  }, [router.query.session_id, order]);

  const verifyHostingPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/hosting/verify-payment?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Hosting payment verified:', data);
        // Odśwież dane zamówienia
        fetchOrder();
        
        // Pokaż komunikat sukcesu
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
        successMessage.innerHTML = `
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-bold">Hosting aktywowany!</p>
              <p class="text-sm">Twój hosting został pomyślnie aktywowany.</p>
            </div>
          </div>
        `;
        document.body.appendChild(successMessage);
        
        // Usuń komunikat po 5 sekundach
        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 5000);
        
        // Wyczyść URL z session_id
        router.replace(`/panel/hosting/${id}`, undefined, { shallow: true });
      } else {
        const errorData = await response.json();
        console.error('Payment verification failed:', errorData);
      }
    } catch (error) {
      console.error('Error verifying hosting payment:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = e.target as Element;
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        
        // Jeśli ma już hosting, ustaw dane
        if (data.hostingPlan) {
          setSelectedPlan(data.hostingPlan);
          setDomain(data.domain || '');
          setSsl(data.ssl || false);
        }
      }
    } catch (error) {
      console.error('Błąd pobierania zamówienia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendHosting = async () => {
    console.log('handleExtendHosting clicked');
    // Przekieruj do trybu przedłużania
    router.push(`/panel/hosting/${id}?mode=extend`);
  };

  const handleChangePlan = async () => {
    console.log('handleChangePlan clicked');
    // Przekieruj do trybu zmiany planu
    router.push(`/panel/hosting/${id}?mode=change`);
  };

  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order?.hostingPlan) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-bold">Brak hostingu</p>
            <p class="text-sm">To zamówienie nie ma aktywnego hostingu.</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    // Sprawdź czy przedłużenie nie przekroczy 2 lat
    const currentExpiry = order.hostingExpiresAt ? new Date(order.hostingExpiresAt) : new Date();
    const newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + period);
    
    const maxExpiry = new Date();
    maxExpiry.setMonth(maxExpiry.getMonth() + 24); // Maksymalnie 2 lata od teraz
    
    if (newExpiry > maxExpiry) {
      const maxMonths = Math.max(0, 24 - Math.ceil((currentExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
      
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-300 translate-x-full';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-bold text-lg">Ograniczenie okresu hostingu</p>
            <p class="text-sm opacity-90">Maksymalny okres hostingu to 2 lata. Możesz przedłużyć hosting maksymalnie o ${maxMonths} miesięcy.</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Animacja wejścia
      setTimeout(() => {
        confirmMessage.classList.remove('translate-x-full');
        confirmMessage.classList.add('translate-x-0');
      }, 100);
      
      // Usuń komunikat po 8 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.classList.add('translate-x-full');
          setTimeout(() => {
            if (confirmMessage.parentNode) {
              confirmMessage.parentNode.removeChild(confirmMessage);
            }
          }, 300);
        }
      }, 8000);
      
      return;
    }

    setIsSubmitting(true);

    try {
      // Oblicz cenę przedłużenia
      const monthlyPrice = order.hostingPlan === 'premium' ? 400 : 200;
      const discount = period >= 12 ? 0.15 : period >= 6 ? 0.10 : period >= 3 ? 0.05 : 0;
      const totalPrice = monthlyPrice * period * (1 - discount);

      // Przygotuj dane do płatności Stripe (tak jak w /panel/zamow)
      const hostingItems = [
        {
          name: `Przedłużenie hostingu ${order.hostingPlan === 'premium' ? 'Premium' : 'Basic'}`,
          description: `Przedłużenie hostingu - ${period} miesięcy`,
          quantity: 1,
          unitPrice: totalPrice, // Cena w złotówkach (API skonwertuje)
          totalPrice: totalPrice // Cena w złotówkach (API skonwertuje)
        }
      ];

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: hostingItems,
          totalAmount: totalPrice, // Cena w złotówkach (API skonwertuje)
          userEmail: session?.user?.email,
          customerPhone: '', // Brak telefonu w extend
          formularz: {
            nazwaFirmy: order?.nazwaFirmy || '',
            branża: order?.branża || '',
            hostingExtend: true,
            hostingPeriod: period,
            hostingPlan: order.hostingPlan
          },
          hostingData: {
            orderId: id // Przekaż ID zamówienia
          }
        })
      });

      if (!response.ok) {
        throw new Error('Błąd tworzenia sesji płatności');
      }

      const { sessionId } = await response.json();
      
      // Przekieruj do Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          throw new Error(error.message || 'Błąd przekierowania do płatności');
        }
      } else {
        throw new Error('Nie udało się załadować Stripe');
      }

    } catch (error) {
      console.error('Błąd przedłużania hostingu:', error);
      alert('Wystąpił błąd podczas przedłużania hostingu. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order?.hostingPlan || !selectedPlan) {
      alert('Brak aktywnego hostingu lub nie wybrano planu.');
      return;
    }

    if (selectedPlan === order.hostingPlan) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <p class="font-bold">Ten sam plan</p>
            <p class="text-sm">Wybrany plan jest taki sam jak aktualny.</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    setIsSubmitting(true);

    try {
      // Oblicz dopłatę (tylko dla upgrade z basic na premium)
      let upgradePrice = 0;
      if (order.hostingPlan === 'basic' && selectedPlan === 'premium') {
        // Oblicz ile miesięcy zostało w aktualnym hostingu
        const currentDate = new Date();
        const expiryDate = order.hostingExpiresAt ? new Date(order.hostingExpiresAt) : new Date();
        const remainingMonths = Math.max(0, Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        
        // Różnica w cenie między premium a basic: 400 zł - 200 zł = 200 zł
        const priceDifference = 200;
        upgradePrice = priceDifference * remainingMonths;
      }

      if (upgradePrice === 0) {
        // Pokaż ładny komunikat zamiast alert
        const confirmMessage = document.createElement('div');
        confirmMessage.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-300 translate-x-full';
        confirmMessage.innerHTML = `
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-lg">Nieprawidłowa zmiana</p>
              <p class="text-sm opacity-90">Downgrade nie jest dostępny.</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        `;
        document.body.appendChild(confirmMessage);
        
        // Animacja wejścia
        setTimeout(() => {
          confirmMessage.classList.remove('translate-x-full');
          confirmMessage.classList.add('translate-x-0');
        }, 100);
        
        // Usuń komunikat po 8 sekundach
        setTimeout(() => {
          if (confirmMessage.parentNode) {
            confirmMessage.classList.add('translate-x-full');
            setTimeout(() => {
              if (confirmMessage.parentNode) {
                confirmMessage.parentNode.removeChild(confirmMessage);
              }
            }, 300);
          }
        }, 8000);
        
        return;
      }

      // Przygotuj dane do płatności Stripe (tak jak w /panel/zamow)
      const upgradeItems = [
        {
          name: `Upgrade hostingu z ${order.hostingPlan === 'premium' ? 'Premium' : 'Basic'} na ${selectedPlan === 'premium' ? 'Premium' : 'Basic'}`,
          description: `Upgrade planu hostingowego - dopłata za pozostałe miesiące`,
          quantity: 1,
          unitPrice: upgradePrice, // Cena w złotówkach (API skonwertuje)
          totalPrice: upgradePrice // Cena w złotówkach (API skonwertuje)
        }
      ];

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: upgradeItems,
          totalAmount: upgradePrice, // Cena w złotówkach (API skonwertuje)
          userEmail: session?.user?.email,
          customerPhone: '', // Brak telefonu w change
          metadata: {
            type: 'hosting_change',
            orderId: id,
            fromPlan: order.hostingPlan,
            toPlan: selectedPlan
          }
        })
      });

      if (!response.ok) {
        throw new Error('Błąd tworzenia sesji płatności');
      }

      const { sessionId } = await response.json();
      
      // Przekieruj do Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          throw new Error(error.message || 'Błąd przekierowania do płatności');
        }
      } else {
        throw new Error('Nie udało się załadować Stripe');
      }

    } catch (error) {
      console.error('Błąd zmiany planu hostingu:', error);
      alert('Wystąpił błąd podczas zmiany planu hostingu. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateHosting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-bold">Wybierz plan</p>
            <p class="text-sm">Wybierz plan hostingowy przed kontynuowaniem.</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    if (!domain.trim()) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-bold">Brak domeny</p>
            <p class="text-sm">Podaj nazwę domeny dla hostingu.</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    // Walidacja formatu domeny
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-bold">Nieprawidłowa domena</p>
            <p class="text-sm">Podaj prawidłową nazwę domeny (np. twojadomena.pl).</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    // Sprawdź czy okres nie przekracza 2 lat
    if (period > 24) {
      // Pokaż ładny komunikat zamiast alert
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      confirmMessage.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-bold">Ograniczenie okresu hostingu</p>
            <p class="text-sm">Maksymalny okres hostingu to 24 miesięcy.</p>
          </div>
        </div>
      `;
      document.body.appendChild(confirmMessage);
      
      // Usuń komunikat po 5 sekundach
      setTimeout(() => {
        if (confirmMessage.parentNode) {
          confirmMessage.parentNode.removeChild(confirmMessage);
        }
      }, 5000);
      
      return;
    }

    setIsSubmitting(true);

    try {
      // Przygotuj dane do płatności Stripe
      const hostingItems = [
        {
          name: `Hosting ${selectedPlan === 'premium' ? 'Premium' : 'Basic'}`,
          description: `${selectedPlan === 'premium' ? 'Premium' : 'Basic'} hosting - ${period} miesięcy`,
          quantity: 1,
          unitPrice: hostingPrice, // Cena za hosting bez SSL (API skonwertuje)
          totalPrice: hostingPrice // Cena za hosting bez SSL
        }
      ];

      if (ssl) {
        hostingItems.push({
          name: 'Certyfikat SSL',
          description: 'Certyfikat SSL - jednorazowa opłata',
          quantity: 1,
          unitPrice: sslPrice, // Cena w złotówkach (API skonwertuje)
          totalPrice: sslPrice // Cena w złotówkach (API skonwertuje)
        });
      }

      // Wyślij do API płatności
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: hostingItems,
          totalAmount: totalPrice, // Cena w złotówkach (API skonwertuje)
          customerEmail: session?.user?.email,
          metadata: {
            orderId: id,
            type: 'hosting',
            plan: selectedPlan,
            domain: domain.trim(),
            ssl: ssl.toString(),
            period: period.toString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Błąd tworzenia sesji płatności');
      }

      const { sessionId } = await response.json();
      
      // Przekieruj do Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          throw new Error(error.message || 'Błąd przekierowania do płatności');
        }
      } else {
        throw new Error('Nie udało się załadować Stripe');
      }

    } catch (error) {
      console.error('Błąd aktywacji hostingu:', error);
      alert('Wystąpił błąd podczas aktywacji hostingu. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (!order) {
    return <div>Nie znaleziono zamówienia.</div>;
  }

  const bgClass = isDark ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  const cardBg = isDark ? 'bg-slate-900/50 backdrop-blur-xl border-slate-800' : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  // Pobierz tryb z query
  const mode = router.query.mode as string;
  const isExtendMode = mode === 'extend';
  const isChangeMode = mode === 'change';
  const monthlyPrice = selectedPlan === 'premium' ? 400 : 200;
  const discount = period >= 12 ? 0.15 : period >= 6 ? 0.10 : period >= 3 ? 0.05 : 0;
  const hostingPrice = monthlyPrice * period * (1 - discount);
  const sslPrice = ssl ? 100 : 0;
  const totalPrice = hostingPrice + sslPrice;

  return (
    <>
      <Head>
        <title>Hosting dla zamówienia #{order.id.slice(-8)} - DesignStron</title>
      </Head>
      
      <div className={`min-h-screen ${bgClass}`}>
        {/* Navbar */}
        <nav className={`${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border-b sticky top-0 z-50`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/panel" className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">DS</span>
                  </div>
                  <span className={`font-bold text-xl ${textPrimary}`}>DesignStron</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/panel"
                  className={`px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-all`}
                >
                  Panel
                </Link>
                <div id="notifications">
                  <NotificationCenter />
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className={`w-4 h-4 ${isProfileDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} overflow-hidden`}>
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <p className="text-sm font-medium">{session?.user?.name || 'Użytkownik'}</p>
                        <p className="text-xs opacity-75">{session?.user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                        >
                          Wyloguj się
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Nagłówek */}
          <div className="mb-8">
            <Link href="/panel" className={`inline-flex items-center ${textSecondary} hover:text-blue-400 transition-colors mb-4`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót do panelu
            </Link>
            <h1 className={`text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2`}>
              {isExtendMode ? 'Przedłuż hosting' : isChangeMode ? 'Zmień plan hostingu' : 'Hosting dla zamówienia'} #{order.id.slice(-8)}
            </h1>
            <p className={`${textSecondary}`}>
              {isExtendMode ? 'Przedłuż swoją subskrypcję hostingu' : isChangeMode ? 'Zmień swój plan hostingowy' : 'Zarządzaj hostingiem dla swojego projektu'}
            </p>
          </div>

          {/* Informacje o zamówieniu */}
          <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6 mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Informacje o projekcie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`${textSecondary} text-sm`}>Projekt</p>
                <p className={`font-medium ${textPrimary}`}>{order.nazwaFirmy || 'Brak nazwy'}</p>
              </div>
              <div>
                <p className={`${textSecondary} text-sm`}>Branża</p>
                <p className={`font-medium ${textPrimary}`}>{order.branża || 'Brak'}</p>
              </div>
              <div>
                <p className={`${textSecondary} text-sm`}>Status zamówienia</p>
                <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                  order.status === 'completed' ? 'bg-green-500/20 text-green-300' : 
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {order.status === 'completed' ? 'Zakończone' : 
                   order.status === 'pending' ? 'Oczekuje' : 
                   order.status}
                </span>
              </div>
              <div>
                <p className={`${textSecondary} text-sm`}>Wartość</p>
                <p className={`font-medium ${textPrimary}`}>{order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
              </div>
            </div>
          </div>

          {/* Status hostingu */}
          {order.hostingPlan && order.hostingExpiresAt && new Date(order.hostingExpiresAt) > new Date() ? (
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6 mb-8`}>
              <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Aktualny hosting</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`${textSecondary} text-sm`}>Plan</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                    order.hostingPlan === 'premium' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {order.hostingPlan === 'premium' ? 'Premium' : 'Basic'}
                  </span>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm`}>Domena</p>
                  <p className={`font-medium ${textPrimary}`}>{order.domain || 'Brak'}</p>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm`}>Ważny do</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {order.hostingExpiresAt ? new Date(order.hostingExpiresAt).toLocaleDateString('pl-PL') : 'Brak'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={handleExtendHosting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Przedłuż hosting
                </button>
                <button 
                  onClick={handleChangePlan}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Zmień plan
                </button>
              </div>
            </div>
          ) : order.hostingPlan ? (
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6 mb-8`}>
              <h2 className={`text-xl font-bold mb-4 text-orange-400`}>Hosting wygasły</h2>
              <p className={`${textSecondary} mb-4`}>
                Twój hosting wygasł {order.hostingExpiresAt ? new Date(order.hostingExpiresAt).toLocaleDateString('pl-PL') : 'nieznany dzień'}. Możesz go przedłużyć poniżej.
              </p>
            </div>
          ) : (
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6 mb-8`}>
              <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Hosting nieaktywny</h2>
              <p className={`${textSecondary} mb-4`}>
                To zamówienie nie ma jeszcze aktywnego hostingu. Możesz go aktywować poniżej.
              </p>
            </div>
          )}

          {/* Formularz aktywacji/przedłużenia/zmiany hostingu */}
          <form onSubmit={isExtendMode ? handleExtendSubmit : isChangeMode ? handleChangeSubmit : handleActivateHosting} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lewa kolumna - formularz */}
                <div className="lg:col-span-2 space-y-8">
                  <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-8`}>
                    <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>
                      {isExtendMode ? 'Przedłużenie hostingu' : isChangeMode ? 'Zmiana planu hostingu' : 'Konfiguracja hostingu'}
                    </h2>
                    
                    <div className="space-y-8">
                      {/* Tryb zmiany planu */}
                      {isChangeMode && (
                        <div>
                          <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                            Wybierz nowy plan hostingowy
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                              <input
                                type="radio"
                                name="plan"
                                value="basic"
                                checked={selectedPlan === 'basic'}
                                onChange={(e) => setSelectedPlan(e.target.value as 'basic' | 'premium')}
                                className="sr-only"
                              />
                              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] ${
                                selectedPlan === 'basic'
                                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}>
                                <h3 className={`font-bold text-xl mb-2 ${textPrimary}`}>Basic</h3>
                                <p className="text-3xl font-black text-blue-400 mb-2">200 zł<span className="text-lg font-normal">/miesiąc</span></p>
                                <ul className={`space-y-2 ${textSecondary} text-sm`}>
                                  <li>• 5GB przestrzeni dyskowej</li>
                                  <li>• 100GB transferu miesięcznie</li>
                                  <li>• Email support</li>
                                  <li>• 1 domena</li>
                                </ul>
                              </div>
                            </label>
                            
                            <label className="block">
                              <input
                                type="radio"
                                name="plan"
                                value="premium"
                                checked={selectedPlan === 'premium'}
                                onChange={(e) => setSelectedPlan(e.target.value as 'basic' | 'premium')}
                                className="sr-only"
                              />
                              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] ${
                                selectedPlan === 'premium'
                                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}>
                                <h3 className={`font-bold text-xl mb-2 ${textPrimary}`}>Premium</h3>
                                <p className="text-3xl font-black text-purple-400 mb-2">400 zł<span className="text-lg font-normal">/miesiąc</span></p>
                                <ul className={`space-y-2 ${textSecondary} text-sm`}>
                                  <li>• 50GB przestrzeni dyskowej</li>
                                  <li>• 500GB transferu miesięcznie</li>
                                  <li>• Priority support 24/7</li>
                                  <li>• 5 domen</li>
                                </ul>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Tryb przedłużania */}
                      {isExtendMode && (
                        <div className="space-y-6">
                          <div>
                            <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                              Okres przedłużenia: {period} {period === 1 ? 'miesiąc' : period >= 5 ? 'miesięcy' : 'miesiące'}
                            </label>
                            <div className="space-y-4">
                              <input
                                type="range"
                                min="1"
                                max="24"
                                value={period}
                                onChange={(e) => setPeriod(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-sm">
                                <span className={textSecondary}>1 miesiąc</span>
                                <span className={textSecondary}>24 miesiące</span>
                              </div>
                              {discount > 0 && (
                                <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                                  <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                                    Oszczędzasz {(discount * 100).toFixed(0)}% dzięki dłuższemu okresowi!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                              Aktualna domena
                            </label>
                            <div className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-gray-100 border-gray-300'} cursor-not-allowed`}>
                              {order.domain || 'Brak domeny'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standardowy tryb aktywacji */}
                      {!isExtendMode && !isChangeMode && (
                        <>
                          <div>
                            <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                              Wybierz plan hostingowy
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <label className="block">
                                <input
                                  type="radio"
                                  name="plan"
                                  value="basic"
                                  checked={selectedPlan === 'basic'}
                                  onChange={(e) => setSelectedPlan(e.target.value as 'basic' | 'premium')}
                                  className="sr-only"
                                />
                                <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] ${
                                  selectedPlan === 'basic'
                                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                  <h3 className={`font-bold text-xl mb-2 ${textPrimary}`}>Basic</h3>
                                  <p className="text-3xl font-black text-blue-400 mb-2">200 zł<span className="text-lg font-normal">/miesiąc</span></p>
                                  <ul className={`space-y-2 ${textSecondary} text-sm`}>
                                    <li>• 5GB przestrzeni dyskowej</li>
                                    <li>• 100GB transferu miesięcznie</li>
                                    <li>• Email support</li>
                                    <li>• 1 domena</li>
                                  </ul>
                                </div>
                              </label>
                              
                              <label className="block">
                                <input
                                  type="radio"
                                  name="plan"
                                  value="premium"
                                  checked={selectedPlan === 'premium'}
                                  onChange={(e) => setSelectedPlan(e.target.value as 'basic' | 'premium')}
                                  className="sr-only"
                                />
                                <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] ${
                                  selectedPlan === 'premium'
                                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                  <h3 className={`font-bold text-xl mb-2 ${textPrimary}`}>Premium</h3>
                                  <p className="text-3xl font-black text-purple-400 mb-2">400 zł<span className="text-lg font-normal">/miesiąc</span></p>
                                  <ul className={`space-y-2 ${textSecondary} text-sm`}>
                                    <li>• 50GB przestrzeni dyskowej</li>
                                    <li>• 500GB transferu miesięcznie</li>
                                    <li>• Priority support 24/7</li>
                                    <li>• 5 domen</li>
                                  </ul>
                                </div>
                              </label>
                            </div>
                          </div>

                          {!isExtendMode && !isChangeMode && (
                            <>
                              <div>
                                <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                                  Okres subskrypcji: {period} {period === 1 ? 'miesiąc' : period >= 5 ? 'miesięcy' : 'miesiące'}
                                </label>
                                <div className="space-y-4">
                                  <input
                                    type="range"
                                    min="1"
                                    max="24"
                                    value={period}
                                    onChange={(e) => setPeriod(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                  />
                                  <div className="flex justify-between text-sm">
                                    <span className={textSecondary}>1 miesiąc</span>
                                    <span className={textSecondary}>24 miesiące</span>
                                  </div>
                                  {discount > 0 && (
                                    <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                                      <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                                        Oszczędzasz {(discount * 100).toFixed(0)}% dzięki dłuższemu okresowi!
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                                  Domena
                                </label>
                                <input
                                  type="text"
                                  value={domain}
                                  onChange={(e) => setDomain(e.target.value)}
                                  placeholder="twojadomena.pl"
                                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                              </div>

                              <div>
                                <label className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={ssl}
                                    onChange={(e) => setSsl(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <span className={`${textPrimary}`}>Certyfikat SSL (+100 zł jedrnorazowo)</span>
                                </label>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Prawa kolumna - podsumowanie */}
                <div className="lg:col-span-1">
                  <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6 sticky top-24`}>
                    <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Podsumowanie</h3>
                    
                    {isExtendMode && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className={textSecondary}>Plan:</span>
                          <span className={`font-medium ${textPrimary}`}>{order?.hostingPlan === 'premium' ? 'Premium' : 'Basic'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Okres:</span>
                          <span className={`font-medium ${textPrimary}`}>{period} {period === 1 ? 'miesiąc' : period >= 5 ? 'miesięcy' : 'miesiące'}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between">
                            <span className={textSecondary}>Rabat:</span>
                            <span className={`font-medium text-green-400`}>-{(discount * 100).toFixed(0)}%</span>
                          </div>
                        )}
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span className={textPrimary}>Cena:</span>
                            <span className="text-blue-400">
                              {((order?.hostingPlan === 'premium' ? 400 : 200) * period * (1 - discount)).toFixed(2)} zł
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {isChangeMode && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className={textSecondary}>Aktualny plan:</span>
                          <span className={`font-medium ${textPrimary}`}>{order?.hostingPlan === 'premium' ? 'Premium' : 'Basic'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Nowy plan:</span>
                          <span className={`font-medium ${textPrimary}`}>{selectedPlan === 'premium' ? 'Premium' : 'Basic'}</span>
                        </div>
                        
                        {/* Oblicz dopłatę dynamicznie */}
                        {order?.hostingPlan === 'basic' && selectedPlan === 'premium' && (() => {
                          const currentDate = new Date();
                          const expiryDate = order?.hostingExpiresAt ? new Date(order.hostingExpiresAt) : new Date();
                          const remainingMonths = Math.max(0, Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
                          const priceDifference = 200; // 400 - 200
                          const upgradePrice = priceDifference * remainingMonths;
                          
                          return (
                            <div className="border-t pt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={textSecondary}>Pozostałe miesiące:</span>
                                <span className={`font-medium ${textPrimary}`}>{remainingMonths}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className={textSecondary}>Różnica w cenie:</span>
                                <span className={`font-medium ${textPrimary}`}>{priceDifference} zł/miesiąc</span>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between text-lg font-bold">
                                  <span className={textPrimary}>Dopłata:</span>
                                  <span className="text-blue-400">{upgradePrice} zł</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        
                        {order?.hostingPlan === 'premium' && selectedPlan === 'basic' && (
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} border`}>
                            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                              Downgrade nie jest dostępny
                            </p>
                          </div>
                        )}
                        {selectedPlan === order?.hostingPlan && (
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} border`}>
                            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                              Wybrany plan jest taki sam jak aktualny
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {!isExtendMode && !isChangeMode && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className={textSecondary}>Plan:</span>
                          <span className={`font-medium ${textPrimary}`}>{selectedPlan === 'premium' ? 'Premium' : 'Basic'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Okres:</span>
                          <span className={`font-medium ${textPrimary}`}>{period} {period === 1 ? 'miesiąc' : period >= 5 ? 'miesięcy' : 'miesiące'}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between">
                            <span className={textSecondary}>Rabat:</span>
                            <span className={`font-medium text-green-400`}>-{(discount * 100).toFixed(0)}%</span>
                          </div>
                        )}
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span className={textPrimary}>Cena:</span>
                            <span className="text-blue-400">
                              {totalPrice.toFixed(2)} zł
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || (!isExtendMode && !isChangeMode && (!selectedPlan || !domain.trim()))}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      {isSubmitting ? 'Przetwarzanie...' : 
                       isExtendMode ? 'Przedłuż hosting' :
                       isChangeMode ? 'Zmień plan' :
                       'Aktywuj hosting'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
        </div>
      </div>
    </>
  );
}
