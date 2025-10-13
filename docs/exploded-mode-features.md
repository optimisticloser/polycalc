# Funcionalidades Avançadas do Modo Explodido

Este documento descreve as funcionalidades avançadas implementadas no sistema de visualização explodida do PolyCalc.

## Overview

O sistema de visualização explodida foi expandido com funcionalidades avançadas que proporcionam uma experiência mais rica e interativa para explorar fórmulas matemáticas.

## Funcionalidades Implementadas

### 1. VarPopover com Integração AI

O `VarPopover` é um componente avançado que substitui o tooltip simples das variáveis, fornecendo:

- **Análise contextual da IA**: Gera insights personalizados sobre como cada variável afeta a fórmula atual
- **Informações detalhadas**: Exibe metadados completos da variável incluindo contexto, descrição e valores
- **Controles interativos**: Permite redefinir variáveis para seus valores padrão
- **Dicas inteligentes**: Mostra sugestões da IA otimizadas para o valor atual da variável

#### Como usar:
1. Passe o mouse sobre qualquer variável no modo explodido
2. O VarPopover aparecerá automaticamente com informações detalhadas
3. A IA analisará o contexto e fornecerá insights personalizados

### 2. Modo Explodido Expandido

O modo explodido agora está disponível para todas as fórmulas principais:

#### Fórmulas com suporte:
- **Quadrática**: `y = ax² + bx + c`
- **Predador-Presa**: Sistema Lotka-Volterra
- **Onda Senoidal**: `x(t) = A cos(ωt + φ)`
- **Fórmula de Euler**: `re^(iθ)`

#### Características do modo explodido:
- **Visualização de componentes**: Cada variável é exibida como um token separado
- **Fórmula completa interativa**: A fórmula completa com variáveis clicáveis
- **Contexto enriquecido**: Informações detalhadas sobre cada componente

### 3. Gerenciador de Cenários Multi-variáveis

O `ScenarioManager` permite criar, salvar e comparar diferentes configurações de variáveis:

#### Funcionalidades:
- **Criação de cenários**: Salve o estado atual das variáveis como um cenário nomeado
- **Cenários pré-definidos**: Acessa cenários embutidos para cada fórmula
- **Comparação de cenários**: Compare diferentes configurações lado a lado
- **Aplicação rápida**: Restaure cenários salvos com um clique
- **Persistência local**: Cenários são salvos no navegador entre sessões

#### Como usar:
1. Ajuste as variáveis para a configuração desejada
2. Clique em "Novo Cenário" no painel de cenários
3. Dê um nome e descrição opcional
4. Use os botões de ação para aplicar, comparar ou excluir cenários

### 4. Metadados Enriquecidos

Todas as fórmulas agora possuem metadados detalhados que incluem:

- **Contexto de IA**: Informações específicas para ajudar a IA a fornecer melhores insights
- **Dicas inteligentes**: Sugestões contextuais para cada variável
- **Cenários pré-definidos**: Configurações de exemplo que demonstram comportamentos interessantes
- **Informações contextuais**: Explicações sobre o papel de cada variável na fórmula

## Integração com Sistema Existente

### Compatibilidade
- Todas as funcionalidades são totalmente compatíveis com o sistema existente
- O modo explodido pode ser alternado com o modo padrão
- Cenários são específicos para cada fórmula
- A integração AI funciona com o sistema de tutor existente

### Performance
- Os insights da IA são carregados sob demanda
- Cenários são armazenados localmente para acesso rápido
- O sistema foi otimizado para minimizar impacto na performance

## Uso Avançado

### Dicas para Professores
1. Use cenários pré-definidos para demonstrar conceitos-chave
2. Crie cenários personalizados para exercícios específicos
3. Utilize o modo explodido para explicar componentes individuais
4. Aproveite os insights da IA para fornecer contexto adicional

### Dicas para Estudantes
1. Explore diferentes cenários para entender o comportamento das fórmulas
2. Use o VarPopover para obter explicações detalhadas
3. Compare cenários para ver como pequenas mudanças afetam os resultados
4. Crie seus próprios cenários para testar hipóteses

## Implementação Técnica

### Arquitetura
- **Componentes modulares**: Cada funcionalidade é implementada como um componente independente
- **Estado centralizado**: Utiliza Zustand para gerenciamento de estado
- **Integração AI**: Conecta-se ao sistema de tutor existente
- **Persistência**: Usa localStorage para cenários personalizados

### Extensibilidade
O sistema foi projetado para ser facilmente extensível:
- Novas fórmulas podem ser adicionadas com metadados completos
- Cenários pré-definidos podem ser expandidos
- O sistema de IA pode ser estendido para fornecer mais tipos de insights

## Futuras Melhorias

Possíveis melhorias planejadas:
- Suporte para exportação/importação de cenários
- Análise de sensibilidade automática
- Visualizações comparativas de cenários
- Modo colaborativo para compartilhamento de cenários
- Integração com sistemas de aprendizado externos

## Conclusão

As funcionalidades avançadas do modo explodida transformam a experiência de aprendizado matemático, proporcionando:
- Compreensão mais profunda dos componentes das fórmulas
- Experimentação guiada através de cenários
- Insights personalizados através de IA
- Interface intuitiva e responsiva

Essas funcionalidades representam um avanço significativo na forma como estudantes e professores podem interagir com conceitos matemáticos complexos.