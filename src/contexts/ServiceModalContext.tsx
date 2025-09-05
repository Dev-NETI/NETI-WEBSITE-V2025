"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  description: string;
  features: string[];
}

interface ServiceModalContextType {
  selectedService: Service | null;
  openModal: (service: Service) => void;
  closeModal: () => void;
}

const ServiceModalContext = createContext<ServiceModalContextType | undefined>(undefined);

export function ServiceModalProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openModal = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <ServiceModalContext.Provider value={{ selectedService, openModal, closeModal }}>
      {children}
    </ServiceModalContext.Provider>
  );
}

export function useServiceModal() {
  const context = useContext(ServiceModalContext);
  if (context === undefined) {
    throw new Error('useServiceModal must be used within a ServiceModalProvider');
  }
  return context;
}