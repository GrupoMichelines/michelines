import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const driverFormSchema = z.object({
  // Dados Pessoais
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  celular: z.string().min(11, 'Celular/WhatsApp inválido'),
  email: z.string().email('Email inválido').optional(),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  condutax: z.string().min(1, 'Número do Condutax é obrigatório'),
  validadeCondutax: z.string().min(1, 'Validade do Condutax é obrigatória'),
  
  // Endereço
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
});

export type DriverFormData = z.infer<typeof driverFormSchema>;

export const useForm = () => {
  const form = useHookForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema),
    mode: 'onChange',
  });

  return form;
}; 