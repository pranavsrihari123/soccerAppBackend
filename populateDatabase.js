const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const config = require('./config/config.json'); // Update the path accordingly

const sequelize = new Sequelize(config.development); // Use the 'development' configuration

// Define models
const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false,
  },
  username: { type: DataTypes.STRING(255), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  user_role: { type: DataTypes.ENUM('player', 'host'), allowNull: false },
  first_name: { type: DataTypes.STRING(255), allowNull: false },
  last_name: { type: DataTypes.STRING(255), allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY },
  skill_level: { type: DataTypes.STRING(20), allowNull: false },
  rating: { type: DataTypes.NUMERIC(6, 2) },
  gender: { type: DataTypes.STRING(10), allowNull: false },
});

const Team = sequelize.define('team', {
  team_name: { type: DataTypes.STRING(255), allowNull: false },
  team_rating: { type: DataTypes.NUMERIC(6, 2), defaultValue: 0 },
  number_of_players: { type: DataTypes.INTEGER, defaultValue: 1 },
  max_number_of_players: { type: DataTypes.INTEGER },
  type_of_sport: { type: DataTypes.STRING(20), allowNull: false },
  intensity: { type: DataTypes.STRING(20), allowNull: false },
  gender: { type: DataTypes.STRING(20), allowNull: false },
});

const ImportantDate = sequelize.define('important_date', {
  event_name: { type: DataTypes.STRING(255), allowNull: false },
  event_date: { type: DataTypes.DATE, allowNull: false },
});

const Court = sequelize.define('court', {
  court_name: { type: DataTypes.STRING(255), allowNull: false },
  latitude: { type: DataTypes.DOUBLE, allowNull: false },
  longitude: { type: DataTypes.DOUBLE, allowNull: false },
  number_of_courts: { type: DataTypes.INTEGER, allowNull: false },
  court_photo_path: { type: DataTypes.STRING(255) },
});

const Field = sequelize.define('field', {
  field_name: { type: DataTypes.STRING(255), allowNull: false },
  latitude: { type: DataTypes.DOUBLE, allowNull: false },
  longitude: { type: DataTypes.DOUBLE, allowNull: false },
  number_of_fields: { type: DataTypes.INTEGER, allowNull: false },
  field_photo_path: { type: DataTypes.STRING(255) },
});

const Game = sequelize.define('game', {
  game_date: { type: DataTypes.DATE },
  game_time: { type: DataTypes.TIME },
});

// Define associations
Team.hasMany(User, { foreignKey: 'team_id' });
User.belongsTo(Team, { foreignKey: 'team_id' });

ImportantDate.belongsTo(User, { foreignKey: 'user_id' });
Court.hasMany(Game, { foreignKey: 'court_id' });
Field.hasMany(Game, { foreignKey: 'field_id' });

// Sync the database and populate with random data
sequelize.sync({ force: true }) // Using force: true will drop tables and recreate them
  .then(async () => {
    // Populate users
    const users = await User.bulkCreate(Array.from({ length: 10 }, () => ({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        user_role: faker.random.arrayElement(['player', 'host']),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        date_of_birth: faker.date.past(30), // Random date within the last 30 years
        skill_level: faker.random.arrayElement(['beginner', 'intermediate', 'advanced']),
        rating: faker.random.float({ min: 1, max: 5, precision: 0.1 }),
        gender: faker.random.arrayElement(['male', 'female']),
    })));

    // Populate teams
    const teams = await Team.bulkCreate(Array.from({ length: 5 }, () => ({
      team_name: faker.company.companyName(),
      type_of_sport: faker.random.arrayElement(['basketball', 'soccer', 'football']),
      intensity: faker.random.arrayElement(['casual', 'competitive']),
      gender: faker.random.arrayElement(['men', 'women', 'co-ed']),
    })));

    // Populate important dates
    const importantDates = await ImportantDate.bulkCreate(Array.from({ length: 5 }, () => ({
      event_name: faker.random.word(),
      event_date: faker.date.future(),
      user_id: faker.random.arrayElement(users).id,
    })));

    // Populate courts
    const courts = await Court.bulkCreate(Array.from({ length: 3 }, () => ({
      court_name: faker.address.streetName(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      number_of_courts: faker.random.number({ min: 1, max: 5 }),
      court_photo_path: faker.image.imageUrl(),
    })));

    // Populate fields
    const fields = await Field.bulkCreate(Array.from({ length: 3 }, () => ({
      field_name: faker.address.streetName(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      number_of_fields: faker.random.number({ min: 1, max: 5 }),
      field_photo_path: faker.image.imageUrl(),
    })));

    // Populate games
    const games = await Game.bulkCreate(Array.from({ length: 10 }, () => ({
      game_date: faker.date.future(),
      game_time: faker.date.future(),
      court_id: faker.random.arrayElement(courts).id,
      field_id: faker.random.arrayElement(fields).id,
    })));

    console.log('Database populated with random values.');
})
.catch((error) => console.error('Error syncing and populating the database:', error))
.finally(() => sequelize.close());
