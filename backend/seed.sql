-- Seed completo para o banco de dados
-- Execute este SQL inteiro no SQL Editor do Supabase

-- Limpar dados existentes (cuidado!)
TRUNCATE TABLE video_progress, videos, modules CASCADE;

-- Módulo 1: Introdução ao Desenvolvimento Web
WITH mod1 AS (
  INSERT INTO modules (id, title, description, "order", "createdAt", "updatedAt") 
  VALUES (gen_random_uuid(), 'Introdução ao Desenvolvimento Web', 'Aprenda os fundamentos do desenvolvimento web moderno', 1, NOW(), NOW())
  RETURNING id
)
INSERT INTO videos (id, title, description, url, duration, "order", "moduleId", "createdAt", "updatedAt") 
SELECT 
  gen_random_uuid(),
  title,
  description,
  url,
  duration,
  "order",
  (SELECT id FROM mod1),
  NOW(),
  NOW()
FROM (VALUES
  ('O que é Desenvolvimento Web?', 'Introdução aos conceitos básicos de desenvolvimento web', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 600, 1),
  ('HTML Básico', 'Aprenda a estrutura básica de um documento HTML', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 900, 2),
  ('CSS Fundamentos', 'Estilizando páginas web com CSS', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1200, 3)
) AS v(title, description, url, duration, "order");

-- Módulo 2: JavaScript Moderno
WITH mod2 AS (
  INSERT INTO modules (id, title, description, "order", "createdAt", "updatedAt") 
  VALUES (gen_random_uuid(), 'JavaScript Moderno', 'Domine JavaScript ES6+ e suas funcionalidades', 2, NOW(), NOW())
  RETURNING id
)
INSERT INTO videos (id, title, description, url, duration, "order", "moduleId", "createdAt", "updatedAt") 
SELECT 
  gen_random_uuid(),
  title,
  description,
  url,
  duration,
  "order",
  (SELECT id FROM mod2),
  NOW(),
  NOW()
FROM (VALUES
  ('Variáveis e Tipos de Dados', 'let, const e tipos de dados em JavaScript', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 800, 1),
  ('Funções e Arrow Functions', 'Trabalhando com funções modernas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1000, 2),
  ('Promises e Async/Await', 'Programação assíncrona em JavaScript', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1500, 3)
) AS v(title, description, url, duration, "order");

-- Módulo 3: React Fundamentals
WITH mod3 AS (
  INSERT INTO modules (id, title, description, "order", "createdAt", "updatedAt") 
  VALUES (gen_random_uuid(), 'React Fundamentals', 'Construa interfaces modernas com React', 3, NOW(), NOW())
  RETURNING id
)
INSERT INTO videos (id, title, description, url, duration, "order", "moduleId", "createdAt", "updatedAt") 
SELECT 
  gen_random_uuid(),
  title,
  description,
  url,
  duration,
  "order",
  (SELECT id FROM mod3),
  NOW(),
  NOW()
FROM (VALUES
  ('Introdução ao React', 'O que é React e por que usá-lo', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 700, 1),
  ('Componentes e Props', 'Criando e reutilizando componentes', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1100, 2),
  ('Hooks: useState e useEffect', 'Gerenciamento de estado e efeitos colaterais', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1400, 3)
) AS v(title, description, url, duration, "order");

-- Verificar os dados inseridos
SELECT 'Módulos criados:' as info, COUNT(*) as total FROM modules
UNION ALL
SELECT 'Vídeos criados:', COUNT(*) FROM videos;

