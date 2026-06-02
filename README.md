# Hackaton-MILKS
VitaPrev - Documentação Oficial do Projeto

Grupo: MILKS
Integrantes: Lívia Beatriz Gil Da Silva, 
Mariangel Del Valle Hernandez Paz, 
Kalebe Kramer, 
Isabella Wentz de Souza

1. O que é o VitaPrev?
O VitaPrev é uma plataforma digital de saúde preventiva de modelo corporativo que atua como um tradutor de exames laboratoriais para o paciente comum. Ele transforma dados de laudos complexos em explicações visuais, simples e fáceis de entender, integrando os resultados médicos a rotinas de sono e nutrição. O site é 100 % responsiva.

2. Desafio
O paciente comum enfrenta uma enorme barreira ao receber um laudo laboratorial: a linguagem técnica e os números isolados.
Ao sair de um laboratório com os resultados de exames (como Glicemia ou TSH) em mãos, a pessoa frequentemente entra em um estado de ansiedade enquanto aguarda a consulta médica de retorno. Sem orientação rápida, recorre a buscas genéricas na internet, deparando-se com diagnósticos alarmantes, errados ou confusos que não refletem sua real condição de saúde. Além disso, os dados de saúde ficam fragmentados, sem conexão com os hábitos diários de alimentação e sono do indivíduo.

3. Principais Funcionalidades Implementadas
Módulo de Transcrição de Exames: O usuário faz o upload da foto do laudo e insere o valor do biomarcador. O sistema avalia e categoriza o resultado em três níveis (Bom, Moderado ou Alerta) para quatro categorias essenciais: Glicemia, Perfil Lipídico, Função Hepática e Tireoide.
Histórico e Galeria Digital: Todas as fotos dos exames enviados ficam salvas e organizadas cronologicamente no perfil do usuário.
Módulo de Nutrição: Contador manual de proteínas e carboidratos com gráficos diários em CSS para controle de metas e dicas de dieta.
Módulo de Sono: Registro de horas dormidas que analisa automaticamente a qualidade do descanso com gráficos de consistência.
Gestão de Perfil: Sistema completo de autenticação que permite cadastro, login seguro, edição de informações e exclusão definitiva de dados.

4. Modelo de Monetização (B2B)
A plataforma é comercializada no modelo B2B (Business to Business), sendo vendida diretamente para empresas, clínicas médicas e laboratórios de análises clínicas.
Proposta de valor: Os laboratórios contratam o VitaPrev como um portal de resultados de exames humanizado. Isso gera diferencial competitivo, aumenta a fidelização de pacientes e diminui o volume de chamados de suporte para tirar dúvidas sobre laudos laboratoriais.

5. Tecnologias Utilizadas
Back-End: Node.js com o framework Express.
Upload de Arquivos: Multer (gerenciamento seguro e salvamento das fotos dos exames na pasta do servidor).
Autenticação: Express-session (controle de sessões e proteção de rotas privadas).
Banco de Dados: MOCK
Front-End: HTML5, CSS profissional (responsivo para computadores e celulares utilizando a paleta de cores azul e verde medicinal e logo oficial) e JavaScript.

6. Estrutura do Banco de Dados (PostgreSQL)
O banco de dados relacional é estruturado em quatro tabelas principais:
usuarios: Dados cadastrais do paciente (ID, nome, e-mail, senha e idade).
exames: Registros vinculados ao usuário contendo tipo de exame, valor numérico, classificação obtida, mensagem de orientação, caminho da foto anexada e data.
nutricao: Histórico de refeições com nome do alimento, gramas de carboidratos, gramas de proteínas e data.
sono: Histórico de descanso contendo quantidade de horas dormidas, status de qualidade e data.

7. Instruções para Execução Local
Certifique-se de ter o Node.js e o pgAdmin4 instalados.
Crie um banco de dados chamado vitaprev no seu PostgreSQL e crie as tabelas baseadas na estrutura acima.
No terminal da pasta do projeto, instale as dependências executando:
npm install express express-session multer pg
Coloque o arquivo de logotipo na pasta public/logo.png.
Configure suas credenciais de acesso locais do banco no módulo de conexão do servidor.
Inicie a aplicação com o comando:
node server.js
Acesse pelo navegador em: http://localhost:3000
