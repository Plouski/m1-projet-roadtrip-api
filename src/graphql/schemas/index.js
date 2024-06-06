const typeDefs = `

scalar Upload

type User {
    id: ID!
    firstname: String
    lastname: String
    email: String!
    password: String!
    admin: Boolean
}

input UserInput {
    firstname: String
    lastname: String
    email: String
    password: String
}

type Roadtrip {
    id: ID!
    title: String!
    description: String
    duration: Int!
    image: String
    user_id: ID!
}

input RoadtripInput {
    title: String
    description: String
    duration: Int
    image: Upload
    user_id: ID!
}

type RoadtripStep {
    id: ID!
    roadtrip_id: ID!
    title: String!
    location: String!
    description: String
}

input RoadtripStepInput {
    roadtrip_id: ID
    title: String
    location: String
    description: String
}

type Response {
    success: Boolean!
    message: String!
}

type JWT {
    token: String!
}

input FiltersInput {
    duration: Int
}

input UploadImageInput {
    filename: String!
    mimetype: String!
    encoding: String!
    buffer: Upload!
}

type Query {
    getProfil: User!
    getRoadtrips: [Roadtrip!]!
    getMyRoadtrips: [Roadtrip!]!
    getRoadtripById(id: ID!): Roadtrip
    getRoadtripSteps(roadtrip_id: ID!): [RoadtripStep!]!
    getRoadtripStepById(id: ID!): RoadtripStep
    getDurationOptions: [Int!]!
}

type Mutation {
    register(user: UserInput!): JWT!
    login(user: UserInput!): JWT!
    updateProfil(user: UserInput!): User!

    createRoadtrip(roadtrip: RoadtripInput!): Roadtrip!
    updateRoadtrip(id: ID!, roadtrip: RoadtripInput!): Roadtrip!
    deleteRoadtrip(id: ID!): Response!

    createRoadtripStep(roadtripstep: RoadtripStepInput!): RoadtripStep!
    updateRoadtripStep(id: ID!, roadtripstep: RoadtripStepInput!): RoadtripStep!
    deleteRoadtripStep(id: ID!): Response!

    uploadImage(image: UploadImageInput!): String!


}


`;

  module.exports = typeDefs;