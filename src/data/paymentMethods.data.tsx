import { PaymentMethod } from "@/types/global";
import { t } from "i18next";
import { Banknote, Building2, CreditCard, Smartphone } from "lucide-react";


export const paymentMethods = [
    {
      id: 'cash' as PaymentMethod,
      name: t('order.cashPayment'),
      icon: Banknote,
      description: 'Paiement en espèces au restaurant',
      color: 'bg-green-500'
    },
    {
      id: 'orange_money' as PaymentMethod,
      name: t('order.orangeMoney'),
      icon: Smartphone,
      description: 'Paiement via Orange Money',
      color: 'bg-orange-500'
    },
    {
      id: 'mtn_money' as PaymentMethod,
      name: t('order.mtnMoney'),
      icon: Smartphone,
      description: 'Paiement via MTN Money',
      color: 'bg-yellow-500'
    },
    {
      id: 'paypal' as PaymentMethod,
      name: t('order.paypal'),
      icon: CreditCard,
      description: 'Paiement via PayPal',
      color: 'bg-blue-500'
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: t('order.bankTransfer'),
      icon: Building2,
      description: 'Virement bancaire',
      color: 'bg-purple-500'
    }
  ];