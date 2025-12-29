'use client';

import { useState } from 'react';

interface OrderStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  description: string;
  estimatedTime?: string;
}

interface OrderProgressProps {
  currentStatus: string;
  className?: string;
}

export default function OrderProgress({ currentStatus, className = '' }: OrderProgressProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const steps: OrderStep[] = [
    {
      id: 'PENDING',
      name: 'Złożenie zamówienia',
      status: currentStatus === 'PENDING' ? 'active' : 'completed',
      description: 'Twoje zamówienie zostało przyjęte do systemu',
      estimatedTime: 'Natychmiast'
    },
    {
      id: 'PAID',
      name: 'Płatność',
      status: currentStatus === 'PENDING' ? 'pending' : 
              currentStatus === 'PAID' ? 'active' : 'completed',
      description: 'Oczekiwanie na potwierdzenie płatności',
      estimatedTime: '5-15 minut'
    },
    {
      id: 'IN_PROGRESS',
      name: 'Realizacja projektu',
      status: ['IN_PROGRESS', 'COMPLETED'].includes(currentStatus) ? 'active' : 'pending',
      description: 'Nasi specjaliści pracują nad Twoją stroną',
      estimatedTime: '1-7 dni'
    },
    {
      id: 'REVIEW',
      name: 'Akceptacja klienta',
      status: currentStatus === 'COMPLETED' ? 'completed' : 'pending',
      description: 'Sprawdź i zaakceptuj gotowy projekt',
      estimatedTime: '2-3 dni'
    },
    {
      id: 'COMPLETED',
      name: 'Wdrożenie',
      status: currentStatus === 'COMPLETED' ? 'active' : 'pending',
      description: 'Twoja strona jest gotowa i publikowana',
      estimatedTime: '1 dzień'
    }
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStepTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600';
      default:
        return 'text-gray-400';
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Postęp zamówienia</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Aktualny etap:</span>
          <span className="font-medium text-blue-600">
            {steps[currentStepIndex]?.name || 'Nieznany status'}
          </span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
        <div 
          className="absolute left-6 top-8 w-0.5 bg-blue-500 transition-all duration-500"
          style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Step Circle */}
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    getStepColor(step.status)
                  } ${step.status === 'active' ? 'ring-4 ring-blue-100 animate-pulse' : ''}`}
                >
                  {step.status === 'completed' ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.status === 'active' ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${getStepTextColor(step.status)}`}>
                    {step.name}
                  </h4>
                  {step.estimatedTime && (
                    <span className="text-xs text-gray-500">
                      {step.estimatedTime}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
                
                {/* Hover Details */}
                {hoveredStep === step.id && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      {step.status === 'completed' && (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-600">Zakończone</span>
                        </>
                      )}
                      {step.status === 'active' && (
                        <>
                          <svg className="w-4 h-4 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-blue-600">W trakcie realizacji</span>
                        </>
                      )}
                      {step.status === 'pending' && (
                        <>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-500">Oczekuje na realizację</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-blue-900">Szacowany czas realizacji</p>
            <p className="text-blue-700">
              {steps[currentStepIndex]?.estimatedTime && 
               `Aktualny etap: ${steps[currentStepIndex].estimatedTime}`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
