import { UseFormSetValue } from 'react-hook-form';
import { useState } from 'react';

export const useCep = (setValue: UseFormSetValue<any>) => {
  const [loading, setLoading] = useState(false)

  const buscarEndereco = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setValue('endereco', data.logradouro);
        setValue('bairro', data.bairro);
        setValue('cidade', data.localidade);
        setValue('estado', data.uf);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  return { buscarEndereco, loading };
} 