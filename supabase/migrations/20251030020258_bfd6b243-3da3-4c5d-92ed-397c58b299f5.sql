-- Migration Parte 1: Adicionar novo valor ao enum
-- Este valor precisa ser commitado antes de ser usado

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cliente';