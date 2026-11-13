import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { mkdir } from 'node:fs/promises';

await mkdir('data', { recursive: true });

export const db = await open({
  filename: 'data/database.sqlite',
  driver: sqlite3.Database,
});

await db.exec('PRAGMA foreign_keys = ON');

await db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    ativo INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT
  );

  CREATE TABLE IF NOT EXISTS fornecedores (
    id TEXT PRIMARY KEY,
    razaoSocial TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    contato TEXT
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    categoria TEXT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
  );
`);

console.log('Banco SQLite conectado e tabelas verificadas.');
