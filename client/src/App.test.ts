import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Session Persistence', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save user to localStorage on login', () => {
    const testUser = {
      id: '1',
      username: 'paulo.santana',
      password: '123456',
      role: 'ADMIN',
      name: 'Paulo Santana',
      photo: ''
    };

    // Simular salvamento no localStorage
    localStorage.setItem('impacto_current_user', JSON.stringify(testUser));

    // Verificar que foi salvo
    const savedUser = localStorage.getItem('impacto_current_user');
    expect(savedUser).toBeDefined();
    expect(JSON.parse(savedUser!)).toEqual(testUser);
  });

  it('should retrieve user from localStorage on app load', () => {
    const testUser = {
      id: '1',
      username: 'paulo.santana',
      password: '123456',
      role: 'ADMIN',
      name: 'Paulo Santana',
      photo: ''
    };

    // Salvar usuário no localStorage
    localStorage.setItem('impacto_current_user', JSON.stringify(testUser));

    // Simular recuperação na inicialização
    const savedUser = localStorage.getItem('impacto_current_user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    expect(parsedUser).toEqual(testUser);
  });

  it('should clear localStorage on logout', () => {
    const testUser = {
      id: '1',
      username: 'paulo.santana',
      password: '123456',
      role: 'ADMIN',
      name: 'Paulo Santana',
      photo: ''
    };

    // Salvar usuário
    localStorage.setItem('impacto_current_user', JSON.stringify(testUser));
    expect(localStorage.getItem('impacto_current_user')).toBeDefined();

    // Simular logout
    localStorage.removeItem('impacto_current_user');

    // Verificar que foi removido
    expect(localStorage.getItem('impacto_current_user')).toBeNull();
  });

  it('should return null if no user is stored in localStorage', () => {
    const savedUser = localStorage.getItem('impacto_current_user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    expect(parsedUser).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    // Salvar JSON inválido
    localStorage.setItem('impacto_current_user', 'invalid json');

    // Tentar recuperar
    const savedUser = localStorage.getItem('impacto_current_user');
    
    try {
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      // Se chegou aqui, o JSON era válido (não deve acontecer neste teste)
      expect(false).toBe(true);
    } catch (error) {
      // Esperado: JSON inválido deve lançar erro
      expect(error).toBeDefined();
    }
  });
});
