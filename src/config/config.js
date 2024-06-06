const dotenv = require('dotenv');

// On récupère l'environnement dans lequel on se trouve (développement, production, test)
const environment = process.env.NODE_ENV || 'development';

let envFile;

// On détermine le fichier .env à utiliser en fonction de l'environnement
switch (environment) {
  case 'development':
    envFile = '.env.dev';
    break;
  case 'production':
    envFile = '.env.prod';
    break;
  default:
    envFile = '.env.dev';
    break;
}

// On charge les variables d'environnement du fichier .env
dotenv.config({ path: envFile });

// Destructuration des variables d'environnement dans le fichier .env
const { DB_USER, DB_PWD, DB_NAME, DB_HOST, DB_PORT, G_MAIL, G_PWD, JWT_SECRET } = process.env;

// Vérification des variables d'environnement obligatoires
if (!DB_USER || !DB_PWD || !DB_NAME || !DB_HOST || !DB_PORT || !G_MAIL || !G_PWD || !JWT_SECRET) {
  throw new Error('Please provide all required environment variables.');
}

// Configuration de sequelize pour se connecter à la base de données
const commonConfig = {
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  gmail: G_MAIL,
  gpwd: G_PWD,
  jwt_secret: JWT_SECRET,
  dialect: "mysql",
}

// Export de la configuration
module.exports = {
  development: commonConfig,
  test: commonConfig,
  production: commonConfig
};
