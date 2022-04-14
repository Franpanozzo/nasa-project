# La version de node que usa nuestra imagen y el SO que va a estar corriendo en nuestro container (todo es una misma imagen sacada de dockerhub)
FROM node:14.15.1-alpine

WORKDIR /app
# El primer parametero el source, con el punto decimos nuestra carpeta (en la q estamos parados), y con el otro punto el destination decimos q es app
#COPY . .  
# Solamente pasamos el package.json pq es lo unico que necesita para hacer el install y buildear - y va la barra para que sepa que va a estar dentro de una carpeta
COPY package*.json ./
COPY client/package*.json client/
RUN npm install --prefix client --only=production
#Con --only=production le decimos a node que no instale las dev dependencies 

COPY server/package*.json server/
RUN npm install --prefix server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# para que no corra la aplicacion un usuario root, sino un usuario con menos privilegios, la imagen de node nos da ese 'grupo'
USER node 

# se ve que separamos en dos el npm run deploy para que nos quede un ultimo comando para el CMD
CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000