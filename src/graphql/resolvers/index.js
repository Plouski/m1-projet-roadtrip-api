const db = require("../../models");
const generateToken = require("../../helpers/generateToken");
const bcrypt = require("bcryptjs");
const ensureUserIsLogged = require("../validators");
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const { sendConfirmationEmail } = require('../../utils/sendConfirmationMail');


// const uploadImage = async (image) => {
//     try {
//       // Créer un répertoire pour stocker les images téléchargées s'il n'existe pas déjà
//       const uploadDir = path.join(__dirname, 'uploads');
//       console.log(uploadDir);
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }
  
//       // Générer un nom de fichier unique pour l'image
//       const filename = `${uuidv4()}_${image.originalname}`;
  
//       // Chemin complet où l'image sera stockée
//       const filePath = path.join(uploadDir, filename);
  
//       // Écrire le fichier sur le disque
//       await fs.promises.writeFile(filePath, image.buffer);
  
//       // Retourner le chemin d'accès de l'image relative au répertoire public
//       return `/uploads/${filename}`;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw new Error('Failed to upload image');
//     }
// }

const resolvers = {

    Query: {

        //Obtenir les informations du profil de l'user authentifié
        getProfil: async (parent, args, context, info) => {

            ensureUserIsLogged(context);

            try {

                const user = await db.User.findByPk(context.user.id);
        
                if (!user) {

                    throw new Error('User profile not found');

                }
        
                return user;

            } catch (error) {

                throw new Error(`Failed to get my profile: ${error.message}`);

            }
        },

        //Obtenir tous les roadtrips
        getRoadtrips: async (parent, args, context, info) => {

            try {

                const roadtrips = await db.Roadtrip.findAll(
                    
                );
        
                return roadtrips;

            } catch (error) {

                throw new Error(`Failed to fetch roadtrips: ${error.message}`);

            }
        },

        //Obtenir tous les roadtrips de l'user authentifé
        getMyRoadtrips: async (parent, args, context, info) => {

            ensureUserIsLogged(context);

            try {

                const user = await db.User.findByPk(context.user.id);

                const roadtrips = await db.Roadtrip.findAll(
                    {
                        where: {

                            user_id: user.id

                        }
                    }
                );
    
                if (roadtrips.length === 0) {

                    throw new Error('No roadtrips found');

                }
    
                return roadtrips;

            } catch (error) {

                throw new Error(`Failed to get my roadtrips: ${error.message}`);

            }

        },

        //Obtenir un roadtrip par ID
        getRoadtripById: async (parent, args, context, info) => {

            try {

                const { id } = args;
                
                const roadtrip = await db.Roadtrip.findByPk(id);

                if (!roadtrip) {

                    throw new Error('Roadtrip not found');

                }

                return roadtrip;

            } catch (error) {

                throw new Error(`Failed to fetch roadtrip: ${error.message}`);

            }
        },

        //Recuperer tous les roadtrip steps du roadtrip choisi
        getRoadtripSteps: async (parent, args, context, info) => {
            try {
                const { roadtrip_id } = args; // Assurez-vous que l'argument est correctement déstructuré

                // Assurez-vous que le paramètre "roadtrip_id" est défini
                if (!roadtrip_id) {
                    throw new Error("Roadtrip ID is required.");
                }

                // Remplacez cette partie par votre logique de récupération des étapes du roadtrip
                const roadtripSteps = await db.RoadtripStep.findAll({
                    where: { roadtrip_id } // Utilisez le paramètre "roadtrip_id"
                });

                return roadtripSteps;
            } catch (error) {
                throw new Error(`Failed to fetch roadtrip steps: ${error.message}`);
            }
        },

        //Obtenir un roadtrip step par ID
        getRoadtripStepById: async (parent, args, context, info) => {

            try {

                const { id } = args;

                const roadtripStep = await db.RoadtripStep.findByPk(id);

                if (!roadtripStep) {

                    throw new Error("Roadtrip step not found");

                }

                return roadtripStep;

            } catch (error) {

                throw new Error(`Failed to fetch roadtrip step: ${error.message}`);

            }
        },

        //Recuperer l'option de la durée
        getDurationOptions: async () => {

            try {

              const roadtrips = await db.Roadtrip.find();

              const durations = [...new Set(roadtrips.map(roadtrip => roadtrip.duration))];

              return durations;

            } catch (error) {

              console.error('Error fetching duration options:', error);

              throw new Error('Failed to fetch duration options');

            }

        },
    },

    Mutation: {

        //Inscription
        register: async (parent, args, context, info) => {

            try {

                const { email, password, firstname, lastname } = args.user;
        
                if (!email || !password || !firstname || !lastname) {

                    throw new Error('Email, password, firstname, and lastname are required');

                }
        
                const existingUser = await db.User.findOne({ where: { email } });
        
                if (existingUser) {

                    throw new Error('Email already exists');

                }
        
                const salt = await bcrypt.genSalt(10);

                const hashedPassword = await bcrypt.hash(password, salt);
        
                const user = await db.User.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassword
                });

                // await sendConfirmationEmail(email);
        
                const token = generateToken({ id: user.id });
        
                return { token: token };

            } catch (error) {

                throw new Error(`Failed to register user: ${error.message}`);

            }
        },
        
        //Connexion
        login: async (parent, args, context, info) => {

            try {  

                const { email, password } = args.user;

                if(!email || !password) {

                    throw new Error('Email and password are required');

                }

                const existingUser = await db.User.findOne({ where: { email } });

                if (!existingUser) {

                    throw new Error('User not found');

                }

                const validPassword = await bcrypt.compare(password, existingUser.password);

                if (!validPassword) {

                    throw new Error('Invalid password');

                }

                const token = generateToken({ id: existingUser.id });

                return { token };

            }
            catch (error) {

                throw new Error(`Failed to login: ${error.message}`);

            }
        },

        //Mise à jour du profil
        updateProfil: async (parent, args, context, info) => {

            ensureUserIsLogged(context);

            try {

                const { firstname, lastname, email } = args.user;
    
                const user = await db.User.findByPk(context.user.id);
    
                user.firstname = firstname;
                user.lastname = lastname;
                user.email = email;
    
                await user.save();
    
                return user;

            } catch (error) {

                throw new Error(`Failed to update user profile: ${error.message}`);

            }
        },

        //Creation de roadtrip
        createRoadtrip: async (parent, args, context, info) => {
            ensureUserIsLogged(context);
          
            try {
                const { user } = context;

                if (!user) {
                    throw new Error('User not found');
                }

                const { title, description, duration, image } = args.roadtrip;
          
                if (!title || !duration) {
                    throw new Error('Title and duration are required');
                }       

                //const imagePath = await uploadImage(image); // Function to handle image upload
          
                const roadtrip = await db.Roadtrip.create({
                    title: title,
                    description: description,
                    duration: duration,
                    user_id: user.id,
                    //image: imagePath,
                    //image: image,
                });
          
              return roadtrip;
            } catch (error) {
              throw new Error(`Failed to create roadtrip: ${error.message}`);
            }
        },

        //Mise à jour du roadtrip
        updateRoadtrip: async (parent, args, context, info) => {

            ensureUserIsLogged(context);
        
            try {

                const { id, roadtrip: roadtripData } = args;

                const userId = context.user.id;
                
                const existingRoadtrip = await db.Roadtrip.findByPk(id);
        
                if (!existingRoadtrip) {

                    throw new Error("Roadtrip not found");

                }
                
                if (existingRoadtrip.user_id !== userId) {

                    throw new Error("Unauthorized: You are not allowed to update this roadtrip");

                }
        
                const { title, description, duration, image } = roadtripData;
        
                if (!title || !description || !duration) {

                    throw new Error("Title, description and duration are required");

                }
        
                await existingRoadtrip.update({
                    title: title,
                    description: description,
                    duration: duration,
                    // image: image
                });
        
                const updatedRoadtrip = await db.Roadtrip.findByPk(id);
        
                return updatedRoadtrip;

            } catch (error) {

                throw new Error(`Failed to update this roadtrip: ${error.message}`);

            }
        },

        //Suppresion de roadtrip
        deleteRoadtrip: async (parent, args, context, info) => {

            ensureUserIsLogged(context);
        
            try {

                const { id } = args;

                const userId = context.user.id; 
        
                const existingRoadtrip = await db.Roadtrip.findByPk(id);

                if (!existingRoadtrip) {

                    throw new Error("Roadtrip not found");

                }
        
                if (existingRoadtrip.user_id !== userId) {

                    throw new Error("Unauthorized: You are not allowed to delete this roadtrip");

                }
        
                await existingRoadtrip.destroy();
        
                return {                    
                    success: true,
                    message: "Roadtrip deleted successfully"
                }

            } catch (error) {

                throw new Error(`Failed to delete this roadtrip: ${error.message}`);

            }
        },

        //Creation d'une étape de roadtrip choisi
        createRoadtripStep: async (parent, args, context, info) => {

            ensureUserIsLogged(context);
        
            try {
                const { user } = context;
                const { roadtrip_id, title, location, description } = args.roadtripstep;
        
                if (!roadtrip_id || !title || !location) {
                    throw new Error('Roadtrip ID, title, and location are required');
                }
        
                const roadtrip = await db.Roadtrip.findOne({
                    where: { id: roadtrip_id, user_id: user.id }
                });
        
                if (!roadtrip) {
                    throw new Error('Unauthorized access to roadtrip');
                }
        
                const newRoadtripStep = await db.RoadtripStep.create({
                    roadtrip_id: roadtrip_id,
                    title: title,
                    location: location,
                    description: description,
                    user_id: user.id,
                });
        
                return newRoadtripStep;
            } catch (error) {
                throw new Error(`Failed to create roadtrip step: ${error.message}`);
            }
        },
        
        //Mise à jour de l'étape de roadtrip choisi
        updateRoadtripStep: async (parent, args, context, info) => {

            ensureUserIsLogged(context);

            try {
        
                const { user } = context;
        
                const { id } = args;
        
                const roadtripStep = await db.RoadtripStep.findByPk(id);
        
                if (!roadtripStep) {

                    throw new Error('Roadtrip step not found');

                }
        
                const roadtrip = await db.Roadtrip.findOne({

                    where: { id: roadtripStep.roadtrip_id, user_id: user.id }

                });
        
                if (!roadtrip) {

                    throw new Error('Unauthorized access to roadtrip');

                }
        
                await roadtripStep.update(args.roadtripstep);
        
                return roadtripStep;

            } catch (error) {

                throw new Error(`Failed to update this roadtrip step: ${error.message}`);

            }
        },

        //Suppresion de roadtrip
        deleteRoadtripStep: async (parent, args, context, info) => {

            ensureUserIsLogged(context);

            try {

                const { user } = context;
        
                const { id } = args;
        
                const roadtripStep = await db.RoadtripStep.findByPk(id);
        
                if (!roadtripStep) {

                    throw new Error('Roadtrip step not found');
                }
        
                const roadtrip = await db.Roadtrip.findOne({

                    where: { id: roadtripStep.roadtrip_id, user_id: user.id }

                });
        
                if (!roadtrip) {

                    throw new Error('Unauthorized access to roadtrip');

                }
        
                await roadtripStep.destroy();
        
                return {                    
                    success: true,
                    message: "Roadtripstep deleted successfully"
                }

            } catch (error) {

                throw new Error(`Failed to delete thisroadtrip step: ${error.message}`);

            }
        },

    }
};

module.exports = resolvers;
