module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define("Favorites", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.TEXT
    },
    link: {
      type: DataTypes.TEXT
    },
    is_closed: {
      type: DataTypes.BOOLEAN
    },
    restaurant_id: {
      type: DataTypes.TEXT
    },
    display_phone: {
      type: DataTypes.STRING
    },
    // display_address: {
    //   type: DataTypes.JSON
    // },
    // category: {
    //   type: DataTypes.JSON
    // },
    latitude: {
      type: DataTypes.INTEGER
    },
    longitude: {
      type: DataTypes.INTEGER
    },
    distance: {
      type: DataTypes.INTEGER
    },
    // transactions: {
    //   type: DataTypes.JSON
    // },
    createdAt: {
      allowNull: true,
      defaultValue: new Date(),
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      defaultValue: new Date(),
      type: DataTypes.DATE
    }
  });

    Favorites.associate = function(models) {
      Favorites.belongsTo(models.Users, {
        foreignKey: {
          allowNull: false
        }
      });
    };

  return Favorites;
};
