module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        readOnly: true,
        primaryKey: true,
      },
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      EmailId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "EmailId",
        primaryKey: true,
        validate: {
          isEmail: true,
        },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: "account_created",
      updatedAt: "account_updated",
    }
  );
  return User;
};
