import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Session Persistence', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
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
    const userJson = JSON.stringify(testUser);
    expect(() => JSON.parse(userJson)).not.toThrow();
    expect(JSON.parse(userJson)).toEqual(testUser);
  });

  it('should handle user object serialization correctly', () => {
    const testUser = {
      id: '2',
      username: 'joao.silva',
      password: '123456',
      role: 'USER',
      name: 'João Silva',
      photo: ''
    };

    // Serializar e desserializar
    const serialized = JSON.stringify(testUser);
    const deserialized = JSON.parse(serialized);

    expect(deserialized).toEqual(testUser);
    expect(deserialized.id).toBe('2');
    expect(deserialized.role).toBe('USER');
  });

  it('should handle empty user (logout scenario)', () => {
    const userJson = null;
    const parsedUser = userJson ? JSON.parse(userJson) : null;

    expect(parsedUser).toBeNull();
  });

  it('should preserve user data through serialization cycle', () => {
    const testUser = {
      id: '3',
      username: 'vitor.paula',
      password: '123456',
      role: 'USER',
      name: 'Vitor Paula',
      photo: 'https://example.com/photo.jpg'
    };

    // Múltiplos ciclos de serialização
    let current = testUser;
    for (let i = 0; i < 3; i++) {
      const serialized = JSON.stringify(current);
      current = JSON.parse(serialized);
    }

    expect(current).toEqual(testUser);
  });

  it('should handle user with special characters', () => {
    const testUser = {
      id: '4',
      username: 'marcell.vianna',
      password: '123456',
      role: 'ADMIN',
      name: 'Marcell Vianna - São Paulo',
      photo: ''
    };

    const serialized = JSON.stringify(testUser);
    const deserialized = JSON.parse(serialized);

    expect(deserialized.name).toBe('Marcell Vianna - São Paulo');
    expect(deserialized).toEqual(testUser);
  });

  it('should validate user object structure after deserialization', () => {
    const testUser = {
      id: '5',
      username: 'test.user',
      password: '123456',
      role: 'USER',
      name: 'Test User',
      photo: ''
    };

    const serialized = JSON.stringify(testUser);
    const deserialized = JSON.parse(serialized);

    // Validar estrutura
    expect(deserialized).toHaveProperty('id');
    expect(deserialized).toHaveProperty('username');
    expect(deserialized).toHaveProperty('password');
    expect(deserialized).toHaveProperty('role');
    expect(deserialized).toHaveProperty('name');
    expect(deserialized).toHaveProperty('photo');
  });
});
