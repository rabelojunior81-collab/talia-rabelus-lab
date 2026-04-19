# ESTÁGIO 1: BUILD (Empacotamento)
FROM node:22-alpine as builder

WORKDIR /app

# Argumento para que a Key de API possa ser assada no Build Estático
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
# Usando flag do vite para plugar variables do SO se necessário
ENV VITE_GEMINI_API_KEY=$GEMINI_API_KEY

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Fazemos o build final, que gera a pasta dist/
RUN npm run build


# ESTÁGIO 2: SERVER (Servindo código estático via proxy leve)
FROM nginx:alpine

# Removendo a página de boas vindas html padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia nossa configuração de roteamento que trata do SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiando os estáticos minificados do Estágio 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
